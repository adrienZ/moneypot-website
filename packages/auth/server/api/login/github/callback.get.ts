import { OAuth2RequestError } from "arctic";
import { DatabaseSessionAttributes, generateId } from "lucia";
import { ILuciaAuthNuxtAdaptater } from "~/schema";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const code = query.code?.toString() ?? null;
	const state = query.state?.toString() ?? null;
	const storedState = getCookie(event, "github_oauth_state") ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		throw createError({
			status: 400,
			message: "Missing Data"
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const db = useDatabaseQueries(event);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();
		let email = githubUser.email;

		// if (!email) {
		// 	const githubEmailsResponse = await fetch("https://api.github.com/user/emails", {
		// 		headers: {
		// 			Authorization: `Bearer ${tokens.accessToken}`
		// 		}
		// 	});

		// 	const githubEmails: GitHubEmail[] = await githubEmailsResponse.json();
		// 	const primaryEmail = githubEmails.find( emailData => emailData.primary && emailData.verified)?.email ?? null
		// 	email = primaryEmail
		// }

		/**
		 * as
			| DatabaseUser
			| undefined;
		 */
		// const [ existingUser ] = await db
		// 	.select()
		// 	.from(user)
		// 	.where(eq(user.githubId, githubUser.id));
		const existingUser = await db.getUser(undefined, {
			providerID: "github",
			providerUserID: githubUser.id
		})
		const lucia = useLuciaAuth(event);


		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
			return sendRedirect(event, "/");
		}

		const userId = generateId(15);

		const createdUser = await db.insertUser({
			externalId: userId,
			username: githubUser.login
		})

		db.insertOauthAccount({
			providerID: "github",
			providerUserID: githubUser.id,
			userId: createdUser.externalId,
		})

		const session = await lucia.createSession(createdUser.id, {});
		appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
		return sendRedirect(event, "/");
	} catch (e) {
		if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
			// invalid code
			throw createError({
				status: 400,
				message: String(e.description || e.message)
			});
		}
		

		throw createError({
			status: 500,
			message: String(e)
		});
	}
});

interface GitHubUser {
	id: string;
	login: string;
	email: string | null;
}

interface GitHubEmail {
	email: string,
	primary: boolean,
	verified: boolean
}
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { onUserCreation, onUserLogin } from "../../../../lib/onUserCreation"
import { github } from "../../../../lib/providers/github"

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

		if (!email) {
			const githubEmailsResponse = await fetch("https://api.github.com/user/emails", {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			});

			const githubEmails: GitHubEmail[] = await githubEmailsResponse.json();
			const primaryEmail = githubEmails.find( emailData => emailData.primary && emailData.verified)?.email ?? null
			email = primaryEmail
		}

		if (!email) {
			return createError({
				status: 400,
				message: "github user not verified"
			})
		}

		const existingUserByProvider = await db.getUser(undefined, {
			providerID: "github",
			providerUserID: githubUser.id,
		})

		const existingUserByEmail = await db.getUser(email)

		if (existingUserByEmail && !existingUserByEmail.emailVerified && !existingUserByProvider) {
			return createError({
				status: 400,
				message: "user email not verified"
			})
		}

		const existingUser = existingUserByProvider ?? existingUserByEmail
		if (existingUser) {
			onUserLogin(event, {
				email: existingUser.email,
				id: existingUser.id
			})
		}

		const userId = generateId(15);

		const createdUser = await db.insertUser({
			externalId: userId,
			username: githubUser.login,
			email,
			// as we verified it with primaryEmail const
			emailVerified: true
		})

		db.insertOauthAccount({
			providerID: "github",
			providerUserID: githubUser.id,
			userId: createdUser.externalId,
		})

		await onUserCreation(event, {
			email: createdUser.email,
			id: createdUser.id
		})
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
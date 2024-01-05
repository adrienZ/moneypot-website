import { DiscordTokens, OAuth2RequestError } from "arctic";
import { DatabaseSessionAttributes, generateId } from "lucia";
import { discord } from "../../../../lib/providers/discord";
import { onUserCreation, onUserLogin } from "../../../../lib/onUserCreation"

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const code = query.code?.toString() ?? null;
	const state = query.state?.toString() ?? null;
	const storedState = getCookie(event, "discord_oauth_state") ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		throw createError({
			status: 400,
			message: "Missing Data"
		});
	}

  try {
    const tokens: DiscordTokens = await discord.validateAuthorizationCode(code);
		const db = useDatabaseQueries(event);

		const discordUserResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

    const discordUser: DiscordUser = await discordUserResponse.json();

		if (!discordUser.verified) {
			return createError({
				status: 400,
				message: "user not verified"
			})
		}

    const existingUser = await db.getUser(undefined, {
			providerID: "discord",
			providerUserID: discordUser.id,
		})

		if (existingUser) {
			onUserLogin(event, {
				email: existingUser.email,
				id: existingUser.id
			})
		}

		const userId = generateId(15);

		const createdUser = await db.insertUser({
			externalId: userId,
			username: discordUser.global_name,
			email: discordUser.email,
			emailVerified: discordUser.verified
		})

		db.insertOauthAccount({
			providerID: "github",
			providerUserID: discordUser.id,
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

interface DiscordUser {
	id: string;
	global_name: string;
	email: string;
	verified: boolean,
}
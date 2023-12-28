import { DiscordTokens, OAuth2RequestError } from "arctic";
import { DatabaseSessionAttributes, generateId } from "lucia";
import { discord } from "../../../../lib/providers/discord";

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

    const existingUser = await db.getUser(undefined, {
			providerID: "discord",
			providerUserID: discordUser.id
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
			username: discordUser.global_name
		})

		db.insertOauthAccount({
			providerID: "github",
			providerUserID: discordUser.id,
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

    // const tokens: DiscordTokens = await discord.validateAuthorizationCode(code);
  // const tokens: DiscordTokens = await discord.refreshAccessToken(refreshToken);


  return "yo"
});

interface DiscordUser {
	id: string;
	global_name: string;
	email: string | null;
}
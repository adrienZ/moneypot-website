import { generateState } from "arctic";

export default defineEventHandler(async (event) => {
  const state = generateState();
  const url: URL = await myAuth.discord.createAuthorizationURL(state, {
    scopes: ["email", "identify"]
  });

  setCookie(event, "discord_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  return sendRedirect(event, url.toString());
});

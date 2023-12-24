import { GitHub } from "arctic";

export default defineEventHandler(async event => {
  // https://pilcrow.vercel.app/blog/oauth-guide
  // https://arctic.js.org/guides/oauth2
  
  const { clientId, clientSecret} = useRuntimeConfig().github;
  const github = new GitHub(clientId, clientSecret, {});

  const query = getQuery(event);

  const tokens = await github.validateAuthorizationCode(query.code);

  setCookie(event, "bearer", tokens.accessToken);

  const redirectPath = query.redirect?.toString() ?? "/"

  await sendRedirect(event, redirectPath, 301)
})
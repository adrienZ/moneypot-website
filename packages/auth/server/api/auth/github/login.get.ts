import { GitHub, generateState } from "arctic";


export default defineEventHandler(async event => {
  const { clientId, clientSecret} = useRuntimeConfig().github;
  const github = new GitHub(clientId, clientSecret, {});

  const state = generateState();
  const url = await github.createAuthorizationURL(state, {});

// // store state as cookie
// setCookie("state", state, {
// 	secure: true, // set to false in localhost
// 	path: "/",
// 	httpOnly: true,
// 	maxAge: 60 * 10 // 10 min
// });

  return {
    authEndpoint: url
  }
})
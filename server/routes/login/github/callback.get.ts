import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { createError } from "h3";

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
    const tokens = await myAuth.github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    let email = githubUser.email;

    if (!email) {
      const githubEmailsResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`
          }
        }
      );

      const githubEmails: GitHubEmail[] = await githubEmailsResponse.json();
      const primaryEmail =
        githubEmails.find(
          (emailData) => emailData.primary && emailData.verified
        )?.email ?? null;
      email = primaryEmail;
    }

    if (!email) {
      throw createError({
        status: 400,
        message: "github user not verified"
      });
    }

    const existingUserByProvider =
      await myAuth.oauthAccountTable.getByProviderData({
        providerID: "github",
        providerUserID: githubUser.id
      });

    const existingUserByEmail = await myAuth.userTable.getUserByEmail(email);

    if (
      existingUserByEmail &&
      !existingUserByEmail.emailVerified &&
      !existingUserByProvider
    ) {
      throw createError({
        status: 400,
        message: "user email not verified"
      });
    }

    if (existingUserByEmail) {
      myAuth.hooks.onUserLogin(event, {
        email: existingUserByEmail.email,
        id: existingUserByEmail.id
      });
    }

    const userId = generateId(15);

    const createdUser = await myAuth.userTable.insertUser({
      externalId: userId,
      username: githubUser.login,
      email,
      avatar: githubUser.avatar_url,
      // TRUE as we verified it with primaryEmail const
      emailVerified: true
    });

    await myAuth.oauthAccountTable.insertOauthAccount({
      providerID: "github",
      providerUserID: githubUser.id,
      userId: createdUser.id
    });

    await myAuth.hooks.onUserCreation(event, createdUser);
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
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
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

import { type LinkedInTokens, OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "linkedin_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
      message: "Missing Data"
    });
  }

  try {
    const tokens: LinkedInTokens =
      await myAuth.linkedin.validateAuthorizationCode(code);

    const linkedinUserResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      }
    );

    const linkedinUser: LinkedInResponse = await linkedinUserResponse.json();

    if (!linkedinUser.email_verified) {
      throw createError({
        status: 400,
        message: "discord user not verified"
      });
    }

    const existingUserByProvider =
      await myAuth.oauthAccountTable.getByProviderData({
        providerID: "linkedin",
        providerUserID: linkedinUser.sub
      });

    const existingUserByEmail = await myAuth.userTable.getUserByEmail(
      linkedinUser.email
    );

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

    const existingUser = existingUserByProvider ?? existingUserByEmail;
    if (existingUser) {
      myAuth.hooks.onUserLogin(event, {
        // FIXME THIS COULD CAUSE BUGS
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        email: existingUser.email,
        id: existingUser.id
      });
    }

    const userId = generateId(15);

    const createdUser = await myAuth.userTable.insertUser({
      externalId: userId,
      username: linkedinUser.name,
      email: linkedinUser.email,
      emailVerified: linkedinUser.email_verified,
      avatar: linkedinUser.picture
    });

    await myAuth.oauthAccountTable.insertOauthAccount({
      providerID: "linkedin",
      providerUserID: linkedinUser.sub,
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

interface LinkedInResponse {
  sub: string;
  email_verified: boolean;
  name: string;
  locale: {
    country: string;
    language: string;
  };
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

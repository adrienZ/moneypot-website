import type { User } from "~/server/database/schema/types";
import { generateEmailVerificationCode } from "./helpers/verificationCode";
import { LoginThrottlingService } from "./services/loginThrottlingService";
import { AssetsService } from "~/server/services/AssetsService";
import { UserService } from "~/server/services/UserService";

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0];

interface IUserData {
  id: number;
  email: string;
  username?: string | null;
}

export class AuthHooks {
  async onUserLogin(event: H3Event, userData: IUserData) {
    LoginThrottlingService.getInstance().onValidate(userData.email);

    const ua = getRequestHeader(event, "User-Agent");
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? null;

    const session = await lucia.createSession(String(userData.id), {
      // varchar(500)
      userAgent: ua?.substring(0, 500) ?? null,
      ip
    });
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
    getRequestHeader(event, "User-Agent");
    return sendRedirect(event, "/");
  }

  async onUserCreation(event: H3Event, userData: User) {
    if (!userData.avatar.includes("https://www.gravatar.com/avatar")) {
      const avatarCdnUrl = await AssetsService.uploadFileFromUrl(
        userData.avatar
      );
      await UserService.updateUserAvatar(userData.externalId, avatarCdnUrl);
    }

    await myAuth.emailService.welcomeEmail({
      targetEmail: userData.email,
      username: userData.username ?? undefined
    });

    await this.onUserLogin(event, userData);

    const code = await generateEmailVerificationCode(
      String(userData.id),
      userData.email
    );
    const pageUrl = `${process.env.BASE_URL}/auth/code-verification`;

    myAuth.emailService.sendEmailVerification({
      targetEmail: userData.email,
      code,
      pageUrl
    });
  }
}

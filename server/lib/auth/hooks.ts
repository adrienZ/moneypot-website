import { generateEmailVerificationCode } from "./helpers/verificationCode";
import { LoginThrottlingService } from "./services/loginThrottlingService";

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

  async onUserCreation(event: H3Event, userData: IUserData) {
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

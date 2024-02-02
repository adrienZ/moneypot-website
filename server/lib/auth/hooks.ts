import { generateEmailVerificationCode } from "./helpers/verificationCode";
import { LoginThrottlingService } from "./services/loginThrottlingService";

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0];

interface IUserData {
  id: number;
  email: string;
}

export class AuthHooks {
  async onUserLogin(event: H3Event, userData: IUserData) {
    LoginThrottlingService.getInstance().onValidate(userData.email);
    const session = await lucia.createSession(String(userData.id), {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
    return sendRedirect(event, "/");
  }

  async onUserCreation(event: H3Event, userData: IUserData) {
    myAuth.emailService.welcomeEmail({ targetEmail: userData.email });

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

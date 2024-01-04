import { generateEmailVerificationCode } from "./helpers/verificationCode"

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0]

interface IUserData {
  id: number
  email: string
}

export async function onUserCreation(event: H3Event, userData: IUserData) {
  const emailService = useEmailService(event);
  emailService.welcomeEmail({ targetEmail: userData.email });
  await onUserLogin(event, userData);
  const code = await generateEmailVerificationCode(event, userData.id, userData.email);
  emailService.sendEmailVerification({
    targetEmail: userData.email,
    code
  })
}

export async function onUserLogin(event: H3Event, userData: IUserData) {
  const lucia = useLuciaAuth(event);
  const session = await lucia.createSession(String(userData.id), {});
  appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  return sendRedirect(event, "/");
}
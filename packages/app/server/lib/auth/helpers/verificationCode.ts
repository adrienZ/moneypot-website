import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/random";

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0];

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await myAuth.emailVerificationCodeTable.deleteEmailVerficationCode(userId);
  const code = generateRandomString(8, alphabet("0-9"));
  // You can also use alphanumeric codes.
  // const code = generateRandomString(6, alphabet("0-9", "A-Z"));

  await myAuth.emailVerificationCodeTable.insertEmailVerficationCode({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(5, "m")) // 5 minutes
  });

  return code;
}

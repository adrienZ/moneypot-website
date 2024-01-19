import { Auth } from "../lib/auth";
import { emailVerificationCode, oauthAccount, user } from "../database/schema";

export const myAuth = new Auth({
  db,
  userTable: user,
  oauthAccountTable: oauthAccount,
  emailVerificationCodeTable: emailVerificationCode
});

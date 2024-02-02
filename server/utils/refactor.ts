import { Auth } from "../lib/auth";
import {
  emailVerificationCode,
  oauthAccount,
  user,
  emailAudience
} from "../database/schema";

export const myAuth = new Auth({
  db,
  userTable: user,
  oauthAccountTable: oauthAccount,
  emailVerificationCodeTable: emailVerificationCode,
  emailAudienceTable: emailAudience
});

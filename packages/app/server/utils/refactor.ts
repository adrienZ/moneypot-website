import { Auth } from "../lib/auth";
import { oauthAccount, user } from "@moneypot/auth/schema"

export const myAuth = new Auth({
  db,
  userTable: user,
  oauthAccountTable: oauthAccount
});
import {
  user,
  oauthAccount,
  emailVerificationCode,
  emailAudience
} from "../../database/schema";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { GitHub, Discord } from "arctic";
import { AuthHooks } from "./hooks";

import { UserTable } from "./tables/user.table";
import { OauthAccountTable } from "./tables/oauthAccount.table";
import { EmailVerificationCodeTable } from "./tables/emailVerification.table";
import { EmailService } from "~/server/lib/auth/emailService";
import { EmailAudienceTable } from "./tables/emailAudience.table";

type DbType = BetterSQLite3Database | LibSQLDatabase;
type UserTableType = typeof user;
type OauthAccountTableType = typeof oauthAccount;
type EmailVerificationCodeTableType = typeof emailVerificationCode;
type EmailAudienceTableType = typeof emailAudience;

interface IConstructorParams {
  db: DbType;
  userTable: UserTableType;
  oauthAccountTable: OauthAccountTableType;
  emailVerificationCodeTable: EmailVerificationCodeTableType;
  emailAudienceTable: EmailAudienceTableType;
}

export class Auth {
  db: DbType;

  github: GitHub;
  discord: Discord;

  hooks: AuthHooks;

  userTable: UserTable;
  oauthAccountTable: OauthAccountTable;
  emailVerificationCodeTable: EmailVerificationCodeTable;
  emailAudienceTable: EmailAudienceTable;

  emailService: EmailService;

  constructor({ db, userTable }: IConstructorParams) {
    this.db = db;

    this.github = new GitHub(
      process.env.GITHUB_CLIENT_ID as string,
      process.env.GITHUB_CLIENT_SECRET as string,
      {}
    );

    this.discord = new Discord(
      process.env.DISCORD_APPLICATION_ID as string,
      process.env.DISCORD_PUBLIC_KEY as string,
      process.env.BASE_URL + "/api/login/discord/callback"
    );

    this.hooks = new AuthHooks();
    this.emailService = new EmailService();

    this.userTable = new UserTable(db, userTable);
    this.oauthAccountTable = new OauthAccountTable(db, oauthAccount);
    this.emailVerificationCodeTable = new EmailVerificationCodeTable(
      db,
      emailVerificationCode
    );
    this.emailAudienceTable = new EmailAudienceTable(db, emailAudience);
  }

  // async OauthLinking() {

  // }
}

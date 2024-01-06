import { user, oauthAccount } from "@moneypot/auth/schema";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { GitHub, Discord } from "arctic";
import { AuthHooks } from "./hooks";

import { UserTable } from "./tables/user.table";
import { OauthAccountTable } from "./tables/oauthAccountTable";

const isDev = process.env.NODE_ENV === "development";

type DbType = BetterSQLite3Database | LibSQLDatabase
type UserTableType = typeof user
type OauthAccountTableType = typeof oauthAccount


interface IConstructorParams {
  db: DbType
  userTable: UserTableType
  oauthAccountTable: OauthAccountTableType
}

export class Auth {

  db: DbType

  github: GitHub
  discord: Discord

  hooks: AuthHooks

  userTable: UserTable

  oauthAccountTable: OauthAccountTable

  constructor({ db, userTable }: IConstructorParams) {
    this.db = db

    this.github = new GitHub(process.env.GITHUB_CLIENT_ID as string, process.env.GITHUB_CLIENT_SECRET as string, {});

    this.discord = new Discord(
      process.env.DISCORD_APPLICATION_ID as string,
      process.env.DISCORD_PUBLIC_KEY as string,
      // TODO: implement base url
      isDev ? "http://localhost:3000/api/login/discord/callback" : "https://moneypot-website.onrender.com/api/login/discord/callback");

    this.hooks = new AuthHooks()

    this.userTable = new UserTable(db, userTable)
    this.oauthAccountTable = new OauthAccountTable(db, oauthAccount)
  }
}


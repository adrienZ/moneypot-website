import { Discord } from "arctic";

export const discord = new Discord(
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_PUBLIC_KEY,
  "http://localhost:3000/api/login/discord/callback");
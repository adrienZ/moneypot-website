import { Discord } from "arctic";
const isDev = process.env.NODE_ENV === "development";

export const discord = new Discord(
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_PUBLIC_KEY,
  isDev ? "http://localhost:3000/api/login/discord/callback" : "https://moneypot-website.onrender.com/api/login/discord/callback");
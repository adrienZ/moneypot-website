import { GitHub } from "arctic";

const config = useRuntimeConfig();
export const github = new GitHub(config.githubClientId, config.githubClientSecret, {});
// TODO: move to lib/
import { GitHub } from "arctic";

// TODO: use process.env
const config = useRuntimeConfig();
export const github = new GitHub(config.githubClientId, config.githubClientSecret, {});
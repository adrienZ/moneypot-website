import { downloadDbs } from "geolite2-redist";

export default defineNitroPlugin(async () => {
  await downloadDbs();
});

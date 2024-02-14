import { downloadDbs } from "geolite2-redist";

export default defineNitroPlugin(async () => {
  if (import.meta.dev) {
    await downloadDbs();
  }
});

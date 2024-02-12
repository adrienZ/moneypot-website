import { IpLocation } from "../lib/IpLocation";

export default defineNitroPlugin(async () => {
  await IpLocation.loadDbs();
});

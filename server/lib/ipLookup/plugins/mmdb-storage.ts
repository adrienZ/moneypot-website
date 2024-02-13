import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import fsDriver from "unstorage/drivers/fs";
import { prefixStorage } from "unstorage";
import { GeoIpDbName, downloadDbs } from "geolite2-redist";
import consola from "consola";

//  setup
const NAMESPACE = "mmdb";
const storagePath = resolve(
  fileURLToPath(dirname(import.meta.url)),
  `.${NAMESPACE}`
);
const dbFilename = `${GeoIpDbName.City}.mmdb`;

export default defineNitroPlugin(async () => {
  const storage = useStorage();

  // create folder to store db
  const driver = fsDriver({
    base: storagePath
  });
  storage.mount(NAMESPACE, driver);
  const mmdbStorage = prefixStorage(storage, NAMESPACE);

  // download geolite2 db
  const options = {
    dbList: [GeoIpDbName.City],
    path: storagePath
  };

  try {
    await downloadDbs(options);
    const createdFiles = fs.readdirSync(options.path);
    consola.success(createdFiles, options.path);
  } catch (e) {
    consola.error(e);
  }

  // set meta to request file fom filesystem later
  await mmdbStorage.setMeta(dbFilename, {
    path: resolve(storagePath, dbFilename)
  });
});

export function getMmdbPath(dbName: GeoIpDbName) {
  const mmdbStorage = prefixStorage(useStorage(), NAMESPACE);
  return mmdbStorage.getMeta(`${dbName}.mmdb`);
}

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "../utils/lucia";

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: __dirname + "/migrations"
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();

import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const client = createClient({
	url: "libsql://moneypot-website-adrienz.turso.io",
	authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEyLTI4VDAyOjA0OjAwLjE5MDgxNTMwNFoiLCJpZCI6IjkyZDAxYzQ5LWE1MjMtMTFlZS1iMWVkLTVlODdjMGQ1OTFkMCJ9.qG30_hunWI7uLhhsGQTkAtxvUpe2Yh0EOmNBzYrVupEVDx9b16JRgXv1EzvziOd6y8uF0_7_B-dbDPtAR_MHBQ"
});

export const db = drizzle(client);

async function main() {
  try {
    console.log(__dirname);
    
    await migrate(db, {
      migrationsFolder: __dirname + "/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();
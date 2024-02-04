CREATE TABLE IF NOT EXISTS "moneypot_website_moneypot" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moneypot_website_moneypot" ADD CONSTRAINT "moneypot_website_moneypot_category_id_moneypot_website_moneypot_category_external_id_fk" FOREIGN KEY ("category_id") REFERENCES "moneypot_website_moneypot_category"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

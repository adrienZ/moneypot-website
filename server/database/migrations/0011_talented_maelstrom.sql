ALTER TABLE "moneypot_website_moneypot" ADD COLUMN "creator_id" varchar(10) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moneypot_website_moneypot" ADD CONSTRAINT "moneypot_website_moneypot_creator_id_auth_layer_user_external_id_fk" FOREIGN KEY ("creator_id") REFERENCES "auth_layer_user"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

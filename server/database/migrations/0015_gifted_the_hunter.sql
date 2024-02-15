ALTER TABLE "moneypot_website_moneypot" ADD COLUMN "currency" varchar(3) DEFAULT 'EUR' NOT NULL;--> statement-breakpoint
ALTER TABLE "moneypot_website_moneypot" ADD COLUMN "target_amount" integer;
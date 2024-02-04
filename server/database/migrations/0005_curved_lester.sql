CREATE TABLE IF NOT EXISTS "moneypot_website_moneypot_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(10) NOT NULL,
	"value" varchar(100),
	"image" varchar(255),
	CONSTRAINT "moneypot_website_moneypot_category_external_id_unique" UNIQUE("external_id")
);

CREATE TABLE IF NOT EXISTS "payment_layer_payment_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"provider_id" varchar(25) NOT NULL,
	"provider_user_id" varchar(20) NOT NULL,
	"user_id" varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_layer_physical_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"city" varchar(200) NOT NULL,
	"zip_code" varchar(20) NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"country" varchar(90) NOT NULL,
	"street_line_one" varchar(100) NOT NULL,
	"street_line_two" varchar(100),
	"user_id" varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_layer_user_legal_informations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"birth_date" date,
	"phone_number" varchar(50),
	"user_id" varchar(15) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_layer_payment_account" ADD CONSTRAINT "payment_layer_payment_account_user_id_auth_layer_user_external_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_layer_user"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_layer_physical_address" ADD CONSTRAINT "payment_layer_physical_address_user_id_auth_layer_user_external_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_layer_user"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_layer_user_legal_informations" ADD CONSTRAINT "payment_layer_user_legal_informations_user_id_auth_layer_user_external_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_layer_user"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

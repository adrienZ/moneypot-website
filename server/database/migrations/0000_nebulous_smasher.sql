CREATE TABLE IF NOT EXISTS "auth_layer_email_audience" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"provider_contact_id" text NOT NULL,
	"date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_layer_email_verification_code" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "auth_layer_email_verification_code_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_layer_oauth_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_layer_password_reset_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_layer_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" text NOT NULL,
	"username" text,
	"password" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"email" text NOT NULL,
	"avatar" varchar(512) DEFAULT 'https://www.gravatar.com/avatar',
	CONSTRAINT "auth_layer_user_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "auth_layer_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_layer_user_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_layer_oauth_account" ADD CONSTRAINT "auth_layer_oauth_account_user_id_auth_layer_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_layer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_layer_password_reset_token" ADD CONSTRAINT "auth_layer_password_reset_token_user_id_auth_layer_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_layer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_layer_user_session" ADD CONSTRAINT "auth_layer_user_session_user_id_auth_layer_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_layer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

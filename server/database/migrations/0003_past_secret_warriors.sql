ALTER TABLE "auth_layer_user_session" RENAME COLUMN "os" TO "user_agent";--> statement-breakpoint
ALTER TABLE "auth_layer_user_session" ALTER COLUMN "user_agent" SET DATA TYPE varchar(500);
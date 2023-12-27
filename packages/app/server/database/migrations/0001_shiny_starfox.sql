DROP TABLE `auth_layer_email_verification_token`;--> statement-breakpoint
DROP TABLE `auth_layer_password_reset_token`;--> statement-breakpoint
DROP TABLE `auth_layer_user_key`;--> statement-breakpoint
ALTER TABLE auth_layer_user ADD `github_id` integer;--> statement-breakpoint
ALTER TABLE auth_layer_user ADD `password` text;--> statement-breakpoint
ALTER TABLE auth_layer_user_session ADD `expires_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_layer_user_session` DROP COLUMN `active_expires`;--> statement-breakpoint
ALTER TABLE `auth_layer_user_session` DROP COLUMN `idle_expires`;
CREATE TABLE `auth_layer_email_verification_code` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_layer_oauth_account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_layer_user`(`external_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_layer_password_reset_token` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_layer_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_layer_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text NOT NULL,
	`username` text,
	`password` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_layer_user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_layer_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_layer_email_verification_code_user_id_unique` ON `auth_layer_email_verification_code` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_layer_user_external_id_unique` ON `auth_layer_user` (`external_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_layer_user_email_unique` ON `auth_layer_user` (`email`);
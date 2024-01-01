CREATE TABLE `auth_layer_oauth_account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_layer_user`(`external_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_layer_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text NOT NULL,
	`username` text,
	`password` text,
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
CREATE UNIQUE INDEX `auth_layer_user_external_id_unique` ON `auth_layer_user` (`external_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_layer_user_email_unique` ON `auth_layer_user` (`email`);
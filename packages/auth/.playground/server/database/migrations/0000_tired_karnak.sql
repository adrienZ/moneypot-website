CREATE TABLE `auth_layer_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`github_id` integer,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `auth_layer_user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_layer_user`(`id`) ON UPDATE no action ON DELETE no action
);

ALTER TABLE user ADD `email` text DEFAULT 'test@test.com' NOT NULL;--> statement-breakpoint
ALTER TABLE user ADD `email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
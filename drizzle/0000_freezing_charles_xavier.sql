CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`favourites` text DEFAULT '[]' NOT NULL,
	`preferences` text DEFAULT '{"orders":true,"bookings":true,"offers":false}' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	`street` text NOT NULL,
	`landmark` text DEFAULT '' NOT NULL,
	`is_primary` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`date` text NOT NULL,
	`guests` integer NOT NULL,
	`slot` text NOT NULL,
	`seating` text NOT NULL,
	`occasion` text DEFAULT 'Just dinner' NOT NULL,
	`status` text DEFAULT 'Requested' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_idempotency` ON `bookings` (`user_id`,`idempotency_key`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`fulfil` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`payment` text NOT NULL,
	`items` text NOT NULL,
	`subtotal` integer NOT NULL,
	`delivery` integer NOT NULL,
	`total` integer NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotency` ON `orders` (`user_id`,`idempotency_key`);
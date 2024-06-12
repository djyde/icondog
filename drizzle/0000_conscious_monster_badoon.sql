CREATE TABLE `icon-sets` (
	`prefix` text PRIMARY KEY NOT NULL,
	`title` text,
	`license` text,
	`license_url` text,
	`samples` blob DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `icons` (
	`id` text PRIMARY KEY NOT NULL,
	`icon_set_prefix` text,
	`name` text,
	`icon_set` text NOT NULL,
	`svg` text,
	FOREIGN KEY (`icon_set`) REFERENCES `icon-sets`(`prefix`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `icon-sets_title_unique` ON `icon-sets` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `icons_icon_set_prefix_name_unique` ON `icons` (`icon_set_prefix`,`name`);
CREATE TABLE `client_agency_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`positioning` text,
	`voice` varchar(240),
	`audience` text,
	`offers` text,
	`proofPolicy` text,
	`visualSystem` text,
	`departmentContextJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_agency_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_agency_profiles_client_unique` UNIQUE(`clientId`)
);
--> statement-breakpoint
CREATE TABLE `content_briefs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`ownerUserId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`sourceType` enum('briefing','idea','trend','reference','decision') NOT NULL DEFAULT 'briefing',
	`objective` varchar(240),
	`content` text NOT NULL,
	`status` enum('draft','review','approved','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_briefs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategy_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`ownerUserId` int NOT NULL,
	`question` text NOT NULL,
	`lensOutputJson` text NOT NULL,
	`recommendation` text NOT NULL,
	`primaryRisk` text,
	`status` enum('draft','review','accepted','rejected') NOT NULL DEFAULT 'review',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strategy_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trend_signals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`ownerUserId` int NOT NULL,
	`platform` enum('instagram','youtube','x','tiktok','other') NOT NULL DEFAULT 'other',
	`sourceUrl` varchar(1200),
	`title` varchar(260) NOT NULL,
	`observedAt` timestamp,
	`reactionNotes` text,
	`metricsJson` text,
	`score` int,
	`status` enum('captured','shortlisted','approved','discarded') NOT NULL DEFAULT 'captured',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trend_signals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `video_scripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`contentBriefId` int,
	`ownerUserId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`scriptJson` text NOT NULL,
	`editPlan` text,
	`status` enum('draft','review','approved','produced') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `video_scripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `client_agency_profiles` ADD CONSTRAINT `client_agency_profiles_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_agency_profiles` ADD CONSTRAINT `client_agency_profiles_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_briefs` ADD CONSTRAINT `content_briefs_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_briefs` ADD CONSTRAINT `content_briefs_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_briefs` ADD CONSTRAINT `content_briefs_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `strategy_decisions` ADD CONSTRAINT `strategy_decisions_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `strategy_decisions` ADD CONSTRAINT `strategy_decisions_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `strategy_decisions` ADD CONSTRAINT `strategy_decisions_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trend_signals` ADD CONSTRAINT `trend_signals_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trend_signals` ADD CONSTRAINT `trend_signals_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trend_signals` ADD CONSTRAINT `trend_signals_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `video_scripts` ADD CONSTRAINT `video_scripts_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `video_scripts` ADD CONSTRAINT `video_scripts_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `video_scripts` ADD CONSTRAINT `video_scripts_contentBriefId_content_briefs_id_fk` FOREIGN KEY (`contentBriefId`) REFERENCES `content_briefs`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `video_scripts` ADD CONSTRAINT `video_scripts_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `client_agency_profiles_owner_idx` ON `client_agency_profiles` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `content_briefs_client_idx` ON `content_briefs` (`clientId`);--> statement-breakpoint
CREATE INDEX `content_briefs_campaign_idx` ON `content_briefs` (`campaignId`);--> statement-breakpoint
CREATE INDEX `content_briefs_owner_idx` ON `content_briefs` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `strategy_decisions_client_idx` ON `strategy_decisions` (`clientId`);--> statement-breakpoint
CREATE INDEX `strategy_decisions_campaign_idx` ON `strategy_decisions` (`campaignId`);--> statement-breakpoint
CREATE INDEX `strategy_decisions_owner_idx` ON `strategy_decisions` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `strategy_decisions_status_idx` ON `strategy_decisions` (`status`);--> statement-breakpoint
CREATE INDEX `trend_signals_client_idx` ON `trend_signals` (`clientId`);--> statement-breakpoint
CREATE INDEX `trend_signals_campaign_idx` ON `trend_signals` (`campaignId`);--> statement-breakpoint
CREATE INDEX `trend_signals_owner_idx` ON `trend_signals` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `trend_signals_status_idx` ON `trend_signals` (`status`);--> statement-breakpoint
CREATE INDEX `video_scripts_client_idx` ON `video_scripts` (`clientId`);--> statement-breakpoint
CREATE INDEX `video_scripts_campaign_idx` ON `video_scripts` (`campaignId`);--> statement-breakpoint
CREATE INDEX `video_scripts_owner_idx` ON `video_scripts` (`ownerUserId`);
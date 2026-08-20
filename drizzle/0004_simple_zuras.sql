CREATE TABLE `creative_approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creativeVersionId` int NOT NULL,
	`campaignId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`reviewerUserId` int NOT NULL,
	`decision` enum('approved','changes_requested','rejected') NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creative_approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creative_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`generationId` int,
	`ownerUserId` int NOT NULL,
	`kind` enum('ads','carousel','strategy','video','bundle') NOT NULL,
	`versionNumber` int NOT NULL,
	`summary` varchar(300),
	`payloadJson` text NOT NULL,
	`status` enum('draft','review','approved','rejected') NOT NULL DEFAULT 'review',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creative_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `creative_versions_campaign_kind_number_unique` UNIQUE(`campaignId`,`kind`,`versionNumber`)
);
--> statement-breakpoint
ALTER TABLE `creative_approvals` ADD CONSTRAINT `creative_approvals_creativeVersionId_creative_versions_id_fk` FOREIGN KEY (`creativeVersionId`) REFERENCES `creative_versions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creative_approvals` ADD CONSTRAINT `creative_approvals_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creative_approvals` ADD CONSTRAINT `creative_approvals_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creative_approvals` ADD CONSTRAINT `creative_approvals_reviewerUserId_users_id_fk` FOREIGN KEY (`reviewerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creative_versions` ADD CONSTRAINT `creative_versions_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creative_versions` ADD CONSTRAINT `creative_versions_generationId_ai_generations_id_fk` FOREIGN KEY (`generationId`) REFERENCES `ai_generations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creative_versions` ADD CONSTRAINT `creative_versions_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `creative_approvals_version_idx` ON `creative_approvals` (`creativeVersionId`);--> statement-breakpoint
CREATE INDEX `creative_approvals_campaign_idx` ON `creative_approvals` (`campaignId`);--> statement-breakpoint
CREATE INDEX `creative_approvals_owner_idx` ON `creative_approvals` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `creative_versions_campaign_idx` ON `creative_versions` (`campaignId`);--> statement-breakpoint
CREATE INDEX `creative_versions_generation_idx` ON `creative_versions` (`generationId`);--> statement-breakpoint
CREATE INDEX `creative_versions_owner_status_idx` ON `creative_versions` (`ownerUserId`,`status`);
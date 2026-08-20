CREATE TABLE `ad_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`providerConnectionId` int,
	`name` varchar(200) NOT NULL,
	`mode` enum('ads','carousel','bundle') NOT NULL,
	`status` enum('draft','generating','ready','review','approved','failed') NOT NULL DEFAULT 'draft',
	`objective` varchar(180) NOT NULL,
	`briefingJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ad_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_generations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`kind` enum('strategy','ads','carousel','bundle','image') NOT NULL,
	`provider` varchar(64) NOT NULL,
	`model` varchar(180) NOT NULL,
	`status` enum('queued','running','succeeded','failed') NOT NULL DEFAULT 'queued',
	`promptSnapshot` text NOT NULL,
	`outputJson` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `ai_generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carousel_slides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`generationId` int,
	`slideNumber` int NOT NULL,
	`role` enum('cover','context','insight','proof','solution','cta') NOT NULL,
	`headline` varchar(240) NOT NULL,
	`body` text,
	`visualDirection` text,
	`imagePrompt` text,
	`assetUrl` varchar(1000),
	`approvalStatus` enum('draft','review','approved') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carousel_slides_id` PRIMARY KEY(`id`),
	CONSTRAINT `carousel_slides_campaign_number_unique` UNIQUE(`campaignId`,`slideNumber`)
);
--> statement-breakpoint
CREATE TABLE `client_ai_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`label` varchar(120) NOT NULL,
	`provider` enum('manus','openai','openai_compatible','gemini','anthropic') NOT NULL,
	`apiBaseUrl` varchar(500),
	`defaultModel` varchar(180) NOT NULL,
	`defaultImageModel` varchar(180),
	`encryptedApiKey` text,
	`keyHint` varchar(16),
	`status` enum('active','disabled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_ai_connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_ai_connections_owner_client_label_unique` UNIQUE(`ownerUserId`,`clientId`,`label`)
);
--> statement-breakpoint
ALTER TABLE `ad_campaigns` ADD CONSTRAINT `ad_campaigns_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ad_campaigns` ADD CONSTRAINT `ad_campaigns_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ad_campaigns` ADD CONSTRAINT `ad_campaigns_providerConnectionId_client_ai_connections_id_fk` FOREIGN KEY (`providerConnectionId`) REFERENCES `client_ai_connections`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_generations` ADD CONSTRAINT `ai_generations_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_generations` ADD CONSTRAINT `ai_generations_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carousel_slides` ADD CONSTRAINT `carousel_slides_campaignId_ad_campaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `ad_campaigns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carousel_slides` ADD CONSTRAINT `carousel_slides_generationId_ai_generations_id_fk` FOREIGN KEY (`generationId`) REFERENCES `ai_generations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_ai_connections` ADD CONSTRAINT `client_ai_connections_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_ai_connections` ADD CONSTRAINT `client_ai_connections_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `ad_campaigns_owner_idx` ON `ad_campaigns` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `ad_campaigns_client_idx` ON `ad_campaigns` (`clientId`);--> statement-breakpoint
CREATE INDEX `ad_campaigns_status_idx` ON `ad_campaigns` (`status`);--> statement-breakpoint
CREATE INDEX `ai_generations_campaign_idx` ON `ai_generations` (`campaignId`);--> statement-breakpoint
CREATE INDEX `ai_generations_owner_idx` ON `ai_generations` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `ai_generations_status_idx` ON `ai_generations` (`status`);--> statement-breakpoint
CREATE INDEX `carousel_slides_generation_idx` ON `carousel_slides` (`generationId`);--> statement-breakpoint
CREATE INDEX `client_ai_connections_client_idx` ON `client_ai_connections` (`clientId`);--> statement-breakpoint
CREATE INDEX `client_ai_connections_owner_idx` ON `client_ai_connections` (`ownerUserId`);
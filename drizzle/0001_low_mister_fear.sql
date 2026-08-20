CREATE TABLE `operators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`email` varchar(320),
	`role` varchar(120),
	`teamId` int,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `calendar_events` ADD `responsibleOperatorId` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `responsibleOperatorId` int;--> statement-breakpoint
ALTER TABLE `tasks` ADD `responsibleOperatorId` int;--> statement-breakpoint
ALTER TABLE `operators` ADD CONSTRAINT `operators_teamId_teams_id_fk` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `operators` ADD CONSTRAINT `operators_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `operators_owner_idx` ON `operators` (`createdByUserId`);--> statement-breakpoint
CREATE INDEX `operators_team_idx` ON `operators` (`teamId`);--> statement-breakpoint
ALTER TABLE `calendar_events` ADD CONSTRAINT `calendar_events_responsibleOperatorId_operators_id_fk` FOREIGN KEY (`responsibleOperatorId`) REFERENCES `operators`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_responsibleOperatorId_operators_id_fk` FOREIGN KEY (`responsibleOperatorId`) REFERENCES `operators`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_responsibleOperatorId_operators_id_fk` FOREIGN KEY (`responsibleOperatorId`) REFERENCES `operators`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `calendar_events_responsible_operator_idx` ON `calendar_events` (`responsibleOperatorId`);--> statement-breakpoint
CREATE INDEX `projects_responsible_operator_idx` ON `projects` (`responsibleOperatorId`);--> statement-breakpoint
CREATE INDEX `tasks_responsible_operator_idx` ON `tasks` (`responsibleOperatorId`);
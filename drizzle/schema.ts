import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const clients = mysqlTable(
  "clients",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 180 }).notNull(),
    contactName: varchar("contactName", { length: 180 }),
    contactEmail: varchar("contactEmail", { length: 320 }),
    segment: varchar("segment", { length: 120 }),
    status: mysqlEnum("status", ["active", "paused", "archived"]).default("active").notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("clients_owner_idx").on(table.createdByUserId), index("clients_status_idx").on(table.status)],
);

export const teams = mysqlTable(
  "teams",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 140 }).notNull(),
    color: varchar("color", { length: 16 }).default("#E85D3F").notNull(),
    leadUserId: int("leadUserId").references(() => users.id, { onDelete: "set null" }),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("teams_owner_idx").on(table.createdByUserId)],
);

export const teamMembers = mysqlTable(
  "team_members",
  {
    id: int("id").autoincrement().primaryKey(),
    teamId: int("teamId").notNull().references(() => teams.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("team_members_team_user_unique").on(table.teamId, table.userId),
    index("team_members_user_idx").on(table.userId),
  ],
);

export const operators = mysqlTable(
  "operators",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 180 }).notNull(),
    email: varchar("email", { length: 320 }),
    role: varchar("role", { length: 120 }),
    teamId: int("teamId").references(() => teams.id, { onDelete: "set null" }),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("operators_owner_idx").on(table.createdByUserId), index("operators_team_idx").on(table.teamId)],
);

export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "restrict" }),
    teamId: int("teamId").references(() => teams.id, { onDelete: "set null" }),
    responsibleOperatorId: int("responsibleOperatorId").references(() => operators.id, { onDelete: "set null" }),
    ownerUserId: int("ownerUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    status: mysqlEnum("status", ["briefing", "in_progress", "review", "approved", "on_hold", "completed"]).default("briefing").notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
    progress: int("progress").default(0).notNull(),
    sourceSkill: mysqlEnum("sourceSkill", ["agencia", "carrosseis", "manual"]).default("manual").notNull(),
    startsAt: timestamp("startsAt"),
    dueAt: timestamp("dueAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("projects_client_idx").on(table.clientId),
    index("projects_team_idx").on(table.teamId),
    index("projects_responsible_operator_idx").on(table.responsibleOperatorId),
    index("projects_owner_idx").on(table.ownerUserId),
    index("projects_status_idx").on(table.status),
    index("projects_due_idx").on(table.dueAt),
  ],
);

export const projectArtifacts = mysqlTable(
  "project_artifacts",
  {
    id: int("id").autoincrement().primaryKey(),
    projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileSize: int("fileSize"),
    sourcePath: varchar("sourcePath", { length: 500 }),
    syncedAt: timestamp("syncedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("project_artifacts_project_idx").on(table.projectId)],
);

export const tasks = mysqlTable(
  "tasks",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description"),
    projectId: int("projectId").references(() => projects.id, { onDelete: "cascade" }),
    teamId: int("teamId").references(() => teams.id, { onDelete: "set null" }),
    responsibleOperatorId: int("responsibleOperatorId").references(() => operators.id, { onDelete: "set null" }),
    assignedUserId: int("assignedUserId").references(() => users.id, { onDelete: "set null" }),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    status: mysqlEnum("status", ["backlog", "ready", "in_progress", "review", "done", "blocked"]).default("backlog").notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
    dueAt: timestamp("dueAt"),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    estimateMinutes: int("estimateMinutes"),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("tasks_project_idx").on(table.projectId),
    index("tasks_team_idx").on(table.teamId),
    index("tasks_responsible_operator_idx").on(table.responsibleOperatorId),
    index("tasks_assigned_idx").on(table.assignedUserId),
    index("tasks_status_idx").on(table.status),
    index("tasks_due_idx").on(table.dueAt),
  ],
);

export const calendarEvents = mysqlTable(
  "calendar_events",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description"),
    projectId: int("projectId").references(() => projects.id, { onDelete: "set null" }),
    clientId: int("clientId").references(() => clients.id, { onDelete: "set null" }),
    teamId: int("teamId").references(() => teams.id, { onDelete: "set null" }),
    responsibleOperatorId: int("responsibleOperatorId").references(() => operators.id, { onDelete: "set null" }),
    ownerUserId: int("ownerUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    eventType: mysqlEnum("eventType", ["meeting", "review", "delivery", "focus", "deadline"]).default("meeting").notNull(),
    startsAt: timestamp("startsAt").notNull(),
    endsAt: timestamp("endsAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("calendar_events_owner_idx").on(table.ownerUserId),
    index("calendar_events_start_idx").on(table.startsAt),
    index("calendar_events_project_idx").on(table.projectId),
    index("calendar_events_responsible_operator_idx").on(table.responsibleOperatorId),
  ],
);

export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", ["approval", "deadline", "comment", "delivery", "system"]).default("system").notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    body: text("body"),
    entityType: varchar("entityType", { length: 64 }),
    entityId: int("entityId"),
    actionPath: varchar("actionPath", { length: 300 }),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("notifications_user_read_idx").on(table.userId, table.readAt)],
);

export const userDashboardPreferences = mysqlTable(
  "user_dashboard_preferences",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    activeClientId: int("activeClientId").references(() => clients.id, { onDelete: "set null" }),
    activeTeamId: int("activeTeamId").references(() => teams.id, { onDelete: "set null" }),
    preferredRange: mysqlEnum("preferredRange", ["week", "month"]).default("week").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("dashboard_preferences_user_unique").on(table.userId)],
);

export const originalAppConnections = mysqlTable(
  "original_app_connections",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    baseUrl: varchar("baseUrl", { length: 500 }).notNull(),
    connectionStatus: mysqlEnum("connectionStatus", ["pending", "connected", "error"]).default("pending").notNull(),
    lastCheckedAt: timestamp("lastCheckedAt"),
    lastError: text("lastError"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("original_app_connections_user_unique").on(table.userId)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

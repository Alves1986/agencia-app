import { and, asc, desc, eq, gte, like, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  calendarEvents,
  clients,
  InsertUser,
  notifications,
  operators,
  originalAppConnections,
  projectArtifacts,
  projects,
  tasks,
  teams,
  userDashboardPreferences,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listClients(userId: number) {
  const db = await requireDb();
  return db.select().from(clients).where(eq(clients.createdByUserId, userId)).orderBy(asc(clients.name));
}

export async function createClient(userId: number, input: {
  name: string;
  contactName?: string | null;
  contactEmail?: string | null;
  segment?: string | null;
}) {
  const db = await requireDb();
  await db.insert(clients).values({ ...input, createdByUserId: userId });
}

export async function listTeams(userId: number) {
  const db = await requireDb();
  return db.select().from(teams).where(eq(teams.createdByUserId, userId)).orderBy(asc(teams.name));
}

export async function createTeam(userId: number, input: { name: string; color?: string }) {
  const db = await requireDb();
  await db.insert(teams).values({
    name: input.name,
    color: input.color ?? "#E85D3F",
    leadUserId: userId,
    createdByUserId: userId,
  });
}

export async function listOperators(userId: number) {
  const db = await requireDb();
  return db
    .select({ operator: operators, team: teams })
    .from(operators)
    .leftJoin(teams, eq(operators.teamId, teams.id))
    .where(eq(operators.createdByUserId, userId))
    .orderBy(asc(operators.name));
}

export async function createOperator(userId: number, input: { name: string; email?: string | null; role?: string | null; teamId?: number | null }) {
  const db = await requireDb();
  if (input.teamId) {
    const ownedTeam = await db.select({ id: teams.id }).from(teams).where(and(eq(teams.id, input.teamId), eq(teams.createdByUserId, userId))).limit(1);
    if (!ownedTeam[0]) throw new Error("Equipe inválida para este espaço de trabalho");
  }
  await db.insert(operators).values({ ...input, createdByUserId: userId });
}

type ProjectFilters = {
  clientId?: number;
  teamId?: number;
  query?: string;
  status?: "briefing" | "in_progress" | "review" | "approved" | "on_hold" | "completed";
};

export async function listProjects(userId: number, filters: ProjectFilters) {
  const db = await requireDb();
  const conditions = [eq(projects.ownerUserId, userId)];
  if (filters.clientId) conditions.push(eq(projects.clientId, filters.clientId));
  if (filters.teamId) conditions.push(eq(projects.teamId, filters.teamId));
  if (filters.status) conditions.push(eq(projects.status, filters.status));
  if (filters.query?.trim()) conditions.push(like(projects.name, `%${filters.query.trim()}%`));

  return db
    .select({ project: projects, client: clients, team: teams, responsible: operators })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(teams, eq(projects.teamId, teams.id))
    .leftJoin(operators, eq(projects.responsibleOperatorId, operators.id))
    .where(and(...conditions))
    .orderBy(asc(projects.dueAt), desc(projects.updatedAt));
}

export async function getProject(userId: number, projectId: number) {
  const db = await requireDb();
  const rows = await db
    .select({ project: projects, client: clients, team: teams, responsible: operators })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(teams, eq(projects.teamId, teams.id))
    .leftJoin(operators, eq(projects.responsibleOperatorId, operators.id))
    .where(and(eq(projects.id, projectId), eq(projects.ownerUserId, userId)))
    .limit(1);
  return rows[0];
}

export async function createProject(userId: number, input: {
  name: string;
  description?: string | null;
  clientId: number;
  teamId?: number | null;
  responsibleOperatorId?: number | null;
  status?: "briefing" | "in_progress" | "review" | "approved" | "on_hold" | "completed";
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  sourceSkill?: "agencia" | "carrosseis" | "manual";
  startsAt?: Date | null;
  dueAt?: Date | null;
}) {
  const db = await requireDb();
  const ownedClient = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.id, input.clientId), eq(clients.createdByUserId, userId)))
    .limit(1);
  if (!ownedClient[0]) throw new Error("Cliente inválido para este espaço de trabalho");

  if (input.teamId) {
    const ownedTeam = await db
      .select({ id: teams.id })
      .from(teams)
      .where(and(eq(teams.id, input.teamId), eq(teams.createdByUserId, userId)))
      .limit(1);
    if (!ownedTeam[0]) throw new Error("Equipe inválida para este espaço de trabalho");
  }

  if (input.responsibleOperatorId) {
    const ownedOperator = await db
      .select({ id: operators.id })
      .from(operators)
      .where(and(eq(operators.id, input.responsibleOperatorId), eq(operators.createdByUserId, userId)))
      .limit(1);
    if (!ownedOperator[0]) throw new Error("Responsável inválido para este espaço de trabalho");
  }

  await db.insert(projects).values({
    ...input,
    ownerUserId: userId,
    progress: Math.max(0, Math.min(100, input.progress ?? 0)),
    status: input.status ?? "briefing",
    priority: input.priority ?? "medium",
    sourceSkill: input.sourceSkill ?? "manual",
  });
}

export async function updateProjectStatus(userId: number, projectId: number, status: "briefing" | "in_progress" | "review" | "approved" | "on_hold" | "completed") {
  const db = await requireDb();
  await db.update(projects).set({ status }).where(and(eq(projects.id, projectId), eq(projects.ownerUserId, userId)));
}

export async function assignProjectResponsible(userId: number, projectId: number, responsibleOperatorId: number | null) {
  const db = await requireDb();
  if (responsibleOperatorId) {
    const operator = await db.select({ id: operators.id }).from(operators).where(and(eq(operators.id, responsibleOperatorId), eq(operators.createdByUserId, userId))).limit(1);
    if (!operator[0]) throw new Error("Responsável inválido para este espaço de trabalho");
  }
  await db.update(projects).set({ responsibleOperatorId }).where(and(eq(projects.id, projectId), eq(projects.ownerUserId, userId)));
}

type TaskFilters = {
  clientId?: number;
  teamId?: number;
  projectId?: number;
  status?: "backlog" | "ready" | "in_progress" | "review" | "done" | "blocked";
};

export async function listTasks(userId: number, filters: TaskFilters) {
  const db = await requireDb();
  const conditions = [eq(tasks.createdByUserId, userId)];
  if (filters.teamId) conditions.push(eq(tasks.teamId, filters.teamId));
  if (filters.projectId) conditions.push(eq(tasks.projectId, filters.projectId));
  if (filters.status) conditions.push(eq(tasks.status, filters.status));
  if (filters.clientId) conditions.push(eq(projects.clientId, filters.clientId));

  return db
    .select({ task: tasks, project: projects, client: clients, team: teams, responsible: operators })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(teams, eq(tasks.teamId, teams.id))
    .leftJoin(operators, eq(tasks.responsibleOperatorId, operators.id))
    .where(and(...conditions))
    .orderBy(asc(tasks.sortOrder), asc(tasks.dueAt), desc(tasks.createdAt));
}

export async function getTask(userId: number, taskId: number) {
  const db = await requireDb();
  const rows = await db
    .select({ task: tasks, project: projects, client: clients, team: teams, responsible: operators })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(teams, eq(tasks.teamId, teams.id))
    .leftJoin(operators, eq(tasks.responsibleOperatorId, operators.id))
    .where(and(eq(tasks.id, taskId), eq(tasks.createdByUserId, userId)))
    .limit(1);
  return rows[0];
}

export async function createTask(userId: number, input: {
  title: string;
  description?: string | null;
  projectId?: number | null;
  teamId?: number | null;
  responsibleOperatorId?: number | null;
  assignedUserId?: number | null;
  status?: "backlog" | "ready" | "in_progress" | "review" | "done" | "blocked";
  priority?: "low" | "medium" | "high" | "urgent";
  dueAt?: Date | null;
  estimateMinutes?: number | null;
}) {
  const db = await requireDb();
  if (input.projectId) {
    const ownedProject = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, input.projectId), eq(projects.ownerUserId, userId))).limit(1);
    if (!ownedProject[0]) throw new Error("Projeto inválido para este espaço de trabalho");
  }
  if (input.teamId) {
    const ownedTeam = await db.select({ id: teams.id }).from(teams).where(and(eq(teams.id, input.teamId), eq(teams.createdByUserId, userId))).limit(1);
    if (!ownedTeam[0]) throw new Error("Equipe inválida para este espaço de trabalho");
  }
  if (input.responsibleOperatorId) {
    const ownedOperator = await db.select({ id: operators.id }).from(operators).where(and(eq(operators.id, input.responsibleOperatorId), eq(operators.createdByUserId, userId))).limit(1);
    if (!ownedOperator[0]) throw new Error("Responsável inválido para este espaço de trabalho");
  }
  await db.insert(tasks).values({
    ...input,
    createdByUserId: userId,
    status: input.status ?? "backlog",
    priority: input.priority ?? "medium",
  });
}

export async function updateTaskStatus(userId: number, taskId: number, status: "backlog" | "ready" | "in_progress" | "review" | "done" | "blocked") {
  const db = await requireDb();
  await db
    .update(tasks)
    .set({ status, completedAt: status === "done" ? new Date() : null })
    .where(and(eq(tasks.id, taskId), eq(tasks.createdByUserId, userId)));
}

export async function assignTaskResponsible(userId: number, taskId: number, responsibleOperatorId: number | null) {
  const db = await requireDb();
  if (responsibleOperatorId) {
    const operator = await db.select({ id: operators.id }).from(operators).where(and(eq(operators.id, responsibleOperatorId), eq(operators.createdByUserId, userId))).limit(1);
    if (!operator[0]) throw new Error("Responsável inválido para este espaço de trabalho");
  }
  await db.update(tasks).set({ responsibleOperatorId }).where(and(eq(tasks.id, taskId), eq(tasks.createdByUserId, userId)));
}

export async function listCalendarEvents(userId: number, from?: Date, to?: Date) {
  const db = await requireDb();
  const conditions = [eq(calendarEvents.ownerUserId, userId)];
  if (from) conditions.push(gte(calendarEvents.startsAt, from));
  if (to) conditions.push(lte(calendarEvents.startsAt, to));
  return db
    .select({ event: calendarEvents, project: projects, client: clients, team: teams, responsible: operators })
    .from(calendarEvents)
    .leftJoin(projects, eq(calendarEvents.projectId, projects.id))
    .leftJoin(clients, eq(calendarEvents.clientId, clients.id))
    .leftJoin(teams, eq(calendarEvents.teamId, teams.id))
    .leftJoin(operators, eq(calendarEvents.responsibleOperatorId, operators.id))
    .where(and(...conditions))
    .orderBy(asc(calendarEvents.startsAt));
}

export async function createCalendarEvent(userId: number, input: {
  title: string;
  description?: string | null;
  projectId?: number | null;
  clientId?: number | null;
  teamId?: number | null;
  responsibleOperatorId?: number | null;
  eventType?: "meeting" | "review" | "delivery" | "focus" | "deadline";
  startsAt: Date;
  endsAt?: Date | null;
}) {
  const db = await requireDb();
  if (input.projectId) {
    const ownedProject = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, input.projectId), eq(projects.ownerUserId, userId))).limit(1);
    if (!ownedProject[0]) throw new Error("Projeto inválido para este espaço de trabalho");
  }
  if (input.clientId) {
    const ownedClient = await db.select({ id: clients.id }).from(clients).where(and(eq(clients.id, input.clientId), eq(clients.createdByUserId, userId))).limit(1);
    if (!ownedClient[0]) throw new Error("Cliente inválido para este espaço de trabalho");
  }
  if (input.teamId) {
    const ownedTeam = await db.select({ id: teams.id }).from(teams).where(and(eq(teams.id, input.teamId), eq(teams.createdByUserId, userId))).limit(1);
    if (!ownedTeam[0]) throw new Error("Equipe inválida para este espaço de trabalho");
  }
  if (input.responsibleOperatorId) {
    const ownedOperator = await db.select({ id: operators.id }).from(operators).where(and(eq(operators.id, input.responsibleOperatorId), eq(operators.createdByUserId, userId))).limit(1);
    if (!ownedOperator[0]) throw new Error("Responsável inválido para este espaço de trabalho");
  }
  await db.insert(calendarEvents).values({ ...input, ownerUserId: userId, eventType: input.eventType ?? "meeting" });
}

export async function listNotifications(userId: number) {
  const db = await requireDb();
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
}

export async function createNotification(userId: number, input: {
  type: "approval" | "deadline" | "comment" | "delivery" | "system";
  title: string;
  body?: string | null;
  entityType?: string | null;
  entityId?: number | null;
  actionPath?: string | null;
}) {
  const db = await requireDb();
  await db.insert(notifications).values({ ...input, userId });
}

export async function markNotificationRead(userId: number, notificationId: number) {
  const db = await requireDb();
  await db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await requireDb();
  await db.update(notifications).set({ readAt: new Date() }).where(eq(notifications.userId, userId));
}

export async function getDashboardPreferences(userId: number) {
  const db = await requireDb();
  const existing = await db.select().from(userDashboardPreferences).where(eq(userDashboardPreferences.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(userDashboardPreferences).values({ userId });
  const created = await db.select().from(userDashboardPreferences).where(eq(userDashboardPreferences.userId, userId)).limit(1);
  return created[0];
}

export async function updateDashboardPreferences(userId: number, input: {
  activeClientId?: number | null;
  activeTeamId?: number | null;
  preferredRange?: "week" | "month";
}) {
  const db = await requireDb();
  if (input.activeClientId) {
    const ownedClient = await db.select({ id: clients.id }).from(clients).where(and(eq(clients.id, input.activeClientId), eq(clients.createdByUserId, userId))).limit(1);
    if (!ownedClient[0]) throw new Error("Cliente inválido para este espaço de trabalho");
  }
  if (input.activeTeamId) {
    const ownedTeam = await db.select({ id: teams.id }).from(teams).where(and(eq(teams.id, input.activeTeamId), eq(teams.createdByUserId, userId))).limit(1);
    if (!ownedTeam[0]) throw new Error("Equipe inválida para este espaço de trabalho");
  }
  await getDashboardPreferences(userId);
  await db.update(userDashboardPreferences).set(input).where(eq(userDashboardPreferences.userId, userId));
}

export async function getOriginalAppConnection(userId: number) {
  const db = await requireDb();
  const rows = await db.select().from(originalAppConnections).where(eq(originalAppConnections.userId, userId)).limit(1);
  return rows[0];
}

export async function saveOriginalAppConnection(userId: number, baseUrl: string) {
  const db = await requireDb();
  await db
    .insert(originalAppConnections)
    .values({ userId, baseUrl, connectionStatus: "pending" })
    .onDuplicateKeyUpdate({ set: { baseUrl, connectionStatus: "pending", lastError: null, lastCheckedAt: null } });
}

export async function updateOriginalAppConnectionStatus(userId: number, status: "connected" | "error", lastError?: string | null) {
  const db = await requireDb();
  await db
    .update(originalAppConnections)
    .set({ connectionStatus: status, lastError: lastError ?? null, lastCheckedAt: new Date() })
    .where(eq(originalAppConnections.userId, userId));
}

export async function listProjectArtifacts(userId: number, projectId: number) {
  const db = await requireDb();
  const project = await getProject(userId, projectId);
  if (!project) return [];
  return db.select().from(projectArtifacts).where(eq(projectArtifacts.projectId, projectId)).orderBy(desc(projectArtifacts.syncedAt));
}

export async function addProjectArtifacts(userId: number, projectId: number, artifacts: Array<{ fileName: string; fileSize?: number | null; sourcePath?: string | null }>) {
  const db = await requireDb();
  const project = await getProject(userId, projectId);
  if (!project || artifacts.length === 0) return;
  await db.insert(projectArtifacts).values(artifacts.map(artifact => ({ projectId, ...artifact })));
}

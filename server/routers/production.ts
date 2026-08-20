import { z } from "zod";
import { createCalendarEvent, createNotification, createTask, getTask, listCalendarEvents, listTasks, updateTaskStatus } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { getOperationalUserId } from "./helpers";

const taskStatus = z.enum(["backlog", "ready", "in_progress", "review", "done", "blocked"]);
const priority = z.enum(["low", "medium", "high", "urgent"]);

export const productionRouter = router({
  tasks: protectedProcedure
    .input(z.object({ clientId: z.number().int().positive().optional(), teamId: z.number().int().positive().optional(), projectId: z.number().int().positive().optional(), status: taskStatus.optional() }).optional())
    .query(async ({ ctx, input }) => listTasks(await getOperationalUserId(ctx.user), input ?? {})),
  getTask: protectedProcedure
    .input(z.object({ taskId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => getTask(await getOperationalUserId(ctx.user), input.taskId)),
  agenda: protectedProcedure
    .input(z.object({ from: z.date().optional(), to: z.date().optional() }).optional())
    .query(async ({ ctx, input }) => listCalendarEvents(await getOperationalUserId(ctx.user), input?.from, input?.to)),
  createTask: protectedProcedure
    .input(z.object({
      title: z.string().trim().min(2).max(240), description: z.string().trim().max(5000).nullish(), projectId: z.number().int().positive().nullish(), teamId: z.number().int().positive().nullish(), responsibleOperatorId: z.number().int().positive().nullish(),
      status: taskStatus.optional(), priority: priority.optional(), dueAt: z.date().nullish(), estimateMinutes: z.number().int().min(1).max(10_080).nullish(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getOperationalUserId(ctx.user);
      await createTask(userId, input);
      await createNotification(userId, { type: "system", title: "Nova tarefa na produção", body: input.title, actionPath: "/producao" });
      return { success: true } as const;
    }),
  updateTaskStatus: protectedProcedure
    .input(z.object({ taskId: z.number().int().positive(), status: taskStatus }))
    .mutation(async ({ ctx, input }) => {
      await updateTaskStatus(await getOperationalUserId(ctx.user), input.taskId, input.status);
      return { success: true } as const;
    }),
  createEvent: protectedProcedure
    .input(z.object({
      title: z.string().trim().min(2).max(240), description: z.string().trim().max(5000).nullish(), projectId: z.number().int().positive().nullish(), clientId: z.number().int().positive().nullish(), teamId: z.number().int().positive().nullish(), responsibleOperatorId: z.number().int().positive().nullish(),
      eventType: z.enum(["meeting", "review", "delivery", "focus", "deadline"]).optional(), startsAt: z.date(), endsAt: z.date().nullish(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createCalendarEvent(await getOperationalUserId(ctx.user), input);
      return { success: true } as const;
    }),
});

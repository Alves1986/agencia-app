import { z } from "zod";
import { createNotification, createProject, getProject, listProjectArtifacts, listProjects, updateProjectStatus } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { getOperationalUserId } from "./helpers";

const projectStatus = z.enum(["briefing", "in_progress", "review", "approved", "on_hold", "completed"]);
const priority = z.enum(["low", "medium", "high", "urgent"]);

export const projectsRouter = router({
  list: protectedProcedure
    .input(z.object({ clientId: z.number().int().positive().optional(), teamId: z.number().int().positive().optional(), query: z.string().trim().max(180).optional(), status: projectStatus.optional() }).optional())
    .query(async ({ ctx, input }) => listProjects(await getOperationalUserId(ctx.user), input ?? {})),
  get: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => getProject(await getOperationalUserId(ctx.user), input.projectId)),
  artifacts: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => listProjectArtifacts(await getOperationalUserId(ctx.user), input.projectId)),
  create: protectedProcedure
    .input(z.object({
      name: z.string().trim().min(2).max(200), description: z.string().trim().max(5000).nullish(), clientId: z.number().int().positive(), teamId: z.number().int().positive().nullish(), responsibleOperatorId: z.number().int().positive().nullish(),
      status: projectStatus.optional(), priority: priority.optional(), progress: z.number().int().min(0).max(100).optional(), sourceSkill: z.enum(["agencia", "carrosseis", "manual"]).optional(),
      startsAt: z.date().nullish(), dueAt: z.date().nullish(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getOperationalUserId(ctx.user);
      await createProject(userId, input);
      await createNotification(userId, { type: "system", title: "Projeto criado", body: `${input.name} entrou no radar de operação.`, actionPath: "/projetos" });
      return { success: true } as const;
    }),
  updateStatus: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive(), status: projectStatus }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getOperationalUserId(ctx.user);
      await updateProjectStatus(userId, input.projectId, input.status);
      return { success: true } as const;
    }),
});

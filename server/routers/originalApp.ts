import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { addProjectArtifacts, createNotification, getOriginalAppConnection, saveOriginalAppConnection, updateOriginalAppConnectionStatus } from "../db";
import { inspectOriginalApp, normalizeOriginalAppUrl } from "../originalApp";
import { protectedProcedure, router } from "../_core/trpc";
import { getOperationalUserId } from "./helpers";

export const originalAppRouter = router({
  connection: protectedProcedure.query(async ({ ctx }) => (await getOriginalAppConnection(await getOperationalUserId(ctx.user))) ?? null),
  testAndSave: protectedProcedure
    .input(z.object({ baseUrl: z.string().trim().min(8).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getOperationalUserId(ctx.user);
      let baseUrl = "";
      try {
        baseUrl = normalizeOriginalAppUrl(input.baseUrl);
        await saveOriginalAppConnection(userId, baseUrl);
        const status = await inspectOriginalApp(baseUrl);
        await updateOriginalAppConnectionStatus(userId, "connected");
        await createNotification(userId, { type: "system", title: "Aplicação original conectada", body: "Skills e arquivos de produção já podem ser consultados no painel.", actionPath: "/producao" });
        return status;
      } catch (error) {
        if (baseUrl) await updateOriginalAppConnectionStatus(userId, "error", error instanceof Error ? error.message : "Falha de conexão");
        throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Falha ao conectar a aplicação original." });
      }
  }),
  inspect: protectedProcedure.query(async ({ ctx }) => {
    const userId = await getOperationalUserId(ctx.user);
    const connection = await getOriginalAppConnection(userId);
    if (!connection) return null;
    try {
      const status = await inspectOriginalApp(connection.baseUrl);
      await updateOriginalAppConnectionStatus(userId, "connected");
      return status;
    } catch (error) {
      await updateOriginalAppConnectionStatus(userId, "error", error instanceof Error ? error.message : "Falha de conexão");
      throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Falha ao consultar aplicação original." });
    }
  }),
  attachFilesToProject: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive(), fileNames: z.array(z.string().trim().min(1).max(255)).min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getOperationalUserId(ctx.user);
      const connection = await getOriginalAppConnection(userId);
      if (!connection) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Conecte a aplicação original antes de importar arquivos." });
      try {
        const original = await inspectOriginalApp(connection.baseUrl);
        const requested = new Set(input.fileNames);
        const artifacts = original.files.filter(file => requested.has(file.name)).map(file => ({ fileName: file.name, fileSize: file.size ?? null, sourcePath: `${connection.baseUrl}/api/storage/${encodeURIComponent(file.name)}` }));
        await addProjectArtifacts(userId, input.projectId, artifacts);
        await updateOriginalAppConnectionStatus(userId, "connected");
        await createNotification(userId, { type: "delivery", title: "Arquivos de produção vinculados", body: `${artifacts.length} arquivo(s) foram relacionados ao projeto.`, entityType: "project", entityId: input.projectId, actionPath: "/projetos" });
        return { attached: artifacts.length };
      } catch (error) {
        await updateOriginalAppConnectionStatus(userId, "error", error instanceof Error ? error.message : "Falha de conexão");
        throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Falha ao importar arquivos." });
      }
    }),
});

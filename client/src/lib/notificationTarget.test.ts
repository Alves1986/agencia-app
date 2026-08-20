import { describe, expect, it } from "vitest";
import { getNotificationTarget, getTaskIdFromLocation } from "./notificationTarget";

describe("getNotificationTarget", () => {
  it("prioriza o projeto específico vinculado à notificação", () => {
    expect(getNotificationTarget({ entityType: "project", entityId: 42, actionPath: "/projetos" })).toBe("/projetos?projeto=42");
  });

  it("prioriza a tarefa específica vinculada à notificação", () => {
    expect(getNotificationTarget({ entityType: "task", entityId: 19, actionPath: "/producao" })).toBe("/producao?tarefa=19");
  });

  it("preserva o caminho genérico quando não há uma entidade vinculada", () => {
    expect(getNotificationTarget({ entityType: "system", actionPath: "/producao" })).toBe("/producao");
  });

  it("identifica uma tarefa válida na rota contextual de Produção", () => {
    expect(getTaskIdFromLocation("/producao?tarefa=19")).toBe(19);
    expect(getTaskIdFromLocation("/producao?tarefa=0")).toBeNull();
  });
});

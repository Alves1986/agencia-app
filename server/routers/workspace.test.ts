import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "validation-user",
      name: "Validation User",
      email: "validation@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("workspace.createClient", () => {
  it("rejeita dados inválidos antes de executar uma gravação", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.workspace.createClient({ name: "A" })).rejects.toThrow();
  });
});

describe("responsible assignment contracts", () => {
  it("rejects invalid project and task identifiers before a write", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.projects.assignResponsible({ projectId: 0, responsibleOperatorId: 1 })).rejects.toThrow();
    await expect(caller.production.assignResponsible({ taskId: 0, responsibleOperatorId: 1 })).rejects.toThrow();
  });
});

import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import vercelConfig from "../vercel.json";

describe("createApp", () => {
  it("registra as rotas HTTP reutilizáveis pela função serverless", () => {
    const app = createApp();
    const layers = (app as unknown as { _router: { stack: Array<{ route?: { path?: string }; regexp?: RegExp }> } })._router.stack;

    expect(typeof app).toBe("function");
    expect(layers.some(layer => layer.route?.path === "/api/oauth/callback")).toBe(true);
    expect(layers.some(layer => String(layer.regexp).includes("api\\/trpc"))).toBe(true);
  });

  it("declara o preset Vite e a saída estática esperada pela Vercel", () => {
    expect(vercelConfig.framework).toBe("vite");
    expect(vercelConfig.buildCommand).toBe("pnpm build");
    expect(vercelConfig.outputDirectory).toBe("dist/public");
  });
});

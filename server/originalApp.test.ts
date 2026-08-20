import { describe, expect, it } from "vitest";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { inspectOriginalApp, normalizeOriginalAppUrl } from "./originalApp";

describe("normalizeOriginalAppUrl", () => {
  it("normaliza uma URL HTTPS pública sem carregar credenciais ou fragmentos", () => {
    expect(normalizeOriginalAppUrl("https://api.exemplo.com/base/?q=teste#top")).toBe("https://api.exemplo.com/base");
  });

  it("rejeita destinos locais e conexões não seguras", () => {
    expect(() => normalizeOriginalAppUrl("http://api.exemplo.com")).toThrow("HTTPS públicas");
    expect(() => normalizeOriginalAppUrl("https://localhost:8000")).toThrow("endereço local");
    expect(() => normalizeOriginalAppUrl("https://192.168.1.20")).toThrow("endereço local");
  });

  it("rejeita uma URL malformada antes de iniciar a inspeção", () => {
    expect(() => normalizeOriginalAppUrl("api.exemplo.com sem protocolo")).toThrow("URL pública válida");
  });

  it("informa uma indisponibilidade de backend sem expor detalhes internos", async () => {
    const timeoutError = Object.assign(new Error("timeout"), { code: "ECONNABORTED" });
    const get = vi.fn().mockRejectedValue(timeoutError);
    const create = vi.spyOn(axios, "create").mockReturnValue({ get } as ReturnType<typeof axios.create>);
    const isAxiosError = vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    await expect(inspectOriginalApp("https://api.exemplo.com")).rejects.toThrow("tempo limite");

    create.mockRestore();
    isAxiosError.mockRestore();
  });
});

import { describe, expect, it } from "vitest";
import { normalizeOriginalAppUrl } from "./originalApp";

describe("normalizeOriginalAppUrl", () => {
  it("normaliza uma URL HTTPS pública sem carregar credenciais ou fragmentos", () => {
    expect(normalizeOriginalAppUrl("https://api.exemplo.com/base/?q=teste#top")).toBe("https://api.exemplo.com/base");
  });

  it("rejeita destinos locais e conexões não seguras", () => {
    expect(() => normalizeOriginalAppUrl("http://api.exemplo.com")).toThrow("HTTPS públicas");
    expect(() => normalizeOriginalAppUrl("https://localhost:8000")).toThrow("endereço local");
    expect(() => normalizeOriginalAppUrl("https://192.168.1.20")).toThrow("endereço local");
  });
});

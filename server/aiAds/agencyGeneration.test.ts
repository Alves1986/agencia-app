import { describe, expect, it } from "vitest";
import { buildAgencyPrompt } from "./agencyGeneration";

describe("buildAgencyPrompt", () => {
  it("preserva lacunas de evidência e evita instruções de carrossel composto", () => {
    const prompt = buildAgencyPrompt({ mode: "bundle", clientName: "Globo Acabamentos", campaignName: "Campanha", objective: "Gerar demanda", briefing: "Valorizar acabamentos", profile: { voice: "direta", positioning: null, audience: null, offers: null, proofPolicy: null, visualSystem: null } });
    expect(prompt).toContain("nunca invente fatos");
    expect(prompt).toContain("cada slide é uma arte vertical independente");
    expect(prompt).toContain("Globo Acabamentos");
  });
});

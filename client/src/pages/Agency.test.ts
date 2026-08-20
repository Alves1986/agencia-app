import { describe, expect, it } from "vitest";
import { agencyModeOptions } from "./Agency";

describe("modos da Agência IA", () => {
  it("mantém fluxos integrados e separados para o mesmo briefing", () => {
    expect(Object.keys(agencyModeOptions)).toEqual(["bundle", "ads", "carousel", "video", "strategy", "council"]);
    expect(agencyModeOptions.bundle.label).toBe("Campanha integrada");
    expect(agencyModeOptions.carousel.description).toContain("artes independentes");
    expect(agencyModeOptions.council.description).toContain("risco humano");
  });
});

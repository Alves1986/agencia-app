import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProjectListEntry } from "./Projects";

describe("ProjectListEntry", () => {
  it("exibe Anderson no projeto real de Globo Acabamentos após a leitura do vínculo", () => {
    const markup = renderToStaticMarkup(
      createElement(ProjectListEntry, {
        row: {
          project: { id: 1, name: "Validação operacional — Globo Acabamentos", priority: "medium", dueAt: null, status: "in_progress", progress: 0 },
          client: { name: "Globo Acabamentos" },
          team: null,
          responsible: { name: "Anderson" },
        },
        selected: false,
        onSelect: vi.fn(),
      }),
    );

    expect(markup).toContain("Validação operacional — Globo Acabamentos");
    expect(markup).toContain("Globo Acabamentos");
    expect(markup).toContain("Anderson");
  });
});

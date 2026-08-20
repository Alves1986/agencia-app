import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TeamFilterOptions } from "./StudioShell";

describe("TeamFilterOptions", () => {
  it("exibe Vertex entre as opções carregadas no filtro persistente de equipes", () => {
    const markup = renderToStaticMarkup(createElement("select", null,
      createElement(TeamFilterOptions, { teams: [{ id: 1, name: "Vertex" }] }),
    ));

    expect(markup).toContain('value="1"');
    expect(markup).toContain("Vertex");
  });
});

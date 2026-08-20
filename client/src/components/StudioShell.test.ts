import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TeamFilterOptions, VertexBrand, vertexLogo } from "./StudioShell";

describe("TeamFilterOptions", () => {
  it("exibe Vertex entre as opções carregadas no filtro persistente de equipes", () => {
    const markup = renderToStaticMarkup(createElement("select", null,
      createElement(TeamFilterOptions, { teams: [{ id: 1, name: "Vertex" }] }),
    ));

    expect(markup).toContain('value="1"');
    expect(markup).toContain("Vertex");
  });
});

describe("VertexBrand", () => {
  it("exibe a assinatura VERTEX Consulting com a logo permanente fornecida", () => {
    const markup = renderToStaticMarkup(createElement(VertexBrand));

    expect(markup).toContain("VERTEX");
    expect(markup).toContain("Consulting");
    expect(markup).toContain('alt="Logo VERTEX"');
    expect(markup).toContain(vertexLogo);
  });
});

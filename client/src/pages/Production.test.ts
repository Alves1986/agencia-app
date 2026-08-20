import { createElement, createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TaskDetail } from "./Production";

describe("TaskDetail", () => {
  it("renderiza o detalhe da tarefa vinculada com um alvo de foco acessível", () => {
    const markup = renderToStaticMarkup(
      createElement(TaskDetail, {
        task: {
          task: { id: 19, title: "Revisar roteiro principal", description: "Aprovar a versão final.", status: "review", dueAt: null },
          project: { name: "Campanha Aurora" },
          client: { name: "Cliente Norte" },
          team: { name: "Criação" },
          responsible: { name: "Marina" },
        },
        detailRef: createRef<HTMLElement>(),
        onClose: vi.fn(),
        onStatus: vi.fn(),
      }),
    );

    expect(markup).toContain("Revisar roteiro principal");
    expect(markup).toContain("Campanha Aurora");
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('tabindex="-1"');
  });
});

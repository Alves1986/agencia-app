import { createElement, createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { IntegrationPanel, TaskDetail } from "./Production";

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

describe("IntegrationPanel", () => {
  const baseProps = {
    connectionUrl: "https://agencia-app-backend.onrender.com",
    setConnectionUrl: vi.fn(),
    connection: { connectionStatus: "connected" },
    loading: false,
    projects: [{ project: { id: 44, name: "Campanha Aurora" } }],
    projectToAttach: "no-project",
    setProjectToAttach: vi.fn(),
    selectedFiles: [],
    toggleFile: vi.fn(),
    onConnect: vi.fn(),
    connecting: false,
    onAttach: vi.fn(),
    attaching: false,
  };

  it("mostra skills carregadas e o estado verificado sem arquivos", () => {
    const markup = renderToStaticMarkup(
      createElement(IntegrationPanel, {
        ...baseProps,
        integration: {
          config: { configured: false, provider: null },
          skills: [{ id: "agencia", name: "Agência de Anúncios (7 Etapas)" }],
          files: [],
        },
      }),
    );

    expect(markup).toContain("Instância conectada");
    expect(markup).toContain("Agência de Anúncios (7 Etapas)");
    expect(markup).toContain("A instância não retornou arquivos em `storage`.");
  });

  it("oferece um artefato disponível para associação a um projeto", () => {
    const markup = renderToStaticMarkup(
      createElement(IntegrationPanel, {
        ...baseProps,
        integration: {
          config: { configured: true, provider: "openai" },
          skills: [],
          files: [{ name: "video-final.mp4" }],
        },
      }),
    );

    expect(markup).toContain("video-final.mp4");
    expect(markup).toContain("Campanha Aurora");
    expect(markup).toContain("Vincular arquivos selecionados");
  });

  it("indica carregamento enquanto consulta a instância original", () => {
    const markup = renderToStaticMarkup(
      createElement(IntegrationPanel, {
        ...baseProps,
        loading: true,
        integration: undefined,
      }),
    );

    expect(markup).toContain("Consultando instância original…");
  });

  it("mostra o último erro de conexão sem expor detalhes internos", () => {
    const markup = renderToStaticMarkup(
      createElement(IntegrationPanel, {
        ...baseProps,
        connection: { connectionStatus: "error", lastError: "A conexão excedeu o tempo limite." },
        integration: undefined,
      }),
    );

    expect(markup).toContain("A conexão excedeu o tempo limite.");
  });
});

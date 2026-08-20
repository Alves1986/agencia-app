# Validação da equipe Vertex

A equipe real **Vertex** foi criada pelo contrato protegido `workspace.createTeam` e lida novamente pelo contrato `workspace.teams`, que abastece o filtro persistente do painel. A leitura retornou o registro com identificador `1` e cor padrão `#E85D3F`.

O teste `client/src/components/StudioShell.test.ts` renderiza as opções do filtro de equipes e confirma que `Vertex` é exibida quando retornada pelo workspace. A validação local subsequente foi concluída com 21 testes, verificação de tipos e build de produção.

O usuário confirmou visualmente que **Vertex** aparece em **Filtros do painel → Equipe** na prévia autenticada. A sessão isolada de validação havia sido redirecionada ao fluxo OAuth; por isso, essa confirmação foi feita na sessão do próprio usuário.

O contrato protegido `workspace.updateTeam` também foi executado de maneira idempotente no registro real: o nome `Vertex` e a cor `#E85D3F` foram preservados e confirmados por uma nova consulta autenticada.

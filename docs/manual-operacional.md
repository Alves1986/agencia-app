# Agência — Manual técnico e operacional

> **Versão de referência:** agosto de 2026. Este documento descreve a versão do painel operacional reconstruído, sua ligação com a aplicação original de IA e o procedimento seguro para manutenção futura.

## 1. Finalidade do sistema

O sistema **Agência** é um centro de comando para operações criativas. Ele organiza a gestão diária de clientes, equipes, responsáveis, projetos, tarefas, marcos de agenda e arquivos entregáveis. A interface usa a direção visual **Radar de Estúdio**: um espaço de leitura rápida, com navegação lateral escura, prioridades em laranja e módulos de operação com hierarquia editorial.

O painel não substitui a aplicação original de geração criativa. Em vez disso, ele separa responsabilidades: a aplicação FastAPI original continua responsável pelas skills de criação e pelo armazenamento de arquivos gerados; o novo painel concentra a administração de projetos e a produção.

| Camada | Responsabilidade | Fonte atual |
|---|---|---|
| Painel operacional | Projetos, produção, agenda, filtros, responsáveis e notificações. | Projeto `agencia-app-redesign`. |
| Aplicação criativa original | Skills **Agência de Anúncios** e **Máquina de Carrosséis**, chat e arquivos gerados. | FastAPI no Render. |
| Interface original | Entrada alternativa para os módulos criativos. | Vercel. |
| Banco operacional | Dados persistentes do painel por usuário autenticado. | Banco gerenciado do projeto. |

## 2. Endereços e ambientes

| Recurso | Endereço atual | Uso | Observação de manutenção |
|---|---|---|---|
| Interface original | `https://agencia-app-dun.vercel.app/` | Acesso direto aos módulos criativos originais. | Pode mudar de nome ou domínio sem afetar o painel se a URL FastAPI continuar configurada. |
| Backend FastAPI | `https://agencia-app-backend.onrender.com` | Consulta de skills e arquivos de produção. | Esta é a URL registrada inicialmente para o administrador. |
| Contrato OpenAPI | `https://agencia-app-backend.onrender.com/openapi.json` | Referência de endpoints e formatos da API. | Consultar sempre antes de alterar a integração. |
| Painel operacional | Ambiente gerenciado do projeto Agência. | Administração de operações. | Publicar a versão desejada no painel de gerenciamento após um checkpoint. |

> **Regra de segurança:** a URL FastAPI deve ser pública e HTTPS. O painel bloqueia `localhost`, IPs privados, URLs com credenciais e redirecionamentos, evitando que a integração alcance serviços internos por engano.

## 3. Visão geral da interface

![Captura da visão geral do painel](/manus-storage/01-visao-geral_741e3fd6.png)

Na **Visão geral**, o radar sintetiza a operação em três leituras: projetos em curso, itens que pedem atenção e tarefas concluídas. Os cartões inferiores mostram os projetos em radar, os próximos marcos e um atalho para a fila de Produção.

| Área | O que exibe | Ação recomendada |
|---|---|---|
| Navegação lateral | Visão geral, Projetos e Produção. | Use-a para mudar de contexto sem perder filtros. |
| Filtros | Cliente e equipe ativos. | Defina o recorte antes de analisar carteira ou fila. |
| Notificações | Sinais de criação, prazo, entrega e atualização. | Abra a notificação para ir ao projeto ou tarefa vinculada. |
| Resumo | Indicadores de estado corrente. | Trate itens em revisão ou bloqueados como prioridade. |

## 4. Fluxo de implantação operacional

O painel inicia sem dados de demonstração para respeitar a propriedade da operação. Como validação autorizada, ele já contém o cliente real **Globo Acabamentos**, o projeto de referência **Validação operacional — Globo Acabamentos** e a tarefa **Revisar o fluxo inicial do painel**. Esses três registros devem permanecer disponíveis para sua revisão até que o responsável decida removê-los.

| Ordem | Ação | Resultado persistido |
|---:|---|---|
| 1 | Abra **Projetos**. | O sistema carrega clientes, equipes e responsáveis do usuário atual. |
| 2 | Cadastre ao menos um cliente. | O cliente torna-se disponível em filtros e no formulário de projeto. |
| 3 | Cadastre uma equipe quando houver divisão de trabalho. | A equipe pode ser usada como filtro e vínculo de projeto. |
| 4 | Cadastre os responsáveis. | Responsáveis podem ser atribuídos a projetos, tarefas e marcos. |
| 5 | Crie o primeiro projeto. | O projeto passa a aparecer na carteira e pode receber tarefas e arquivos. |
| 6 | Abra **Produção** e registre tarefas e marcos. | A agenda e o quadro passam a refletir a execução real. |

## 5. Gestão de Projetos

![Captura da página Projetos](/manus-storage/02-projetos_cec97663.png)

A página **Projetos** é a carteira operacional. Ela foi desenhada para que o contexto não se perca entre briefing, cliente, equipe, responsável, prazo e andamento. Antes de abrir um projeto, crie o cliente. A equipe é opcional, mas recomendada quando a produção envolve áreas diferentes.

| Recurso | Como usar | Efeito no sistema |
|---|---|---|
| Busca | Informe parte do nome no campo de busca. | Reduz a lista apresentada sem apagar dados. |
| Cliente e equipe | Cadastre no bloco de configuração inicial. | Alimentam filtros globais e novos projetos. |
| Responsável | Use o botão **Responsável** para cadastrar e selecione-o no projeto. | Mostra quem conduz o item e permite rastrear a carga de trabalho. |
| Status | Atualize conforme o ciclo: briefing, andamento, revisão, aprovado, pausado ou concluído. | Atualiza a leitura do radar e a carteira. |
| Arquivos vinculados | Abra o detalhe do projeto após importar arquivos pela Produção. | Exibe os entregáveis vindos da aplicação original. |

### Regras de dados

Cada projeto pertence ao usuário autenticado que o criou. Clientes, equipes, responsáveis, tarefas, eventos, filtros e conexões externas também são isolados por usuário. Isso impede que um usuário veja ou atualize a operação de outro por meio da interface ou dos procedimentos de servidor.

## 6. Produção, agenda e tarefas

![Captura da página Produção e da integração](/manus-storage/03-producao-integracao_25624e42.png)

A página **Produção** transforma tarefas em uma régua visual de execução. As colunas correspondem a backlog, pronto, em produção, em revisão, concluído e bloqueado. Use a prioridade para sinalizar impacto e o status para sinalizar estágio, sem misturar os dois conceitos.

| Ação | Onde realizar | Boa prática |
|---|---|---|
| Criar tarefa | Botão **Nova tarefa**. | Vincule a projeto, responsável, prioridade e prazo sempre que aplicável. |
| Atualizar estágio | Seletor no cartão de tarefa. | Use **bloqueado** apenas quando houver dependência real e descreva o motivo no contexto da tarefa. |
| Registrar reunião, revisão ou entrega | Botão **Novo marco**. | Preencha data e hora em UTC; a interface converte o horário para o fuso local do navegador. |
| Abrir detalhe de uma tarefa | Use uma notificação vinculada ou a rota de Produção. | O painel rola até o cartão e move o foco ao detalhe para acessibilidade por teclado. |
| Associar arquivos ao projeto | Painel **Arquivos de produção**. | Selecione apenas arquivos realmente gerados pelo backend e escolha o projeto destinatário. |

### Registros reais de referência

![Projeto de referência de Globo Acabamentos](/manus-storage/04-projetos-globo_2a1c3e95.png)

![Tarefa de referência de Globo Acabamentos](/manus-storage/05-producao-globo_729202c3.png)

O projeto de referência está em **andamento**, com prioridade média e prazo em 27 de agosto de 2026. Sua tarefa está no estágio **pronto**, com prazo em 22 de agosto de 2026 e estimativa de 45 minutos. Os dois registros foram criados e atualizados pelos mesmos contratos autenticados que a interface usa; eles não são dados fictícios e devem ser removidos somente por decisão do responsável.

## 7. Filtros persistentes

Os filtros de **cliente** e **equipe** ficam no ícone de controles no cabeçalho. A seleção é gravada nas preferências do usuário e acompanha a navegação entre Visão geral, Projetos e Produção. O filtro não apaga dados, apenas altera o recorte apresentado.

| Cenário | Configuração sugerida | Resultado esperado |
|---|---|---|
| Reunião com um cliente | Selecione o cliente e mantenha todas as equipes. | Mostra a carteira, tarefas e indicadores daquele cliente. |
| Priorização de uma área | Selecione a equipe e mantenha todos os clientes. | Ajuda a enxergar carga, prazos e bloqueios de uma área. |
| Leitura completa | Use **Limpar filtros**. | Restaura todos os dados pertencentes ao usuário. |

## 8. Notificações interativas

O sino no cabeçalho concentra notificações de sistema, entregas e alterações da operação. Notificações não são apenas avisos: quando possuem entidade vinculada, a ação navega diretamente ao contexto correto.

| Tipo de vínculo | Destino | Comportamento |
|---|---|---|
| Projeto | `/projetos?projeto={id}` | Abre e destaca o projeto correspondente. |
| Tarefa | `/producao?tarefa={id}` | Abre Produção, rola até o cartão e mostra o detalhe focalizável. |
| Sistema | Rota definida no evento. | Leva ao contexto de configuração ou produção relacionado. |

Marcar uma notificação como lida não apaga o histórico. Use **Ler todas** apenas após tratar os sinais relevantes.

## 9. Integração com a aplicação FastAPI original

A conexão registrada utiliza a URL `https://agencia-app-backend.onrender.com`. As rotas de leitura foram verificadas e retornam duas skills disponíveis e a listagem atual de arquivos. No estado verificado, o armazenamento contém apenas `.gitkeep`, portanto ainda não há entrega real para associar a um projeto.

> **Evidência de integração em execução:** o contrato protegido `originalApp.testAndSave`, que também é acionado pelo botão **Conectar/Atualizar** de Produção, foi executado para a conta administradora em 20 de agosto de 2026. Ele concluiu a inspeção da instância publicada com `configured: false`, retornou as skills **Agencia de Anuncios (7 Etapas)** e **Maquina de Carrosseis**, e retornou somente o arquivo `.gitkeep`. A captura de Produção deste pacote mostra o estado conectado, as skills carregadas e a mensagem visual correspondente. Assim, não há ainda um artefato de produção útil para selecionar e vincular a um projeto.

| Endpoint | Método | Integração atual | Limite de segurança |
|---|---:|---|---|
| `/api/skills` | GET | Lista as skills no painel de Produção. | Leitura apenas. |
| `/api/storage/list` | GET | Lista arquivos disponíveis para vincular. | Leitura apenas. |
| `/api/storage/{filename}` | GET | Constrói o caminho de origem do artefato vinculado. | Nome de arquivo controlado pela lista recebida. |
| `/api/chat` e `/api/chat/stream` | POST | Não chamados automaticamente pelo painel. | Exigem uma experiência explícita e autorização própria. |
| `/api/config` | GET/POST | O painel não replica chaves de IA. | Nunca enviar chave de IA para o banco ou navegador do painel. |
| `/api/storage/save` | POST | Não é acionado pelo painel. | Só usar após desenhar fluxo explícito de gravação. |

### Como atualizar a URL quando o nome ou domínio mudar

1. Publique a nova instância FastAPI e confirme que `https://novo-dominio/openapi.json` responde corretamente.
2. Abra **Produção** no painel operacional.
3. No cartão **Aplicação original**, substitua a URL pelo novo endereço HTTPS.
4. Clique em **Atualizar**. O sistema testa as rotas de skills, configuração e arquivos antes de gravar o estado conectado.
5. Confirme que as skills aparecem no cartão e que os arquivos da instância estão listados.
6. Se a aplicação de interface do Vercel também mudar de nome, atualize seus links de comunicação e documentação. A integração do painel não depende da URL do Vercel; ela depende exclusivamente da URL FastAPI.

> **Importante:** o endereço deve apontar para a API FastAPI, não apenas para uma landing page ou um domínio que redireciona para outro host. A integração bloqueia redirecionamentos por segurança.

## 10. Skill instalada: edição multicâmera

Foi instalada uma skill de uso interno em:

```text
/home/ubuntu/skills/multicamera-video-editing/SKILL.md
```

Ela foi construída a partir do arquivo `VideoParadoViraEdicaode8Cameras.md` e define um fluxo para transformar um vídeo base em uma edição dinâmica de até oito câmeras, mantendo continuidade. A skill separa planejamento, análise do material, definição de linguagem, revisão de custos, execução e validação.

| Recurso da skill | Finalidade |
|---|---|
| `SKILL.md` | Regras de decisão, sequência de trabalho e limitações obrigatórias. |
| `references/shot-playbook.md` | Guia de cobertura, cortes, continuidade, lente e ritmo. |
| `templates/video-edit-prompt.md` | Modelo de prompt para pedidos consistentes de edição multicâmera. |

O fluxo exige aprovação explícita antes de qualquer geração paga e não deve criar pessoas, falas, produtos ou eventos que não estejam no material fornecido. Para usar a skill no futuro, descreva o objetivo, o formato, o material de referência, a duração, o tom e a quantidade máxima de ângulos desejada.

## 11. Arquitetura técnica para manutenção

| Área | Caminho principal | Responsabilidade |
|---|---|---|
| Esquema de dados | `drizzle/schema.ts` | Define tabelas, relações e tipos de operações. |
| Migrações | `drizzle/migrations/` | Mantém banco e esquema sincronizados. |
| Acesso a dados | `server/db.ts` | Consulta e atualiza dados com isolamento por usuário. |
| Contratos tRPC | `server/routers/` | Expõe operações tipadas para clientes, projetos, produção, notificações e integração. |
| Adaptador externo | `server/originalApp.ts` | Valida URL e consulta a aplicação FastAPI sem expor segredo. |
| Rotas externas | `server/routers/originalApp.ts` | Persiste e verifica a conexão do usuário com a API original. |
| Casca visual | `client/src/components/StudioShell.tsx` | Navegação, filtros persistentes e centro de notificações. |
| Páginas operacionais | `client/src/pages/Projects.tsx` e `client/src/pages/Production.tsx` | Fluxos de carteira e execução. |

### Procedimento para alteração de banco

1. Atualize `drizzle/schema.ts` primeiro.
2. Gere a migração com `pnpm drizzle-kit generate`.
3. Leia o SQL gerado e confirme que ele não remove nem altera dados de modo destrutivo sem uma migração planejada.
4. Aplique a migração pelo fluxo de banco gerenciado.
5. Atualize `server/db.ts` e o roteador correspondente.
6. Inclua teste unitário para o novo contrato ou regra de segurança.
7. Execute `pnpm test` e `pnpm check` antes do checkpoint.

### Procedimento para alteração de interface

1. Adicione a alteração em `todo.md` antes da implementação.
2. Preserve os tokens visuais do Radar de Estúdio: base azul-petróleo, superfícies claras, tipografia Space Grotesk e laranja para ação/prioridade.
3. Reaproveite a casca `StudioShell` para novas páginas internas.
4. Inclua estados de carregamento, vazio e erro em qualquer leitura de dados.
5. Verifique desktop e mobile com capturas antes de registrar o checkpoint.

## 12. Testes e validação atual

A versão documentada foi verificada com testes unitários e verificação de tipos. A suíte atual cobre logout, proteção da URL externa, indisponibilidade controlada do backend, rejeição de dados de cliente inválidos, resolução de destinos de notificações, renderização do detalhe de tarefa e os estados de carregamento e erro da integração. A integração publicada também foi testada pelas rotas reais de leitura de skills e arquivos.

| Verificação | Resultado | Escopo |
|---|---|---|
| `pnpm test` | Aprovado: 5 arquivos, 15 testes. | Autenticação, URL externa, indisponibilidade controlada, dados inválidos, notificações, detalhe de tarefa e estados de integração. |
| `pnpm check` | Aprovado. | Tipagem TypeScript do cliente e servidor. |
| `/api/skills` | Aprovado. | Retornou as skills Agência de Anúncios e Máquina de Carrosséis. |
| `/api/storage/list` | Aprovado. | Retornou o conteúdo atual do armazenamento. |
| Capturas desktop | Aprovado. | Visão geral, Projetos e Produção, incluindo os registros reais de Globo Acabamentos. |
| Criar, ler e atualizar registros reais | Aprovado. | Cliente Globo Acabamentos, projeto de referência e tarefa de referência, preservados para revisão. |

### Cenários de erro e estados de interface validados

| Cenário | Comportamento esperado e confirmado | Evidência |
|---|---|---|
| URL malformada | A validação recusa `api.exemplo.com sem protocolo` antes de iniciar a inspeção. | `server/originalApp.test.ts` — 1 caso dedicado. |
| URL insegura ou local | O adaptador recusa HTTP e endereços `localhost`/rede privada. | `server/originalApp.test.ts` — 3 asserções de proteção. |
| Backend indisponível | O painel recebe mensagem controlada de indisponibilidade, sem detalhes internos do erro de rede. | `server/originalApp.test.ts` — simulação de timeout. |
| Dados inválidos | O contrato de clientes rejeita um cadastro que não atende à validação antes de escrever no banco. | `server/routers/workspace.test.ts`. |
| Carregamento | O cartão de Produção exibe **Consultando instância original…** enquanto a leitura está pendente. | `client/src/pages/Production.test.ts`. |
| Estado vazio | O cartão explica que o armazenamento não retornou arquivos, sem ocultar as skills carregadas. | `client/src/pages/Production.test.ts` e `integration-validation.md`. |
| Erro visível | O último erro de conexão é apresentado no cartão de integração sem bloquear a alteração de URL. | `client/src/pages/Production.test.ts`. |

## 13. Limites conhecidos e próximos passos

O repositório original não contém projetos, tarefas, clientes, agenda ou equipes. Por isso, esses dados vivem de forma nativa no banco do novo painel. Atualmente, o espaço de trabalho contém Globo Acabamentos e os dois registros de referência autorizados. Somente as skills e os arquivos de produção são integrados diretamente da instância FastAPI original.

Para amadurecer o sistema, priorize primeiro o cadastro real de clientes, responsáveis e projetos. Depois, vincule arquivos reais gerados pela aplicação FastAPI a cada projeto. Uma possível evolução futura é criar uma experiência explícita de chat no painel para `/api/chat`; isso exigirá definir autenticação, política de uso de IA, tratamento de streaming e uma confirmação clara antes de qualquer chamada que consuma créditos de provedor externo.

## 14. Checklist de manutenção

| Periodicidade | Verificação |
|---|---|
| A cada alteração funcional | Atualizar `todo.md`, testes e este manual se houver impacto operacional. |
| Antes de publicar | Executar testes e checagem de tipos; revisar desktop e mobile; salvar checkpoint. |
| Quando mudar domínio | Testar `/openapi.json`; atualizar a URL em Produção; confirmar skills e arquivos. |
| Quando mudar dados externos | Não inserir chave de IA no painel. Revisar o adaptador e as regras de rede antes de adicionar qualquer endpoint de escrita. |
| Quando ocorrer falha de integração | Verificar URL HTTPS, disponibilidade do Render, contrato OpenAPI, registros do servidor e último erro no cartão de integração. |

---

**Responsável técnico recomendado:** manter este documento junto ao repositório e atualizar a data de versão sempre que a arquitetura, a URL FastAPI, a política de armazenamento ou os fluxos de Projeto/Produção forem alterados.

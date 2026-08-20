# Operação e manutenção — Agência IA

## Propósito operacional

A área **Agência IA** converte um briefing único, sempre vinculado a um cliente existente, em um conjunto de materiais de trabalho. A primeira versão mantém o usuário no controle: a IA produz uma recomendação ou um rascunho, enquanto a equipe registra a aprovação, pede ajustes ou rejeita a versão.

| Etapa | Responsável | Registro persistido | Resultado esperado |
|---|---|---|---|
| Contexto de marca | Operação | Perfil de agência do cliente | Posicionamento, voz, público, oferta, regras de prova e sistema visual |
| Motor de IA | Administrador da conta | Conexão do provedor por cliente | Provedor, modelo, dica de chave e chave cifrada apenas no servidor |
| Briefing | Estratégia | Campanha e briefing de conteúdo | Objetivo, escopo e fatos aprovados |
| Orquestração | IA com revisão humana | Geração, slides, roteiro e decisão | Entregas integradas ou específicas por modo |
| Revisão | Equipe responsável | Versão criativa e decisão de aprovação | Aprovar, solicitar alterações ou rejeitar |

## Configuração de provedores

O fluxo aceita **Manus integrado**, OpenAI, OpenAI compatível, Google Gemini e Anthropic. Para provedores externos, a chave deve ser colada exclusivamente no formulário protegido do cliente. Ela é cifrada antes de ser gravada, jamais retorna à interface e aparece apenas como dica parcial de identificação. O usuário deve cadastrar a própria credencial do cliente e confirmar que está autorizado a usá-la.

> Não inclua chaves de API em briefings, campos de texto, anexos, comentários, commits, capturas de tela ou mensagens de aprovação.

Quando a conexão falhar, verifique primeiro o provedor, o modelo, a URL base e a validade da chave. Em seguida, execute uma nova geração a partir da mesma campanha; a falha fica registrada na geração e a campanha volta para um estado rastreável. Não é necessário apagar o briefing ou o histórico de versões para tentar novamente.

## Modos de criação

| Modo | Entrega | Uso recomendado |
|---|---|---|
| Campanha integrada | Estratégia, anúncios, carrossel, roteiro e conselho | Quando todas as peças compartilham a mesma oferta e objetivo |
| Anúncios | Ângulos, textos e chamadas para ação | Testes de mídia paga ou variações de argumento |
| Carrossel | Narrativa e slides independentes | Conteúdo editorial de feed, com cada slide concebido como arte própria |
| Roteiro de vídeo | Gancho, cenas, locução e plano de edição | Vídeos curtos e produção multimídia posterior |
| Estratégia | Posicionamento, público e lacunas de evidência | Preparação do briefing e validação de hipóteses |
| Conselho IA | Lentes de decisão, recomendação e risco | Discussões de campanha que exigem revisão humana explícita |

O sistema não inventa pesquisas, preços, provas, indicadores ou depoimentos. Quando um dado não foi fornecido ou aprovado no briefing, ele deve ser tratado como lacuna para revisão, e não como fato publicável.

## Revisão e aprovação

Cada geração bem-sucedida cria uma **versão imutável** da campanha. A área **Versões e aprovações** apresenta o tipo de material, o número da versão, o resumo e o estado de revisão. A decisão humana registra um dos três resultados: `approved`, `changes_requested` ou `rejected`.

Uma aprovação não publica automaticamente anúncios, criativos ou campanhas em plataformas externas. Publicação, orçamento, compra de mídia e envio de conteúdo permanecem atividades humanas e requerem aprovação fora desta primeira versão.

## Diagnóstico rápido

| Sintoma | Verificação inicial | Ação segura |
|---|---|---|
| Nenhum cliente no seletor | Cadastro de clientes | Cadastre ou selecione o cliente em Projetos antes de criar a campanha |
| Geração falha | Estado da conexão e briefing | Confirme a conexão e repita sem remover a campanha original |
| Material não aparece na revisão | Campanha selecionada | Escolha **Revisar** na campanha correta e aguarde a consulta de versões |
| Fatos inadequados no rascunho | Briefing e regras de prova | Solicite alterações, corrija os fatos no contexto e gere uma nova versão |
| Chave exposta em texto | Histórico de briefing ou comentário | Revogue a chave no provedor, substitua a conexão e remova o texto exposto conforme a política interna |

## Limites atuais e próximos incrementos

Esta entrega organiza o trabalho da agência, gera texto estruturado, mantém versões e exige decisão humana. A produção visual final de cada slide, a publicação em gerenciadores de anúncios, a importação automática de métricas e a coleta automática de tendências permanecem deliberadamente fora do fluxo automático inicial. Esses incrementos devem ser adicionados somente com conectores, permissões e políticas de revisão explícitas.

## Evidências da entrega

O relatório [`ai-agency-validation.md`](./ai-agency-validation.md) registra a cobertura automatizada, a checagem de tipos, o build de produção e o estado da primeira execução real. Enquanto não houver uma credencial autorizada e um briefing aprovado, nenhuma geração é executada; esse comportamento é uma proteção operacional, e não uma falha silenciosa.

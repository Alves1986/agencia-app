# Especificação de produto — Agência de anúncios com IA

## Origem e objetivo

Esta especificação consolida o direcionamento fornecido pelo usuário em `pasted_content.txt`, `maquina-carrosseis-gpt.txt` e `SKILL.md`, recebidos em 20/08/2026. O sistema deve evoluir de um painel operacional para uma plataforma de criação e gestão de anúncios com IA. Cada operação começa pela seleção de um cliente já cadastrado, usa o contexto persistente desse cliente e permite gerar anúncios, artes editoriais ou ambos, no mesmo fluxo ou separadamente.

## Fluxo estratégico de anúncios

| Etapa | Entrada principal | Resultado persistente | Dependência seguinte |
|---|---|---|---|
| Marca | Oferta, público, posicionamento, objetivo e ticket | Documento de marca: voz, promessa, provas e objeções | Pesquisa |
| Pesquisa | Documento de marca e fontes verificáveis | Concorrentes, dores, saturação, lacunas e incertezas sinalizadas | Ângulos |
| Ângulos | Pesquisa aprovada | Oito ângulos distintos, com gancho, dor/desejo, prova, objeção e potencial | Roteiros |
| Roteiros | Três melhores ângulos | Roteiros faláveis com gancho, problema, solução, benefício, prova e CTA | Criativos |
| Criativos | Roteiros aprovados | Conceitos de peça, variações, UGC e direções visuais | Teste |
| Teste | Verba e conjunto de peças | Plano de rodada, métricas de corte e critérios de pausa/escala | Vencedores |
| Vencedores | Métricas reais por criativo | Decisão de manter, pausar, escalar e aprendizado reutilizável | Nova rodada de ângulos |

O sistema deve manter cada saída como versão auditável, preservar lacunas de evidência como pendências explícitas e nunca apresentar como fato dados ou conclusões que não tenham fonte suficiente.

## Experiência guiada

O fluxo inicial deve pedir somente as decisões que mudam a execução: cliente, objetivo, provedor, modelo, modo de entrega (`anúncios`, `artes editoriais` ou `ambos`) e o briefing necessário à etapa selecionada. A interface deve permitir gerar os dois artefatos em sequência ou abrir cada um de modo independente para o mesmo cliente e campanha.

As chaves de API coladas pelos usuários devem ser tratadas exclusivamente no servidor. A interface nunca deve exibir, reenviar ou persistir a chave em texto legível. A implementação deve preferir referências de credencial por cliente, escopo de geração, estado de validação e data de rotação; a chave criptografada deve permanecer fora dos retornos tRPC e dos logs.

## Módulo de artes editoriais para Instagram

O construtor de artes deve aceitar conteúdo existente ou insight, solicitar marca, identificador social, nicho, cor, estilo, tipo de narrativa, CTA, quantidade de peças e presença de imagem. O fluxo editorial gera triagem, dez headlines, espinha narrativa, texto por peça, direção visual, geração e legenda.

Cada imagem final é uma arte editorial vertical independente em **1080×1350**, produzida uma por vez. A geração visual deve receber apenas o texto e a direção da peça atual; não deve pedir composição múltipla, prévia, grade, mosaico, storyboard ou instruções de continuidade. A consistência entre artes deve vir da repetição de atributos objetivos — paleta, tipografia, tom, composição e regras de marca — e não de uma instrução de sequência.

O módulo deve bloquear clichês, alegações sem fontes e informações inventadas. Quando faltar evidência, deve manter marcadores como `[ADICIONAR DADO REAL]`, `[INSERIR CASO REAL]` ou `[FONTE PENDENTE]`, em vez de inventar números, casos, citações ou resultados. A legenda usa o CTA definido, de cinco a doze hashtags específicas do nicho e evita hashtags genéricas/motivacionais.

## Decisões de arquitetura iniciais

| Área | Decisão inicial | Motivo |
|---|---|---|
| Isolamento | Todo recurso é filtrado por usuário operacional e cliente | Mantém o padrão atual de propriedade e reduz vazamento entre contas |
| Provedores | Catálogo explícito com adaptadores de texto e imagem | Evita acoplamento a um único SDK e permite seleção clara |
| Segredos | Credenciais por cliente cifradas no servidor, nunca retornadas à UI | Preserva confidencialidade e facilita rotação/revogação |
| Geração | Jobs com entrada, saída estruturada, status, erro e versão | Permite retomada, aprovação e auditoria |
| Qualidade | Saída estruturada + validações determinísticas antes de aprovar | Evita textos soltos e claims sem suporte |
| Operação | Campanhas conectam briefings, anúncios, artes, testes e aprendizados | Mantém a geração ligada ao trabalho real da agência |

## Interfaces externas confirmadas

O adaptador inicial deve normalizar o conceito de instrução de sistema, entrada de usuário, modelo, saída e erro, sem assumir que todos os provedores possuem o mesmo endpoint ou formato de request. A documentação oficial da OpenAI descreve a criação de chat completions com mensagens e uma lista de escolhas de saída. A documentação do Gemini apresenta a API `interactions`, com `model`, `input`, `system_instruction` e configuração de geração; também registra suporte multimodal e streaming. A página extraída de Anthropic não forneceu o contrato técnico completo por renderização dinâmica, portanto o adaptador Anthropic só deve ser ativado após uma consulta específica e atualizada de sua referência oficial.

| Provedor | Interface confirmada | Tratamento na primeira versão |
|---|---|---|
| OpenAI | Chat Completions com mensagens e escolhas | Adaptador de texto; imagem pode usar o serviço interno inicialmente |
| Google Gemini | Interactions com entrada, instrução de sistema e configuração de geração | Adaptador de texto com normalização de resposta |
| Anthropic | Referência oficial acessada, mas conteúdo técnico não extraído | Cadastro previsto; ativação posterior condicionada à validação do contrato |

**Fontes consultadas:** [OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat/create), [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) e [Gemini text generation](https://ai.google.dev/gemini-api/docs/text-generation), consultadas em 20/08/2026.

## Fontes internas recebidas

1. `/home/ubuntu/upload/pasted_content.txt` — fluxo estratégico de anúncios em sete etapas.
2. `/home/ubuntu/upload/maquina-carrosseis-gpt.txt` — máquina editorial de artes independentes e regras de geração visual.
3. `/home/ubuntu/upload/SKILL.md` — skill de carrosséis com filtro editorial, design system, render e caption.

## Ampliação: agência integrada por cliente

O módulo de anúncios passa a ser o núcleo de uma **esteira de agência**, e não uma ferramenta isolada. Cada campanha parte de um cliente cadastrado e de um único briefing; os módulos especializados trabalham sobre esse mesmo contexto e devolvem versões revisáveis, sem publicar, comprar mídia ou coletar dados externos por conta própria.

| Frente | Entrada comum | Entrega versionada | Estado inicial |
|---|---|---|---|
| Estratégia e conselho | Objetivo, restrições, oferta e público | alternativas, recomendação, riscos e decisão humana | Implementar agora |
| Anúncios e carrossel | Direção aprovada, tom e canais | variações de copy, CTA, estrutura de slides e prompts visuais | Implementar agora |
| Conteúdo e vídeo | Tema ou sinal selecionado | roteiro, cenas, prompts e checklist de edição | Implementar agora, sem renderização automática |
| Tendências | Links, notas ou dados trazidos pelo usuário | sinais normalizados, hipótese e score revisável | Implementar como registro manual; conectores exigem autorização própria |
| Departamentos de agência | Contexto do cliente e campanha | recomendações de estratégia, marketing, vendas e operações | Implementar como perfis de trabalho e assistentes de briefing |

O conselho de IA terá as lentes de **lógica, estratégia, primeiros princípios, ética, pensamento sistêmico e filosofia**, seguidas de uma síntese com recomendação e principal risco. Ele será reservado a decisões de maior impacto e sempre terá estado de revisão humana.

O fluxo de vídeo seguirá a sequência **sinal → filtro de reação → roteiro → cenas e prompts visuais → ativos → plano de edição → revisão**. A primeira versão não fará scraping, postagem automática ou renderização de vídeo. Isso evita transformar referências de tendência em dados inventados e mantém a curadoria do usuário como etapa de aprovação.

Os “departamentos” serão capacidades reutilizáveis, começando por **estratégia, marketing, conteúdo, vendas e operações**. Financeiro e jurídico poderão organizar informações, mas não oferecerão aconselhamento profissional, decisões fiscais ou revisão jurídica definitiva.

### Princípios operacionais

1. **Um cliente, um contexto compartilhado:** todos os artefatos de uma campanha usam o mesmo briefing, tom, oferta e objetivos.
2. **Uma etapa por vez:** cada módulo produz uma saída persistida e aprovada antes de alimentar a próxima, evitando automação opaca.
3. **Provedor intercambiável, dados protegidos:** a chave do cliente permanece criptografada no servidor e nunca retorna para o navegador ou registros de geração.
4. **Revisão antes de ação externa:** a agência cria recomendações e ativos; publicar, comprar mídia, enviar mensagens ou coletar redes dependerá de autorização e integração específicas.

## Referências adicionais recebidas

4. `/home/ubuntu/upload/pasted_content_2.txt` — blueprint de tendência, roteiro, ativos e revisão de vídeo.
5. `/home/ubuntu/upload/pasted_content_3.txt` — organização de capacidades por equipes/departamentos.
6. `/home/ubuntu/upload/pasted_content_4.txt` — conselho de IA para decisões com síntese e risco.
7. `/home/ubuntu/upload/pasted_content_5.txt` — copilotos por área e orientação de operação gradual.

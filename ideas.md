# Direção de design — Agência

## Três direções consideradas

| Tema | Breve introdução | Probabilidade |
|---|---|---:|
| **Radar de Estúdio** | Um painel de operações com energia editorial: grandes marcos tipográficos, dados em camadas e um sistema cromático que transforma prioridades em sinalização visual. | 0,07 |
| **Bauhaus de Bolso** | Uma linguagem modular e construtiva, com blocos geométricos, proporções rígidas e alto contraste para tornar o trabalho da agência tangível. | 0,04 |
| **Arquivo Vivo** | Um espaço quase museológico, com navegação silenciosa e detalhes de catalogação para dar centralidade à memória criativa e aos projetos. | 0,09 |

---

## Direção escolhida: Radar de Estúdio

**Design movement.** O projeto combina **editorial contemporâneo** e **sinalização operacional**. A interface deve lembrar a parede de planejamento de um estúdio criativo de alto ritmo — não um software corporativo genérico — onde tipografia, tempo e cor tornam a próxima decisão evidente.

**Cena física.** Uma diretora de atendimento abre o painel numa manhã luminosa, entre conversas com clientes e revisões de campanha. Ela precisa enxergar o que está em movimento, o que exige resposta e onde há espaço para avançar, sem ser recebida por uma parede de cartões ou números frios.

### Princípios centrais

1. **A prioridade tem presença.** A informação mais crítica usa escala, composição e contraste, em vez de depender apenas de badges ou cores de alerta.
2. **A página tem ritmo.** Grandes respiros, faixas horizontais e agrupamentos assimétricos orientam a leitura do resumo para a ação concreta.
3. **Dados precisam parecer vivos.** Progresso, agenda e fluxo de trabalho usam marcas visuais, movimento discreto e linguagem humana, sem simular métricas vazias.
4. **A interface é uma ferramenta de direção.** Menos superfícies decorativas; mais hierarquia, atalhos e estados que ajudam uma equipe a decidir o próximo passo.

### Filosofia de cor

A base será um **branco frio azulado** para preservar luz e foco, com tinta azul-petróleo profunda para autoridade e leitura contínua. A cor proprietária é **Laranja Sinal** — um laranja vibrante, mas levemente terroso, reservado para impulso, chamadas e destaque de progresso. Um verde ácido pontual informa saúde e conclusão sem recorrer ao padrão corporativo azul/roxo.

| Papel | Token sugerido | Intenção |
|---|---|---|
| Plano de fundo | `oklch(0.975 0.006 230)` | Luz de estúdio, sem cair em bege ou creme. |
| Tinta | `oklch(0.21 0.035 240)` | Leitura firme, sofisticada e estável. |
| **Laranja Sinal** | `oklch(0.68 0.19 48)` | Próxima ação, avanço e identidade própria. |
| Verde de ritmo | `oklch(0.76 0.16 145)` | Progresso saudável e conclusão. |
| Lilás técnico | `oklch(0.70 0.10 300)` | Contexto analítico e elementos secundários. |

### Paradigma de layout

A estrutura é uma **redação de controle**, não uma grade de cards. Uma barra lateral escura fixa sustenta o produto; o conteúdo nasce de uma faixa editorial de boas-vindas e se quebra em uma coluna de foco e outra de ritmo. A coluna de foco contém o projeto de maior pressão e uma leitura de entrega; a coluna de ritmo organiza agenda, conversas e movimentações. Em telas menores, a navegação vira trilho horizontal e os blocos se reorganizam por prioridade.

### Elementos de assinatura

1. **Marca de pulso.** Linhas curtas e pontos em sequência — como um radar ou timeline compacta — aparecem em gráficos, tabs e indicadores de prazo.
2. **Bloco de foco recortado.** O item prioritário usa uma grande superfície de cor e uma composição em duas escalas, nunca um cartão idêntico aos demais.
3. **Régua de produção.** Datas e estados usam uma linha de calendário com marcadores circulares, combinando planejamento editorial e gestão ágil.

### Filosofia de interação

Cada ação deve confirmar intenção sem ruído. Os controles principais respondem em até 160 ms com compressão sutil; painéis secundários entram como camadas laterais; mudanças de filtro trocam conteúdo por dissolução curta, preservando o contexto visual. Links de navegação ainda não implementados mostram uma confirmação clara de que o fluxo será conectado em seguida.

### Animação

Entradas são discretas e sequenciais: o cabeçalho aparece primeiro; o bloco de foco e a coluna de ritmo surgem depois em deslocamento vertical de até 12 px e opacidade. O pulso de produção percorre a régua uma única vez na chegada da página. Nada fica oculto se animação estiver desligada. Todos os movimentos respeitam `prefers-reduced-motion`, com transições instantâneas ou crossfade.

### Sistema tipográfico

**Space Grotesk** será a fonte de interface e títulos, com pesos 500–700 para dar direção geométrica. **Newsreader** será usada apenas em poucas frases de contexto, métricas de destaque e micro-mensagens, acrescentando tensão editorial sem comprometer a rapidez de leitura. Títulos usam espaçamento levemente negativo, mas nunca menor que `-0.04em`; textos corridos limitam-se a 70 caracteres por linha e mantêm contraste AA.

### Essência de marca

**Agência é o centro de comando criativo para equipes que precisam transformar demandas dispersas em entregas com ritmo e clareza.**

Personalidade: **direta, criativa e confiável**.

### Voz da marca

A voz é objetiva, calorosa e orientada à próxima decisão. Títulos evitam promessas genéricas; CTAs descrevem o que acontecerá.

> “A campanha da semana já tem direção. Falta ajustar o ritmo.”

> “Abrir plano de produção”

### Wordmark e logo

O símbolo é uma **rampa circular interrompida por três pulsos**, sugerindo radar, avanço e coordenação. Não usa texto dentro da imagem. No produto, ele aparece ao lado do wordmark em Space Grotesk; o ícone permanece reconhecível sozinho no favicon, no menu e em estados compactos.

### Cor de assinatura

**Laranja Sinal** — `oklch(0.68 0.19 48)` — é a marca visual inconfundível do produto e só deve ser usada quando for preciso chamar uma decisão para a frente.

## Style Decisions

- **Tipografia operacional:** Space Grotesk lidera títulos, comandos e chamadas de prioridade. Newsreader fica limitada a acentos editoriais breves e métricas especiais.
- **Espinha de produto:** a navegação lateral azul-petróleo, com símbolo e wordmark, é o eixo de comando persistente em desktop; o símbolo reaparece no cabeçalho em layouts compactos.
- **Pulso proprietário:** grupos de três barras e réguas tracejadas atravessam estados de prioridade, progresso, agenda e leitura de ritmo. O Laranja Sinal aparece apenas na próxima decisão ou em estados que exigem atenção.
- **Agrupamento:** módulos de apoio usam faixas e linhas de produção, não caixas intercambiáveis; o bloco de foco é a exceção deliberadamente mais densa e recortada.

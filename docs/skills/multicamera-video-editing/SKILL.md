---
name: multicamera-video-editing
description: Transforme um vídeo-base de pessoa falando em uma edição multicâmera com IA, preservando performance, voz, timing, lip sync e continuidade. Use quando o usuário quiser criar variações de câmera, cortes motivados pela fala, planos cinematográficos ou uma edição de oito câmeras a partir de um único take.
---

# Edição multicâmera a partir de um único vídeo

## Objetivo

Transforme **a cinematografia**, não a performance. Trate o vídeo-base como uma atuação contínua filmada por várias câmeras simultâneas: diálogo, áudio, voz, gestos, roupa, objetos, cenário e cronologia devem permanecer os mesmos.

## Fluxo obrigatório

1. Solicite o vídeo-base e confirme duração, proporção, resolução de entrega, idioma e canal de publicação.
2. Analise duração, FPS, enquadramento, cenário, roupa, acessórios, objetos e ações de mão. Transcreva a fala com timestamps quando o áudio estiver presente.
3. Monte uma tabela com `intervalo`, `fala/gatilho`, `ação em cena` e `movimento de câmera`. Não crie lacunas nem sobreposições entre os planos.
4. Escolha de quatro a oito planos com progressão clara. Consulte `references/shot-playbook.md` quando a solicitação pedir uma versão em oito câmeras.
5. Preencha `templates/video-edit-prompt.md` em inglês com os fatos observados. Mantenha os campos entre chaves somente até possuir evidência no vídeo ou confirmação do usuário.
6. Antes de acionar qualquer serviço pago de geração, apresente resolução, duração, estimativa de créditos/custo e peças que serão geradas. Aguarde aprovação explícita.
7. Faça pré-voo da saída: confira identidade, sincronia labial nos planos de rosto, continuidade do áudio, cronologia dos gestos e preservação dos objetos.

## Regras de continuidade

- Preserve a fala, voz, ritmo, expressões, gestos e interações do vídeo original.
- Mantenha o áudio original contínuo em todos os cortes; nunca reinicie a locução ou a atuação.
- Descreva apenas o que foi observado no vídeo ou confirmado pelo usuário. Pergunte quando objetos, roupas ou cenário não forem identificáveis.
- Use cortes secos entre planos, salvo instrução contrária. Não use morphs, transições que alterem a pessoa, falas novas, música adicionada, legendas automáticas ou substituição de voz sem pedido explícito.
- Quando o rosto aparecer, priorize a conferência de identidade e lip sync. Use inserts de mãos/objeto como alternativa caso um close facial não fique confiável.

## Direção dos planos

Ancore movimentos em palavras, gestos ou mudanças reais de ideia. A câmera pode reforçar a fala: recuar quando a pessoa disser que algo se afasta, orbitar numa explicação de volta, subir numa referência a visão de cima. Não force metáforas visuais que não estejam na performance.

Mantenha o ritmo legível: comece calmo, varie ângulos com propósito, use um plano de detalhe, passe por um olhar observacional e encerre abrindo o quadro. Evite movimentos rápidos, excesso de câmera na mão e cortes sem motivo narrativo.

## Saída esperada

Entregue, antes da geração:

| Entrega | Conteúdo |
|---|---|
| Diagnóstico | Duração, resolução, FPS, cenário e riscos de continuidade |
| Mapa de edição | Tabela com planos, intervalos, gatilhos e movimentos |
| Prompt | Prompt em inglês preenchido e pronto para o editor de vídeo escolhido |
| Pré-voo comercial | Serviço, formato, custo/créditos estimados e solicitação de aprovação |

Após a geração, informe arquivos resultantes, resolução, duração e itens que exigem revisão humana.

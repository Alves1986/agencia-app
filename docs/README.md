# Documentação do sistema Agência

Esta pasta concentra os materiais necessários para operar, manter e evoluir o painel **Agência** sem depender de conhecimento tácito. O manual principal descreve arquitetura, navegação, dados, segurança, integração FastAPI, manutenção de domínio e validações realizadas. O registro de integração preserva as evidências da conexão com o backend original publicado.

| Material | Finalidade |
|---|---|
| [Manual operacional](./manual-operacional.md) | Referência funcional e técnica do painel, incluindo o fluxo de Projetos, Produção, filtros, notificações e manutenção. |
| [Validação da integração](./integration-validation.md) | Resultado da conexão com o FastAPI, skills recebidas, estado atual dos arquivos e próximos testes. |
| [Skill multicâmera](./skills/multicamera-video-editing/SKILL.md) | Processo reutilizável de edição multicâmera, continuidade e aprovação antes de geração. |

> As capturas do manual usam ativos persistentes do projeto para não duplicar mídia dentro do repositório. O arquivo `agencia-system-documentation.zip`, entregue junto desta versão, reúne a mesma documentação com todas as imagens para arquivamento ou compartilhamento offline.

## Atualização futura

Sempre que houver uma alteração em rotas, integração, domínio, dados operacionais ou fluxo de trabalho, atualize primeiro o manual correspondente, execute os testes relacionados e salve um checkpoint antes de publicar ou sincronizar uma nova versão.


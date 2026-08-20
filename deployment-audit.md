# Auditoria das instâncias publicadas

**Verificação em 20 de agosto de 2026.**

| Componente | URL | Estado observado | Integração prevista |
|---|---|---|---|
| Interface original | https://agencia-app-dun.vercel.app/ | Disponível. Mostra os módulos **Agência de Anúncios** (sete etapas) e **Máquina de Carrosséis**; ainda indica operação local e configuração de chave de IA. | Referência de produto e futura mudança de domínio/nome. |
| Backend original | https://agencia-app-backend.onrender.com/ | Disponível. A raiz serve a interface original e o contrato OpenAPI foi confirmado. | Fonte para as rotas FastAPI de skills e arquivos de produção. |

## Contrato FastAPI confirmado

| Rota | Método | Uso no painel | Tratamento |
|---|---:|---|---|
| `/api/skills` | GET | Sincronizar skills disponíveis. | Consumir como leitura. |
| `/api/storage/list` | GET | Listar arquivos gerados salvos. | Consumir como leitura. |
| `/api/storage/{filename}` | GET | Abrir um arquivo específico. | Validar nome de arquivo e exibir link/visualização. |
| `/api/chat` e `/api/chat/stream` | POST | Execução conversacional da aplicação original. | Não integrar automaticamente sem experiência e autorização específicas. |
| `/api/config` | GET/POST | Ler ou atualizar configuração de provedor de IA. | **Não enviar nem espelhar chaves de IA no novo painel.** |
| `/api/storage/save` | POST | Salvar arquivo no backend original. | Não acionar sem intenção explícita do usuário. |

## Próxima integração

Conectar exclusivamente as rotas de leitura para skills e arquivos. Preservar o bloqueio de rede privada, o bloqueio de redirecionamentos e a validação de URL já existentes no adaptador do painel. A futura troca de nome ou domínio exigirá atualizar a URL base da conexão em **Integrações**, sem modificar o contrato FastAPI.

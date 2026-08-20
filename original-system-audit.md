# Auditoria do sistema original

Fonte analisada: <https://github.com/Alves1986/agencia-app> — commit público `c504e8a` (consultado em 19 de agosto de 2026).

## Arquitetura encontrada

O sistema original é uma aplicação local de **agência de anúncios com IA**, composta por FastAPI em `app/main.py` e uma interface estática em `frontend/`. Não há banco de dados, modelos de projetos, tarefas, clientes, equipes ou agenda no repositório. A persistência disponível é baseada em arquivos de texto no diretório local `app/storage/`; o arquivo `config.json`, também local, retém provedor, modelo e chave de API.

| Recurso existente | Rotas reais | Uso possível no novo painel |
|---|---|---|
| Configuração de IA | `GET/POST /api/config` | Exibir estado do provedor, mas não a chave. |
| Skills de criação | `GET /api/skills` | Mostrar módulos e iniciar fluxos de produção. |
| Conversa com IA | `POST /api/chat` e `POST /api/chat/stream` | Abrir um fluxo de execução para tarefas criativas. |
| Arquivos gerados | `GET /api/storage/list`, `GET /api/storage/{filename}`, `POST /api/storage/save` | Converter arquivos salvos em entregas anexas aos projetos. |

## Conclusão para integração

O repositório público contém a aplicação, mas **não contém dados reais de gestão** — eles ficam no computador ou no servidor em que a pessoa executa o FastAPI. Portanto, o novo painel pode integrar os fluxos reais de IA e os arquivos de produção por meio de uma URL de backend configurável, mas clientes, projetos, tarefas e agenda precisam ser introduzidos no novo banco ou importados da instância onde hoje residem.

O adaptador deverá tratar a URL do backend como configuração de workspace e ler apenas as rotas públicas existentes. A chave de API do provedor não será transferida nem exibida no novo painel.

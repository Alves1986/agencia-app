# Implantação do painel na Vercel

O painel é uma aplicação **Vite + React** com rotas de API tRPC, OAuth e proxy de armazenamento em Express. O repositório inclui `vercel.json` com `framework: "vite"`, `pnpm build` como comando de build e `dist/public` como diretório de saída. Essa configuração versionada evita que uma configuração antiga do projeto seja interpretada como FastAPI.

As funções em `api/index.ts` e `api/[...path].ts` exportam a mesma aplicação Express criada por `server/app.ts`. A rota curinga preserva o caminho original de requisições como `/api/trpc/*` e `/api/oauth/callback`, que dependem das rotas expressas registradas pela aplicação.

Antes de uma nova implantação, confirme que as variáveis de ambiente necessárias pelo servidor — em especial banco de dados, segredos de sessão e OAuth — estão configuradas no projeto Vercel. A configuração local de desenvolvimento não deve ser copiada para o repositório.

## Validação local

```bash
pnpm test
pnpm check
pnpm build
```

## Referências

- [Configuração `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json)
- [Atualização de preset e comandos de projeto](https://vercel.com/docs/cli/project)
- [Funções Node.js na Vercel](https://vercel.com/docs/functions)

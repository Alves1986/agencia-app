# Evidências de validação — Agência IA

## Resultado do ciclo de validação

A primeira entrega da Agência IA foi validada por testes de contrato, verificação de tipos e build de produção. A suíte concluiu com **29 testes aprovados** em 12 arquivos, incluindo a geração integrada, persistência de versão, decisões humanas de aprovação, renderização dos modos de criação e proteção da resposta pública de conexões.

| Evidência | Resultado | Escopo protegido |
|---|---|---|
| Geração integrada | Aprovada por teste de contrato | Estratégia, anúncios, carrossel e roteiro são serializados em uma versão da campanha |
| Carrossel | Aprovado por teste de contrato | Os slides estruturados são persistidos com geração e campanha correspondentes |
| Revisão humana | Aprovada por teste de contrato | Uma decisão `approved`, `changes_requested` ou `rejected` é registrada no histórico da versão |
| Segredos | Aprovado por teste de contrato | Campos como chave cifrada, chave simples ou segredo interno são removidos da resposta pública |
| Compilação | Aprovada | Checagem TypeScript sem erros e build Vite/servidor concluído |

## Estado da execução real

Foi consultado o estado da tabela de conexões sem selecionar campos de chave. Não havia conexão de IA configurada para cliente algum no momento da validação. Por isso, **nenhuma geração real foi disparada**: não existe briefing de campanha autorizado nem credencial de provedor cadastrada para uso do cliente.

> O bloqueio é deliberado: uma execução real somente deve ocorrer depois que a equipe selecionar o cliente, criar um briefing com fatos aprovados e cadastrar uma conexão válida que tenha autorização de uso.

Para realizar a primeira execução real, abra **Agência IA**, selecione o cliente, registre o contexto de marca, cadastre o provedor no bloco **Motor de IA**, crie a campanha e use **Gerar**. A saída será gravada como uma nova versão e deverá ser aprovada, ajustada ou rejeitada pela fila de revisão humana.

# Validação da integração publicada — Agência

**Data:** 20 de agosto de 2026  
**Instância FastAPI:** `https://agencia-app-backend.onrender.com`

## Objetivo

Confirmar que o painel operacional pode verificar e persistir a conexão com a aplicação FastAPI publicada, listar suas skills e apresentar corretamente o estado atual de arquivos de produção.

## Fluxo validado

Foi acionado o procedimento autenticado `originalApp.testAndSave`, o mesmo contrato usado pelo botão **Conectar/Atualizar** do cartão **Aplicação original** na página **Produção**. A resposta real foi:

```json
{
  "configured": false,
  "skills": [
    "Agencia de Anuncios (7 Etapas)",
    "Maquina de Carrosseis"
  ],
  "files": [
    ".gitkeep"
  ]
}
```

## Conferência visual

A página `/producao` foi capturada após a integração. O cartão exibiu o estado **Instância conectada**, o botão **Atualizar**, as duas skills retornadas e o item `.gitkeep`. Como `.gitkeep` é apenas o arquivo de manutenção do diretório, não existe no momento um artefato de produção útil para selecionar e vincular a um projeto.

## Resultado

| Item | Resultado |
|---|---|
| URL HTTPS aceita e persistida | Aprovado |
| Inspeção real do backend | Aprovado |
| Skills carregadas no painel | Aprovado |
| Estado sem arquivo útil | Aprovado |
| Vínculo de artefato real a projeto | Pendente de um arquivo real ser gerado pela aplicação original |

## Próxima verificação necessária

Quando a aplicação FastAPI gerar um arquivo real, abra **Produção**, selecione o arquivo no cartão de integração, escolha um projeto e confirme o vínculo. Atualize este documento com o nome do arquivo e o projeto de destino após a validação.

## Validação com dado real cadastrado

Em 20 de agosto de 2026, o contrato autenticado `workspace.createClient` cadastrou o cliente **Globo Acabamentos** no espaço de trabalho administrador. A leitura subsequente pelo contrato `workspace.clients` confirmou o registro ativo com identificador `1`. Em seguida, a página `/projetos` foi recarregada: o bloco **Primeira configuração** deixou de ser exibido, comportamento que só ocorre quando a consulta de clientes devolve ao menos um registro. Não foram criados projetos, tarefas ou eventos adicionais sem solicitação do responsável.

## Caminhos de erro cobertos

Os testes automatizados confirmam que o adaptador recusa URL malformada, URL sem HTTPS e destinos locais antes de realizar chamadas externas. Uma indisponibilidade controlada do backend também retorna mensagem segura. Na interface, o cartão de integração cobre de forma explícita os estados de carregamento, erro de conexão e armazenamento vazio; no último caso, as skills retornadas continuam visíveis, enquanto a mensagem informa que não há artefatos disponíveis para vínculo. O contrato de clientes também rejeita dados inválidos antes de qualquer escrita persistente.

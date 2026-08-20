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

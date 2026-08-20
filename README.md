# Agencia de Anuncios — AI Local

Aplicativo local que faz o trabalho de uma agencia de anuncios completa usando AI. Seus dados e API keys ficam 100% no seu computador.

## Modulos

### 1. Agencia de Anuncios (7 Etapas)
- **Marca:** Aprende sua oferta, publico e posicionamento
- **Pesquisa:** Estuda mercado e concorrentes
- **Angulos:** Acha os ganchos que vendem
- **Roteiros:** Cria anuncios completos
- **Criativos:** Gera pecas e variacoes
- **Teste:** Monta plano com metodo
- **Vencedores:** Analisa o que converteu

### 2. Maquina de Carrosseis
- Gera carrossel Instagram 1080x1350
- 10 headlines validadas
- Render HTML + PNGs
- Caption pronta

## Como Rodar

### Windows
1. Duplo clique em `start.bat`
2. Abra http://localhost:8000

### Mac/Linux
1. Execute `chmod +x start.sh && ./start.sh`
2. Abra http://localhost:8000

### Manual
```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Configuracao

1. Clique em "Configuracao" no app
2. Escolha o provedor (OpenAI, Anthropic, Google, DeepSeek, Groq)
3. Cole sua API key
4. Pronto — tudo roda local

## Provedores Suportados

| Provedor | Modelos |
|----------|---------|
| OpenAI | gpt-4o, gpt-4o-mini, gpt-4-turbo |
| Anthropic | claude-sonnet-4, claude-3.5-haiku |
| Google | gemini-2.0-flash, gemini-1.5-pro |
| DeepSeek | deepseek-chat, deepseek-coder |
| Groq | llama-3.3-70b, mixtral-8x7b |

## Seguranca

- API keys ficam salvas em `config.json` local
- Nenhum dado e enviado pra nuvem (exceto a chamada a API do provedor)
- Todo material gerado fica em `app/storage/`
- Sem analytics, sem telemetria

## Estrutura

```
agencia-app/
├── app/
│   ├── main.py          # Servidor FastAPI
│   ├── providers/       # 5 provedores de AI
│   ├── skills/          # Prompts das skills
│   └── storage/         # Arquivos salvos
├── frontend/            # Interface chat
├── config.json          # API keys (local)
├── requirements.txt     # Dependencias
├── start.bat           # Iniciar (Windows)
├── start.sh            # Iniciar (Mac/Linux)
├── render.yaml         # Deploy backend (Render)
└── vercel.json         # Deploy frontend (Vercel)
```

## Deploy na Nuvem (Vercel + Render)

### Backend no Render (gratuito)

1. Acesse [render.com](https://render.com) e crie conta
2. Clique "New" → "Web Service"
3. Conecte seu repositorio GitHub
4. Configure:
   - **Name:** agencia-app-backend
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Clique "Create Web Service"
6. Anote a URL (ex: `https://agencia-app-backend.onrender.com`)

### Frontend no Vercel (gratuito)

1. Acesse [vercel.com](https://vercel.com) e crie conta
2. Clique "Add New" → "Project"
3. Conecte seu repositorio GitHub
4. Configure:
   - **Framework Preset:** Other
   - **Build Command:** (deixe vazio)
   - **Output Directory:** `frontend`
5. Adicione variavel de ambiente:
   - **Name:** `API_URL`
   - **Value:** URL do backend no Render
6. Clique "Deploy"

### Configurar o Backend

Depois do deploy, acesse o backend e configure:
- Acesse `https://seu-backend.onrender.com`
- Clique em "Configuracao"
- Escolha o provedor e cole sua API key

**Importante:** No modo nuvem, a API key fica salva no servidor (Render). Para mais seguranca, use variaveis de ambiente no Render.

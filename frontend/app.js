let currentSkill = 'agencia';
let chatHistory = [];
let isStreaming = false;

// API URL — detecta automaticamente
// Em producao, defina a variavel: window.API_URL = 'https://seu-backend.onrender.com'
const API_URL = window.API_URL || '';

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadFiles();
    autoResize(document.getElementById('chat-input'));
});

// Config
async function loadConfig() {
    try {
        const resp = await fetch(`${API_URL}/api/config`);
        const config = await resp.json();

        if (config.has_key) {
            document.querySelector('.provider-status').innerHTML =
                `<span class="dot online"></span><span>${config.providers[config.provider] || config.provider}</span>`;
        }

        const select = document.getElementById('cfg-provider');
        for (const [key, name] of Object.entries(config.providers)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = name;
            if (key === config.provider) opt.selected = true;
            select.appendChild(opt);
        }

        if (config.provider) updateModels(config.provider);
    } catch (e) {
        console.error('Erro ao carregar config:', e);
    }
}

function openConfig() {
    document.getElementById('config-modal').classList.add('active');
}

function closeConfig(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('config-modal').classList.remove('active');
}

function toggleKeyVisibility() {
    const input = document.getElementById('cfg-key');
    const btn = document.querySelector('.toggle-key');
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        btn.textContent = 'Mostrar';
    }
}

function updateModels(provider) {
    const models = {
        openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        anthropic: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
        google: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        deepseek: ['deepseek-chat', 'deepseek-coder'],
        groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    };

    const select = document.getElementById('cfg-model');
    select.innerHTML = '<option value="">Modelo padrao do provedor</option>';

    const provider = document.getElementById('cfg-provider').value;
    if (models[provider]) {
        models[provider].forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            select.appendChild(opt);
        });
    }
}

async function saveConfig() {
    const provider = document.getElementById('cfg-provider').value;
    const key = document.getElementById('cfg-key').value;
    const model = document.getElementById('cfg-model').value;

    if (!provider) {
        alert('Selecione um provedor');
        return;
    }

    if (!key) {
        alert('Cole sua API key');
        return;
    }

    try {
        await fetch(`${API_URL}/api/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, api_key: key, model }),
        });

        document.querySelector('.provider-status').innerHTML =
            `<span class="dot online"></span><span>${document.getElementById('cfg-provider').selectedOptions[0].textContent}</span>`;

        closeConfig();
    } catch (e) {
        alert('Erro ao salvar configuracao');
    }
}

// Skills
function selectSkill(skill) {
    currentSkill = skill;
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.skill === skill);
    });

    const titles = {
        agencia: ['Agencia de Anuncios', '7 etapas de campanha completa'],
        carrosseis: ['Maquina de Carrosseis', 'Instagram 1080x1350 sem cara de IA'],
    };

    document.getElementById('chat-title').textContent = titles[skill][0];
    document.getElementById('chat-subtitle').textContent = titles[skill][1];

    // Reset chat
    chatHistory = [];
    document.getElementById('chat-messages').innerHTML = '';
    addWelcomeMessage(skill);
}

function addWelcomeMessage(skill) {
    const messages = {
        agencia: {
            icon: 'Megafone',
            title: 'Agencia de Anuncios com AI',
            text: 'Sistema completo de criacao de campanhas em 7 etapas. A AI vai conduzir todo o processo — voce so precisa responder as perguntas sobre seu negocio.',
            tips: [
                ['Etapa 1: Marca', 'Aprende sua oferta, publico e posicionamento'],
                ['Etapa 2-6: Criacao', 'Pesquisa, angulos, roteiros, criativos e teste'],
                ['Etapa 7: Resultados', 'Analisa o que converteu e otimiza'],
            ],
        },
        carrosseis: {
            icon: 'Imagens',
            title: 'Maquina de Carrosseis',
            text: 'Gera carrossel Instagram 1080x1350 editorial sem cara de IA. Com 10 headlines validadas, render HTML e caption.',
            tips: [
                ['Modo 1', 'Transformar conteudo existente em carrossel'],
                ['Modo 2', 'Criar narrativa a partir de um insight'],
                ['Exportar', 'Gera HTML + PNGs + caption prontos'],
            ],
        },
    };

    const msg = messages[skill];
    const html = `
        <div class="welcome-message">
            <div class="welcome-icon">${msg.icon}</div>
            <h2>${msg.title}</h2>
            <p>${msg.text}</p>
            <div class="welcome-tips">
                ${msg.tips.map(([title, desc]) => `
                    <div class="tip">
                        <strong>${title}</strong>
                        <span>${desc}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('chat-messages').innerHTML = html;
}

// Chat
function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }

    const textarea = e.target;
    textarea.addEventListener('input', () => autoResize(textarea));
    updateCharCount();
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    updateSendButton();
}

function updateCharCount() {
    const input = document.getElementById('chat-input');
    document.getElementById('char-count').textContent = input.value.length;
}

function updateSendButton() {
    const input = document.getElementById('chat-input');
    document.getElementById('send-btn').disabled = !input.value.trim() || isStreaming;
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || isStreaming) return;

    // Clear welcome
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();

    // Add user message
    addMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

    input.value = '';
    input.style.height = 'auto';
    updateCharCount();
    updateSendButton();

    // Show typing
    isStreaming = true;
    const typingEl = addTypingIndicator();

    try {
        const resp = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                skill: currentSkill,
            }),
        });

        typingEl.remove();

        if (!resp.ok) {
            const err = await resp.json();
            addMessage('assistant', `Erro: ${err.detail || 'Falha ao conectar com a AI'}`);
        } else {
            const data = await resp.json();
            addMessage('assistant', data.response);
            chatHistory.push({ role: 'assistant', content: data.response });
        }
    } catch (e) {
        typingEl.remove();
        addMessage('assistant', 'Erro de conexao. Verifique se o servidor esta rodando.');
    }

    isStreaming = false;
    updateSendButton();
}

function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = formatMarkdown(content);
    document.getElementById('chat-messages').appendChild(div);
    scrollToBottom();
}

function addTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    document.getElementById('chat-messages').appendChild(div);
    scrollToBottom();
    return div;
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
}

function formatMarkdown(text) {
    // Simple markdown to HTML conversion
    let html = text
        // Code blocks
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Unordered lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Wrap lists
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
        return match;
    });

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    return `<p>${html}</p>`;
}

// Files
async function loadFiles() {
    try {
        const resp = await fetch(`${API_URL}/api/storage/list`);
        const files = await resp.json();
        const container = document.getElementById('files-list');

        if (files.length === 0) {
            container.innerHTML = '<small class="empty">Nenhum arquivo ainda</small>';
            return;
        }

        container.innerHTML = files.map(f => `
            <div class="file-item" onclick="viewFile('${f.name}')">
                <span class="name">${f.name}</span>
            </div>
        `).join('');
    } catch (e) {
        console.error('Erro ao carregar arquivos:', e);
    }
}

async function viewFile(filename) {
    try {
        const resp = await fetch(`${API_URL}/api/storage/${filename}`);
        const data = await resp.json();
        addMessage('assistant', `**${filename}:**\n\n${data.response || data.content}`);
    } catch (e) {
        alert('Erro ao abrir arquivo');
    }
}

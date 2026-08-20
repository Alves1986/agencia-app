import { decryptProviderKey } from "./crypto";
import { invokeLLM } from "../_core/llm";

export type AgencyGenerationMode = "ads" | "carousel" | "bundle" | "strategy" | "video" | "council";

export type AgencyOutput = {
  strategy?: { positioning: string; angle: string; audience: string; evidenceGaps: string[] };
  ads?: Array<{ headline: string; primaryText: string; cta: string; angle: string }>;
  carousel?: Array<{ slideNumber: number; role: "cover" | "context" | "insight" | "proof" | "solution" | "cta"; headline: string; body?: string; visualDirection: string; imagePrompt: string }>;
  video?: { title: string; hook: string; script: string; scenes: Array<{ scene: number; visual: string; narration: string }>; editPlan: string };
  council?: { lenses: Array<{ lens: string; assessment: string }>; recommendation: string; primaryRisk: string };
};

type Connection = {
  provider: "manus" | "openai" | "openai_compatible" | "gemini" | "anthropic";
  defaultModel: string;
  apiBaseUrl: string | null;
  encryptedApiKey: string | null;
};

export function buildAgencyPrompt(input: { mode: AgencyGenerationMode; clientName: string; campaignName: string; objective: string; briefing: string; profile?: { positioning?: string | null; voice?: string | null; audience?: string | null; offers?: string | null; proofPolicy?: string | null; visualSystem?: string | null } | null; }) {
  const profile = input.profile ? [
    `Posicionamento: ${input.profile.positioning || "[PENDENTE]"}`,
    `Voz: ${input.profile.voice || "[PENDENTE]"}`,
    `Público: ${input.profile.audience || "[PENDENTE]"}`,
    `Oferta: ${input.profile.offers || "[PENDENTE]"}`,
    `Política de prova: ${input.profile.proofPolicy || "Não inventar métricas, resultados ou depoimentos."}`,
    `Sistema visual: ${input.profile.visualSystem || "[PENDENTE]"}`,
  ].join("\n") : "Perfil de marca ainda não configurado.";
  return `Você é a orquestração de uma agência criativa. Trabalhe apenas com o contexto fornecido; nunca invente fatos, métricas, depoimentos, fontes ou resultados. Quando faltar base, registre [FONTE PENDENTE] ou [ADICIONAR DADO REAL].\n\nCliente: ${input.clientName}\nCampanha: ${input.campaignName}\nObjetivo: ${input.objective}\nModo solicitado: ${input.mode}\n\nPerfil da marca:\n${profile}\n\nBriefing:\n${input.briefing}\n\nResponda somente JSON. Para strategy: {strategy:{positioning,angle,audience,evidenceGaps}}. Para ads: {ads:[{headline,primaryText,cta,angle}]}. Para carousel: {carousel:[{slideNumber,role,headline,body,visualDirection,imagePrompt}]}; cada slide é uma arte vertical independente, não uma colagem. Para video: {video:{title,hook,script,scenes:[{scene,visual,narration}],editPlan}}. Para council: {council:{lenses:[{lens,assessment}],recommendation,primaryRisk}}. Para bundle, inclua strategy, ads, carousel e video.`;
}

function parseOutput(text: string): AgencyOutput {
  const normalized = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const value = JSON.parse(normalized) as AgencyOutput;
  if (!value || typeof value !== "object") throw new Error("O provedor retornou um formato de geração inválido");
  return value;
}

async function callJson(url: string, init: RequestInit, read: (payload: any) => string) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`O provedor recusou a geração (${response.status})`);
  return parseOutput(read(await response.json()));
}

export async function generateAgencyOutput(connection: Connection | null, prompt: string): Promise<{ output: AgencyOutput; provider: string; model: string }> {
  if (!connection || connection.provider === "manus") {
    const model = connection?.defaultModel || "gpt-5-mini";
    const result = await invokeLLM({ model, responseFormat: { type: "json_object" }, maxTokens: 4000, messages: [{ role: "system", content: "Você entrega JSON válido, sem markdown." }, { role: "user", content: prompt }] });
    const content = result.choices[0]?.message.content;
    if (typeof content !== "string") throw new Error("O provedor interno não retornou texto");
    return { output: parseOutput(content), provider: "manus", model };
  }
  if (!connection.encryptedApiKey) throw new Error("Este provedor exige uma chave de API válida para o cliente");
  const apiKey = decryptProviderKey(connection.encryptedApiKey);
  const model = connection.defaultModel;
  if (connection.provider === "gemini") {
    const base = (connection.apiBaseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
    const output = await callJson(`${base}/models/${encodeURIComponent(model)}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify({ systemInstruction: { parts: [{ text: "Você entrega JSON válido, sem markdown." }] }, contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }) }, payload => payload.candidates?.[0]?.content?.parts?.[0]?.text || "");
    return { output, provider: connection.provider, model };
  }
  if (connection.provider === "anthropic") {
    const base = (connection.apiBaseUrl || "https://api.anthropic.com/v1").replace(/\/$/, "");
    const output = await callJson(`${base}/messages`, { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model, max_tokens: 4000, system: "Você entrega JSON válido, sem markdown.", messages: [{ role: "user", content: prompt }] }) }, payload => payload.content?.[0]?.text || "");
    return { output, provider: connection.provider, model };
  }
  const base = (connection.apiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const output = await callJson(`${base}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, response_format: { type: "json_object" }, messages: [{ role: "system", content: "Você entrega JSON válido, sem markdown." }, { role: "user", content: prompt }] }) }, payload => payload.choices?.[0]?.message?.content || "");
  return { output, provider: connection.provider, model };
}

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bot, BrainCircuit, CheckCircle2, ChevronRight, Clapperboard, FileText, KeyRound, Loader2, Plus, Sparkles, WandSparkles, XCircle } from "lucide-react";
import { toast } from "sonner";
import { StudioShell } from "@/components/StudioShell";
import { trpc } from "@/lib/trpc";
import "./agency-review.css";

type Mode = "ads" | "carousel" | "bundle" | "strategy" | "video" | "council";

export const agencyModeOptions: Record<Mode, { label: string; description: string }> = {
  bundle: { label: "Campanha integrada", description: "Estratégia, anúncios, carrossel e roteiro no mesmo briefing." },
  ads: { label: "Anúncios", description: "Ângulos, textos principais e chamadas para ação." },
  carousel: { label: "Carrossel", description: "Narrativa editorial com artes independentes por slide." },
  video: { label: "Roteiro de vídeo", description: "Gancho, cenas, locução e plano de edição." },
  strategy: { label: "Estratégia", description: "Posicionamento, público e lacunas de evidência." },
  council: { label: "Conselho IA", description: "Lentes de decisão, recomendação e risco humano." },
};

const defaultProfile = { positioning: "", voice: "", audience: "", offers: "", proofPolicy: "", visualSystem: "" };

export default function Agency() {
  const utils = trpc.useUtils();
  const clients = trpc.workspace.clients.useQuery();
  const preferences = trpc.workspace.preferences.useQuery();
  const [clientId, setClientId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("bundle");
  const [profile, setProfile] = useState(defaultProfile);
  const [campaign, setCampaign] = useState({ name: "", objective: "", briefing: "", connectionId: "" });
  const [provider, setProvider] = useState({ label: "", provider: "manus" as "manus" | "openai" | "openai_compatible" | "gemini" | "anthropic", model: "gpt-5-mini", baseUrl: "", apiKey: "" });
  const [reviewCampaignId, setReviewCampaignId] = useState<number | null>(null);
  const selectedClient = useMemo(() => clients.data?.find(item => item.id === clientId) ?? null, [clients.data, clientId]);
  const overview = trpc.agency.overview.useQuery({ clientId: clientId ?? 0 }, { enabled: clientId !== null });
  const versions = trpc.agency.versions.useQuery({ campaignId: reviewCampaignId ?? 0 }, { enabled: reviewCampaignId !== null });

  useEffect(() => {
    if (clientId !== null || !clients.data?.length) return;
    setClientId(preferences.data?.activeClientId && clients.data.some(item => item.id === preferences.data?.activeClientId) ? preferences.data.activeClientId : clients.data[0].id);
  }, [clientId, clients.data, preferences.data?.activeClientId]);
  useEffect(() => {
    if (!overview.data?.profile) return;
    setProfile({ positioning: overview.data.profile.positioning ?? "", voice: overview.data.profile.voice ?? "", audience: overview.data.profile.audience ?? "", offers: overview.data.profile.offers ?? "", proofPolicy: overview.data.profile.proofPolicy ?? "", visualSystem: overview.data.profile.visualSystem ?? "" });
  }, [overview.data?.profile?.updatedAt]);

  const saveProfile = trpc.agency.saveProfile.useMutation({ onSuccess: () => { utils.agency.overview.invalidate(); toast.success("Perfil de agência salvo para este cliente."); } });
  const connectProvider = trpc.agency.connectProvider.useMutation({ onSuccess: () => { utils.agency.overview.invalidate(); setProvider({ label: "", provider: "manus", model: "gpt-5-mini", baseUrl: "", apiKey: "" }); toast.success("Provedor conectado com chave protegida no servidor."); } });
  const createCampaign = trpc.agency.createCampaign.useMutation({
    onSuccess: async data => {
      await utils.agency.overview.invalidate();
      setCampaign(current => ({ ...current, name: "", objective: "", briefing: "" }));
      toast.success("Campanha criada. Revise o briefing e gere quando estiver pronto.");
      setLastCampaignId(data.id);
    },
    onError: error => toast.error(error.message),
  });
  const generate = trpc.agency.generate.useMutation({ onSuccess: async (_data, variables) => { setReviewCampaignId(variables.campaignId); await Promise.all([utils.agency.overview.invalidate(), utils.agency.versions.invalidate({ campaignId: variables.campaignId })]); toast.success("Geração concluída. Revise os materiais antes de aprovar."); }, onError: error => toast.error(error.message) });
  const approveVersion = trpc.agency.approveVersion.useMutation({ onSuccess: () => { if (reviewCampaignId) utils.agency.versions.invalidate({ campaignId: reviewCampaignId }); toast.success("Decisão registrada no histórico da campanha."); }, onError: error => toast.error(error.message) });
  const [lastCampaignId, setLastCampaignId] = useState<number | null>(null);

  function submitProfile(event: FormEvent) {
    event.preventDefault();
    if (!clientId) return;
    saveProfile.mutate({ clientId, ...profile });
  }
  function submitProvider(event: FormEvent) {
    event.preventDefault();
    if (!clientId) return;
    connectProvider.mutate({ clientId, label: provider.label, provider: provider.provider, defaultModel: provider.model, apiBaseUrl: provider.baseUrl || null, apiKey: provider.provider === "manus" ? undefined : provider.apiKey || undefined });
  }
  function submitCampaign(event: FormEvent) {
    event.preventDefault();
    if (!clientId) return;
    createCampaign.mutate({ clientId, name: campaign.name, objective: campaign.objective, briefing: campaign.briefing, mode: mode === "carousel" ? "carousel" : mode === "ads" ? "ads" : "bundle", providerConnectionId: campaign.connectionId ? Number(campaign.connectionId) : undefined });
  }

  return <StudioShell eyebrow="Agência conectada" title="Criação com IA" actions={<button className="ops-primary-button" type="button" onClick={() => document.getElementById("agency-briefing")?.scrollIntoView({ behavior: "smooth" })}><WandSparkles size={17} /> Nova geração</button>}>
    <div className="ops-content agency-content">
      <section className="agency-hero">
        <div><p className="ops-section-kicker">Orquestração por cliente</p><h2>Uma campanha, várias entregas, uma decisão humana.</h2><p>Conecte a marca, selecione um provedor e transforme o mesmo briefing em estratégia, anúncios, carrossel, vídeo e conselho de decisão.</p></div>
        <label className="agency-client-picker">Cliente operacional<select value={clientId ?? ""} onChange={event => setClientId(Number(event.target.value))} aria-label="Cliente da agência"><option value="" disabled>Selecione um cliente</option>{(clients.data ?? []).map(client => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
      </section>
      {!clients.data?.length ? <section className="ops-empty"><p>Cadastre um cliente em Projetos antes de iniciar uma operação de agência.</p></section> : null}
      {selectedClient ? <>
        <section className="agency-metrics" aria-label="Visão da agência">
          <Metric icon={<FileText size={18} />} label="Briefs ativos" value={overview.data?.briefs.length ?? "—"} />
          <Metric icon={<Sparkles size={18} />} label="Campanhas" value={overview.data?.campaigns.length ?? "—"} />
          <Metric icon={<Clapperboard size={18} />} label="Roteiros" value={overview.data?.videos.length ?? "—"} />
          <Metric icon={<BrainCircuit size={18} />} label="Decisões" value={overview.data?.decisions.length ?? "—"} />
        </section>
        <section className="agency-workbench">
          <form className="ops-panel agency-profile" onSubmit={submitProfile}>
            <div className="ops-panel-heading"><div><p className="ops-section-kicker">01 · Contexto da marca</p><h2>Perfil de {selectedClient.name}</h2></div><Bot size={20} /></div>
            <div className="agency-form-grid"><Field label="Posicionamento" value={profile.positioning} onChange={value => setProfile({ ...profile, positioning: value })} placeholder="O espaço que a marca quer ocupar" /><Field label="Voz" value={profile.voice} onChange={value => setProfile({ ...profile, voice: value })} placeholder="Ex.: direta, especialista, acolhedora" /><Field label="Público prioritário" value={profile.audience} onChange={value => setProfile({ ...profile, audience: value })} placeholder="Quem precisa ser alcançado" /><Field label="Oferta e prioridade" value={profile.offers} onChange={value => setProfile({ ...profile, offers: value })} placeholder="Produto, serviço ou ação" /></div>
            <Field label="Regras de prova" value={profile.proofPolicy} onChange={value => setProfile({ ...profile, proofPolicy: value })} placeholder="O que pode ser afirmado e quais fontes são necessárias" multiline /><Field label="Sistema visual" value={profile.visualSystem} onChange={value => setProfile({ ...profile, visualSystem: value })} placeholder="Cores, composição, restrições e referências autorizadas" multiline />
            <button className="ops-outline-button" type="submit" disabled={saveProfile.isPending}>{saveProfile.isPending ? <Loader2 size={16} /> : null} Salvar contexto</button>
          </form>
          <form className="ops-panel agency-provider" onSubmit={submitProvider}>
            <div className="ops-panel-heading"><div><p className="ops-section-kicker">02 · Motor de IA</p><h2>Provedor por cliente</h2></div><KeyRound size={20} /></div>
            <p className="ops-panel-copy">A chave é cifrada no servidor e nunca volta para o navegador ou para relatórios.</p>
            <Field label="Nome da conexão" value={provider.label} onChange={value => setProvider({ ...provider, label: value })} placeholder="Ex.: OpenAI · Marketing" required />
            <label className="agency-field">Provedor<select value={provider.provider} onChange={event => setProvider({ ...provider, provider: event.target.value as typeof provider.provider })}><option value="manus">Manus integrado</option><option value="openai">OpenAI</option><option value="openai_compatible">OpenAI compatível</option><option value="gemini">Google Gemini</option><option value="anthropic">Anthropic</option></select></label>
            <Field label="Modelo" value={provider.model} onChange={value => setProvider({ ...provider, model: value })} placeholder="Modelo de texto" required />
            {provider.provider !== "manus" ? <><Field label="URL base (opcional)" value={provider.baseUrl} onChange={value => setProvider({ ...provider, baseUrl: value })} placeholder="https://..." /><Field label="Chave de API" value={provider.apiKey} onChange={value => setProvider({ ...provider, apiKey: value })} placeholder="Cole a chave do cliente" type="password" required /></> : null}
            <button className="ops-outline-button" type="submit" disabled={connectProvider.isPending}>{connectProvider.isPending ? <Loader2 size={16} /> : null} Proteger conexão</button>
            {overview.data?.connections.length ? <p className="agency-hint">Conexões ativas: {overview.data.connections.map(item => `${item.label} (${item.keyHint})`).join(" · ")}</p> : null}
          </form>
        </section>
        <section id="agency-briefing" className="ops-panel agency-briefing">
          <div className="ops-panel-heading"><div><p className="ops-section-kicker">03 · Orquestrar entrega</p><h2>Do briefing à campanha revisável</h2></div><WandSparkles size={20} /></div>
          <div className="agency-mode-grid">{(Object.keys(agencyModeOptions) as Mode[]).map(item => <button key={item} className={mode === item ? "is-selected" : ""} type="button" onClick={() => setMode(item)}><strong>{agencyModeOptions[item].label}</strong><span>{agencyModeOptions[item].description}</span></button>)}</div>
          <form onSubmit={submitCampaign} className="agency-campaign-form"><div className="agency-form-grid"><Field label="Nome da campanha" value={campaign.name} onChange={value => setCampaign({ ...campaign, name: value })} placeholder="Ex.: Linha de acabamentos premium" required /><Field label="Objetivo" value={campaign.objective} onChange={value => setCampaign({ ...campaign, objective: value })} placeholder="Ex.: gerar conversas qualificadas" required /><label className="agency-field">Provedor<select value={campaign.connectionId} onChange={event => setCampaign({ ...campaign, connectionId: event.target.value })}><option value="">Manus integrado</option>{(overview.data?.connections ?? []).map(item => <option key={item.id} value={item.id}>{item.label} · {item.defaultModel}</option>)}</select></label></div><Field label="Briefing único" value={campaign.briefing} onChange={value => setCampaign({ ...campaign, briefing: value })} placeholder="Contexto, oferta, mensagem, restrições, fatos aprovados e ação esperada." multiline required /><button className="ops-primary-button" type="submit" disabled={createCampaign.isPending}>{createCampaign.isPending ? <Loader2 size={16} /> : <Plus size={17} />} Criar material de trabalho</button></form>
        </section>
        <section className="agency-output-grid"><div className="ops-panel"><div className="ops-panel-heading"><div><p className="ops-section-kicker">Fila de criação</p><h2>Campanhas recentes</h2></div><Sparkles size={20} /></div>{overview.isLoading ? <div className="ops-page-loading"><Loader2 size={18} /> Lendo agência…</div> : null}{!(overview.data?.campaigns.length) && !overview.isLoading ? <p className="ops-empty-copy">O primeiro briefing criado aparecerá aqui para revisão e geração.</p> : null}{(overview.data?.campaigns ?? []).slice(0, 5).map(({ campaign: item }) => <div className="agency-list-row" key={item.id}><div><strong>{item.name}</strong><span>{item.objective}</span><small>{item.status === "ready" ? "Pronto para revisão" : item.status === "failed" ? "Falha na geração" : "Rascunho de trabalho"}</small></div><div className="agency-row-actions"><button type="button" className="ops-text-button" onClick={() => setReviewCampaignId(item.id)}>Revisar</button><button type="button" className="ops-text-button" disabled={generate.isPending} onClick={() => generate.mutate({ campaignId: item.id, mode: item.mode === "carousel" ? "carousel" : item.mode === "ads" ? "ads" : mode })}>Gerar <ChevronRight size={15} /></button></div></div>)}</div>
          <div className="ops-panel"><div className="ops-panel-heading"><div><p className="ops-section-kicker">Conselho e inteligência</p><h2>Sinais para revisar</h2></div><BrainCircuit size={20} /></div>{(overview.data?.trends ?? []).slice(0, 3).map(item => <div className="agency-list-row" key={item.id}><div><strong>{item.title}</strong><span>{item.platform} · prioridade {item.score ?? "—"}</span></div></div>)}{(overview.data?.decisions ?? []).slice(0, 3).map(item => <div className="agency-list-row" key={item.id}><div><strong>{item.recommendation}</strong><small>Risco: {item.primaryRisk || "em revisão"}</small></div></div>)}{!(overview.data?.trends.length || overview.data?.decisions.length) ? <p className="ops-empty-copy">Registre sinais e decisões após gerar ou revisar uma campanha. A IA recomenda; sua equipe aprova.</p> : null}</div></section>
        <section className="ops-panel agency-review-queue" aria-label="Revisão humana de versões"><div className="ops-panel-heading"><div><p className="ops-section-kicker">Revisão humana</p><h2>Versões e aprovações</h2></div><CheckCircle2 size={20} /></div>{!reviewCampaignId ? <p className="ops-empty-copy">Escolha <strong>Revisar</strong> em uma campanha para abrir seu histórico de materiais.</p> : null}{versions.isLoading ? <div className="ops-page-loading"><Loader2 size={18} /> Carregando versões…</div> : null}{reviewCampaignId && !versions.isLoading && !versions.data?.length ? <p className="ops-empty-copy">Ainda não há material gerado para esta campanha.</p> : null}{(versions.data ?? []).map(version => <div className="agency-version-row" key={version.id}><div><strong>{version.kind} · V{version.versionNumber}</strong><span>{version.summary || "Material sem resumo"}</span><small>Status: {version.status === "approved" ? "Aprovada" : version.status === "rejected" ? "Rejeitada" : "Em revisão"}</small></div>{version.status === "review" ? <div className="agency-row-actions"><button type="button" className="ops-text-button" disabled={approveVersion.isPending} onClick={() => approveVersion.mutate({ creativeVersionId: version.id, decision: "changes_requested" })}>Ajustes</button><button type="button" className="ops-text-button agency-reject-action" disabled={approveVersion.isPending} onClick={() => approveVersion.mutate({ creativeVersionId: version.id, decision: "rejected" })}><XCircle size={15} /> Rejeitar</button><button type="button" className="ops-primary-button agency-approve-action" disabled={approveVersion.isPending} onClick={() => approveVersion.mutate({ creativeVersionId: version.id, decision: "approved" })}><CheckCircle2 size={15} /> Aprovar</button></div> : null}</div>)}</section>
        {lastCampaignId ? <p className="agency-result-note">Campanha #{lastCampaignId} pronta para geração. Selecione <strong>Gerar</strong> na fila quando quiser enviar o briefing ao provedor.</p> : null}
      </> : null}
    </div>
  </StudioShell>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) { return <div className="agency-metric"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>; }
function Field({ label, value, onChange, placeholder, multiline, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; multiline?: boolean; type?: string; required?: boolean }) { return <label className="agency-field"><span>{label}</span>{multiline ? <textarea value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required} /> : <input type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required} />}</label>; }

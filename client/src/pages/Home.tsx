/** Radar de Estúdio: painel editorial com foco, ritmo e ações de produção, não uma grade genérica de cartões. */
import { toast } from "sonner";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Command,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const heroArt = "/manus-storage/radar-studio-hero_2926eb80.png";
const orbitArt = "/manus-storage/campaign-orbit_8fede86d.png";
const gridArt = "/manus-storage/campaign-grid_2fe493fe.png";
const pulseMark = "/manus-storage/agencia-pulse-mark_5618a4d0.png";

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Projetos", icon: FolderKanban },
  { label: "Produção", icon: Grid2X2 },
  { label: "Clientes", icon: UsersRound },
  { label: "Conversas", icon: MessageCircle, badge: "3" },
];

const pageDescriptions: Record<string, string> = {
  "Visão geral": "Seu estúdio em movimento, sem ruído.",
  Projetos: "O que está em andamento e o que pede decisão.",
  Produção: "Prioridades, responsáveis e entregas da semana.",
  Clientes: "Relacionamentos ativos e próximos pontos de contato.",
  Conversas: "Contextos que pedem resposta da equipe.",
};

const projects = [
  {
    name: "Maré — Lançamento Q3",
    client: "Maré Hospitality",
    owner: "JM",
    due: "Hoje, 16h",
    status: "Em aprovação",
    progress: 78,
    tone: "orange",
    image: orbitArt,
  },
  {
    name: "Selo Terra",
    client: "Casa Terra",
    owner: "AC",
    due: "Amanhã",
    status: "Em produção",
    progress: 54,
    tone: "blue",
    image: gridArt,
  },
  {
    name: "Semana do Varejo",
    client: "Nodo Market",
    owner: "LR",
    due: "Qui, 22 ago",
    status: "Em revisão",
    progress: 92,
    tone: "mint",
    image: orbitArt,
  },
];

const schedule = [
  { time: "09:30", title: "Kick-off Maré", meta: "Estratégia · sala 2", kind: "meeting" },
  { time: "11:00", title: "Revisão de roteiro", meta: "Selo Terra · 40 min", kind: "review" },
  { time: "14:30", title: "Envio para aprovação", meta: "Semana do Varejo", kind: "delivery" },
  { time: "16:00", title: "Checkpoint de mídia", meta: "Equipe de performance", kind: "meeting" },
];

function MiniPulse({ active = false }: { active?: boolean }) {
  return (
    <span className={`mini-pulse ${active ? "is-active" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Visão geral");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedRange, setSelectedRange] = useState("Esta semana");

  const weeklyCompletion = useMemo(
    () => Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length),
    [],
  );

  function selectNavigation(label: string) {
    setActiveNav(label);
    setMobileMenuOpen(false);
    if (label !== "Visão geral") {
      toast(`${label} selecionado`, {
        description: "A navegação está pronta para receber os dados do seu projeto original.",
      });
    }
  }

  function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectName.trim() || "Novo projeto";
    setComposerOpen(false);
    setProjectName("");
    toast("Projeto criado no rascunho", {
      description: `${name} foi adicionado como próximo passo para sua equipe.`,
    });
  }

  return (
    <div className="studio-app">
      <button
        className="mobile-menu-trigger"
        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`studio-sidebar ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
        <div className="brand-lockup">
          <img src={pulseMark} alt="Símbolo Agência" className="brand-mark" />
          <span>agência</span>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-label">Navegar</p>
          {navigation.map(({ label, icon: Icon, badge }) => (
            <button
              key={label}
              className={`nav-link ${activeNav === label ? "is-current" : ""}`}
              onClick={() => selectNavigation(label)}
              aria-current={activeNav === label ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {badge ? <b>{badge}</b> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="studio-note">
            <Sparkles size={16} />
            <p>
              <strong>Ritmo da semana</strong>
              {weeklyCompletion}% das frentes em curso.
            </p>
          </div>
          <button className="nav-link subtle" onClick={() => toast("Configurações", { description: "Preferências do espaço de trabalho." })}>
            <Settings2 size={18} strokeWidth={1.9} />
            <span>Configurações</span>
          </button>
          <div className="member-strip">
            <div className="avatar avatar-coral">MC</div>
            <div className="member-copy">
              <strong>Marina Costa</strong>
              <span>Direção de contas</span>
            </div>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </div>
      </aside>

      <main className="studio-main">
        <header className="topbar">
          <div className="topbar-context">
            <div className="topbar-identity"><img src={pulseMark} alt="" /><span>Centro de comando</span></div>
            <p className="eyeline"><MiniPulse active /> Segunda, 19 de agosto</p>
            <h2>{activeNav}</h2>
          </div>
          <div className="topbar-actions">
            <button className="search-button" onClick={() => toast("Busca rápida", { description: "Conecte esta ação ao índice do seu projeto original." })}>
              <Search size={18} />
              <span>Buscar</span>
              <kbd><Command size={12} /> K</kbd>
            </button>
            <button className="icon-button" aria-label="Notificações" onClick={() => toast("3 atualizações", { description: "Duas aprovações e uma conversa aguardam você." })}>
              <Bell size={19} />
              <i className="notification-dot" />
            </button>
            <button className="create-button" onClick={() => setComposerOpen(true)}>
              <Plus size={18} strokeWidth={2.4} /> Criar projeto
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="intro-row" aria-labelledby="overview-title">
            <div>
              <p className="section-kicker">Bom dia, Marina</p>
              <h1 id="overview-title">{pageDescriptions[activeNav]}</h1>
            </div>
            <div className="week-selector" aria-label="Período exibido">
              {["Esta semana", "Este mês"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={selectedRange === range ? "is-selected" : ""}
                >
                  {range}
                </button>
              ))}
            </div>
          </section>

          <section className="signal-rail" aria-label="Resumo da operação">
            <div className="signal-stat">
              <span>Em curso</span>
              <strong>12</strong>
              <p><TrendingUp size={15} /> 4 acelerando hoje</p>
            </div>
            <div className="signal-stat">
              <span>Para aprovar</span>
              <strong>05</strong>
              <p><MiniPulse active /> 2 decisões até 16h</p>
            </div>
            <div className="signal-stat is-accent">
              <span>Ritmo de entrega</span>
              <strong>{weeklyCompletion}%</strong>
              <p><Check size={15} /> acima da última semana</p>
            </div>
            <div className="signal-legend" aria-label="Legenda de prioridade">
              <span><i className="legend-dot is-orange" /> prioridade</span>
              <span><i className="legend-dot is-mint" /> em fluxo</span>
            </div>
          </section>

          <div className="workbench-grid">
            <div className="focus-column">
              <section className="focus-panel" aria-labelledby="focus-title">
                <div className="focus-art-wrap" aria-hidden="true">
                  <img src={heroArt} alt="" className="focus-art" />
                </div>
                <div className="focus-copy">
                  <div className="focus-label"><span /> Foco de agora</div>
                  <p className="focus-client">Maré Hospitality</p>
                  <h2 id="focus-title">Lançamento Q3 precisa da sua aprovação.</h2>
                  <p className="focus-description">A apresentação estratégica está fechada. Revise a narrativa e libere a produção antes da reunião de hoje.</p>
                  <div className="focus-footer">
                    <div className="progress-cluster">
                      <div className="progress-meta"><span>Plano estratégico</span><b>78%</b></div>
                      <div className="progress-line"><i style={{ width: "78%" }} /></div>
                    </div>
                    <button onClick={() => toast("Plano aberto", { description: "Você está pronto para revisar os pontos-chave do lançamento." })}>
                      Abrir plano <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
              </section>

              <section className="project-section" aria-labelledby="projects-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">No radar</p>
                    <h2 id="projects-title">Projetos em movimento</h2>
                  </div>
                  <button className="text-action" onClick={() => selectNavigation("Projetos")}>Ver todos <ArrowUpRight size={16} /></button>
                </div>

                <div className="project-list">
                  {projects.map((project) => (
                    <article className="project-row" key={project.name}>
                      <img src={project.image} alt="" className={`project-art ${project.tone}`} />
                      <div className="project-main">
                        <div className="project-name-line">
                          <h3>{project.name}</h3>
                          <span className={`status-pill ${project.tone}`}>{project.status}</span>
                        </div>
                        <p>{project.client} <span>·</span> Responsável {project.owner}</p>
                      </div>
                      <div className="project-deadline">
                        <span>Próximo marco</span>
                        <b>{project.due}</b>
                      </div>
                      <div className="row-progress" aria-label={`${project.progress}% concluído`}>
                        <span>{project.progress}%</span>
                        <div><i style={{ width: `${project.progress}%` }} /></div>
                      </div>
                      <button className="row-menu" aria-label={`Mais ações para ${project.name}`} onClick={() => toast("Ações do projeto", { description: `${project.name}: abrir, editar ou atribuir responsável.` })}>
                        <MoreHorizontal size={19} />
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="rhythm-column" aria-label="Ritmo da equipe">
              <section className="schedule-panel" aria-labelledby="schedule-title">
                <div className="section-header compact">
                  <div>
                    <p className="section-kicker">Hoje</p>
                    <h2 id="schedule-title">Régua de produção</h2>
                  </div>
                  <button className="calendar-button" onClick={() => toast("Agenda aberta", { description: "Sua programação detalhada será conectada aqui." })} aria-label="Abrir calendário">
                    <CalendarDays size={18} />
                  </button>
                </div>
                <div className="schedule-list">
                  {schedule.map((item, index) => (
                    <button className="schedule-item" key={item.title} onClick={() => toast(item.title, { description: item.meta })}>
                      <time>{item.time}</time>
                      <span className={`schedule-pin ${item.kind} ${index === 0 ? "now" : ""}`} />
                      <span className="schedule-copy"><b>{item.title}</b><small>{item.meta}</small></span>
                    </button>
                  ))}
                </div>
                <button className="full-calendar" onClick={() => toast("Calendário completo", { description: "Visualização semanal em preparação." })}>Ver calendário completo <ArrowUpRight size={16} /></button>
              </section>

              <section className="team-card" aria-labelledby="team-title">
                <div className="team-topline">
                  <div>
                    <p className="section-kicker">Equipe</p>
                    <h2 id="team-title">Capacidade de resposta</h2>
                  </div>
                  <span className="live-status"><i /> 8 online</span>
                </div>
                <div className="team-availability">
                  <div className="availability-copy"><b>Direção de arte</b><span>2 espaços esta semana</span></div>
                  <div className="availability-meter"><i /><i /><i className="open" /><i className="open" /></div>
                </div>
                <div className="team-avatars" aria-label="Membros online">
                  <span className="avatar avatar-blue">AR</span>
                  <span className="avatar avatar-mint">GA</span>
                  <span className="avatar avatar-lilac">PM</span>
                  <span className="avatar avatar-orange">+5</span>
                  <button onClick={() => toast("Equipe", { description: "Veja carga, disponibilidade e especialidades." })}>Ver equipe <ArrowUpRight size={14} /></button>
                </div>
              </section>

              <section className="shortcut-panel" aria-label="Ações rápidas">
                <button onClick={() => setComposerOpen(true)}><Plus size={18} /><span>Novo projeto</span></button>
                <button onClick={() => toast("Novo briefing", { description: "Organize o contexto antes de iniciar uma nova frente." })}><Sparkles size={18} /><span>Novo briefing</span></button>
                <button onClick={() => toast("Relatório semanal", { description: "Compartilhe uma leitura clara do ritmo da agência." })}><Clock3 size={18} /><span>Fechar semana</span></button>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {composerOpen ? (
        <div className="composer-layer" role="presentation" onMouseDown={() => setComposerOpen(false)}>
          <form className="project-composer" onSubmit={submitProject} onMouseDown={(event) => event.stopPropagation()} aria-labelledby="composer-title">
            <button type="button" className="composer-close" onClick={() => setComposerOpen(false)} aria-label="Fechar"><X size={20} /></button>
            <div className="composer-icon"><Plus size={21} /></div>
            <p className="section-kicker">Novo ponto de partida</p>
            <h2 id="composer-title">Coloque uma nova frente no radar.</h2>
            <label htmlFor="project-name">Como essa entrega vai se chamar?</label>
            <input id="project-name" value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="Ex.: Campanha Primavera" autoFocus />
            <div className="composer-actions">
              <button type="button" className="quiet-button" onClick={() => setComposerOpen(false)}>Agora não</button>
              <button type="submit" className="create-button">Criar rascunho <ArrowUpRight size={17} /></button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

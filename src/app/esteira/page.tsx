"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Crown,
  Gem,
  Layers3,
  type LucideIcon,
  RefreshCcw,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react";

type SignalKey =
  | "recurrence"
  | "implementation"
  | "scale"
  | "licensing"
  | "highTicket"
  | "ai";

type SignalConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
};

type Offer = {
  stage: string;
  name: string;
  price: string;
  billing: string;
  kind: string;
  headline: string;
  description: string;
  bullets: string[];
  anchor?: string;
  psychology: string;
  nextStep: string;
  icon: LucideIcon;
  signals: SignalKey[];
  theme: {
    cardClass: string;
    badgeClass: string;
    iconClass: string;
    glow: string;
    gradientClass: string;
  };
};

const signalMap: Record<SignalKey, SignalConfig> = {
  recurrence: {
    label: "Recorrencia",
    icon: RefreshCcw,
    className: "border border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  },
  implementation: {
    label: "Implementacao",
    icon: Workflow,
    className: "border border-sky-400/25 bg-sky-400/10 text-sky-200",
  },
  scale: {
    label: "Escala",
    icon: TrendingUp,
    className: "border border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  },
  licensing: {
    label: "Licenciamento",
    icon: Layers3,
    className: "border border-indigo-400/25 bg-indigo-400/10 text-indigo-200",
  },
  highTicket: {
    label: "High Ticket",
    icon: Crown,
    className: "border border-amber-400/25 bg-amber-400/10 text-amber-200",
  },
  ai: {
    label: "IA",
    icon: Bot,
    className: "border border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200",
  },
};

const overview = [
  {
    label: "Progressao psicologica",
    value: "Entrar -> Escalar serio",
    description: "A esteira move o cliente de adesao para posse, e de posse para escala.",
    icon: BrainCircuit,
  },
  {
    label: "Escalada de ticket",
    value: "R$147/mes -> R$10.000",
    description: "A subida de preco acompanha a subida de risco removido e valor entregue.",
    icon: TrendingUp,
  },
  {
    label: "Percepcao de valor",
    value: "Software -> Operacao -> Ativo -> Escala",
    description: "Cada etapa aumenta o nivel de controle, velocidade e prestacao de servico.",
    icon: Gem,
  },
  {
    label: "Ancoragem estrategica",
    value: "R$12k + R$50k-150k+",
    description: "As ancoras legitimam o salto de ticket ao comparar com o custo equivalente.",
    icon: Target,
  },
];

const offers: Offer[] = [
  {
    stage: "FRONT",
    name: "Future Flow™",
    price: "R$147",
    billing: "/mes",
    kind: "Assinatura recorrente",
    headline: "O Sistema de Recorrencia com IA",
    description:
      "Entrada de baixa friccao para transformar curiosidade em compromisso mensal, com IA, metodo, templates e comunidade.",
    bullets: [
      "App completo",
      "Metodos validados",
      "Templates",
      "Aquisicao de clientes",
      "Estruturas prontas",
      "Comunidade",
    ],
    psychology: "Entrar",
    nextStep: "Reduzir atrito tecnico e mostrar a operacao pronta.",
    icon: Bot,
    signals: ["recurrence", "ai"],
    theme: {
      cardClass: "border-cyan-400/20 bg-[#111827]/85",
      badgeClass: "border border-cyan-400/25 bg-cyan-400/12 text-cyan-100",
      iconClass: "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
      glow: "rgba(34, 211, 238, 0.22)",
      gradientClass: "from-cyan-400/18 via-cyan-400/6 to-transparent",
    },
  },
  {
    stage: "UPSELL 1",
    name: "Operacao Pronta™",
    price: "R$497",
    billing: "pagamento unico",
    kind: "Done-for-you",
    headline: "Nos implementamos tudo para voce",
    description:
      "Oferta de ativacao rapida para remover setup, integracoes e friccao operacional logo apos a entrada.",
    bullets: ["API Oficial", "Setup completo", "Fluxos", "Integracoes", "Automacoes"],
    anchor: "Ancoragem: R$12.000",
    psychology: "Ter pronto",
    nextStep: "Sair do uso da ferramenta e enxergar recorrencia como negocio.",
    icon: Workflow,
    signals: ["implementation", "scale"],
    theme: {
      cardClass: "border-sky-400/20 bg-[#111827]/85",
      badgeClass: "border border-sky-400/25 bg-sky-400/12 text-sky-100",
      iconClass: "border border-sky-400/20 bg-sky-400/10 text-sky-200",
      glow: "rgba(56, 189, 248, 0.22)",
      gradientClass: "from-sky-400/18 via-sky-400/6 to-transparent",
    },
  },
  {
    stage: "UPSELL 2",
    name: "Future Flow Partners™",
    price: "R$997",
    billing: "pagamento unico",
    kind: "Programa de parceiros",
    headline: "Ganhe 30% de recorrencia utilizando uma estrutura pronta",
    description:
      "Move o cliente da execucao assistida para a geracao de receita recorrente com uma maquina validada.",
    bullets: [
      "Programa de parceiros",
      "Funis validados",
      "Templates",
      "Sistema de aquisicao",
      "Operacao simplificada",
    ],
    anchor: "Estrutura equivalente: R$50k-150k+",
    psychology: "Ganhar recorrencia",
    nextStep: "Trocar participacao por controle e posse de uma operacao propria.",
    icon: TrendingUp,
    signals: ["recurrence", "scale"],
    theme: {
      cardClass: "border-emerald-400/20 bg-[#111827]/85",
      badgeClass: "border border-emerald-400/25 bg-emerald-400/12 text-emerald-100",
      iconClass: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      glow: "rgba(52, 211, 153, 0.22)",
      gradientClass: "from-emerald-400/18 via-emerald-400/6 to-transparent",
    },
  },
  {
    stage: "UPSELL 3",
    name: "Licenca Premium™",
    price: "R$1.997",
    billing: "pagamento unico",
    kind: "Licenca premium",
    headline: "Tenha sua propria operacao Future Flow",
    description:
      "A camada de ownership: transforma o cliente em operador com ativo proprio, estrutura replicavel e tese comercial clara.",
    bullets: [
      "Marca branca",
      "Estrutura replicavel",
      "Modelo de recorrencia",
      "Operacao pronta",
      "Estrategias comerciais",
    ],
    psychology: "Ter operacao propria",
    nextStep: "Acoplar infraestrutura, equipe premium e acompanhamento de escala.",
    icon: Layers3,
    signals: ["licensing", "implementation"],
    theme: {
      cardClass: "border-indigo-400/20 bg-[#111827]/85",
      badgeClass: "border border-indigo-400/25 bg-indigo-400/12 text-indigo-100",
      iconClass: "border border-indigo-400/20 bg-indigo-400/10 text-indigo-200",
      glow: "rgba(129, 140, 248, 0.22)",
      gradientClass: "from-indigo-400/18 via-indigo-400/6 to-transparent",
    },
  },
  {
    stage: "UPSELL 4",
    name: "Inner Circle™",
    price: "R$10.000",
    billing: "high ticket",
    kind: "Implementacao premium",
    headline: "Implementacao Total + Escala Premium",
    description:
      "Oferta de elite para acelerar infra, marca, time comercial e escala com proximidade maxima do core da operacao.",
    bullets: [
      "VPS",
      "Marca propria",
      "Setup avancado",
      "Closers premium",
      "Estrategias de escala",
      "Calls privadas",
    ],
    psychology: "Escalar serio",
    nextStep: "Retencao elite, expansao assistida e crescimento com infraestrutura madura.",
    icon: Crown,
    signals: ["highTicket", "scale", "implementation"],
    theme: {
      cardClass: "border-amber-400/20 bg-[#111827]/85",
      badgeClass: "border border-amber-400/25 bg-amber-400/12 text-amber-100",
      iconClass: "border border-amber-400/20 bg-amber-400/10 text-amber-200",
      glow: "rgba(251, 191, 36, 0.24)",
      gradientClass: "from-amber-400/18 via-amber-400/6 to-transparent",
    },
  },
];

const psychologicalLadder = [
  "Entrar",
  "Ter pronto",
  "Ganhar recorrencia",
  "Ter operacao propria",
  "Escalar serio",
];

const insights = [
  {
    title: "Congruencia de oferta",
    text: "Cada card resolve a objeção natural criada pela etapa anterior: entrar, ativar, monetizar, possuir e escalar.",
    icon: Workflow,
  },
  {
    title: "Percepcao de valor",
    text: "A narrativa sai de software com IA para operacao pronta, depois para renda recorrente, ativo proprio e escala premium.",
    icon: Gem,
  },
  {
    title: "Ancoragem e preco",
    text: "As ancoras mais fortes aparecem quando o cliente ja percebe risco, custo de construcao e oportunidade economica.",
    icon: Target,
  },
  {
    title: "Fluxo da esteira",
    text: "A escada evita fuga de valor: quem quer praticidade sobe, quem quer receita sobe, quem quer controle sobe, quem quer escala sobe.",
    icon: Rocket,
  },
];

function SignalPill({ signal }: { signal: SignalKey }) {
  const config = signalMap[signal];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase ${config.className}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

function DetailBlock({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">{label}</p>
      <p
        className={`mt-2 text-sm leading-6 ${emphasis ? "font-semibold text-white" : "text-slate-300"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function EsteiraPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0F19] text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/14 blur-[120px]" />
        <div className="absolute right-[-8%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/10 blur-[140px]" />
        <div className="absolute bottom-[-16%] left-[24%] h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1800px] flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10 xl:px-12 xl:py-10">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_-42px_rgba(14,165,233,0.3)] backdrop-blur-2xl sm:p-8"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                <Sparkles className="size-3.5" />
                Future Flow | Strategic Funnel View
              </span>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
                Visualizacao premium da esteira completa da Future Flow.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Uma leitura interna para avaliar progressao psicologica, percepcao
                de valor, escalada de ofertas, congruencia, preco, ancoragem e
                fluxo de monetizacao em modo dashboard executivo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                  Entrada
                </p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                  Recorrencia com IA
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  O front posiciona software, metodo e comunidade como base da
                  maquina.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                  Topo da escada
                </p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                  High ticket de escala
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  O final da esteira concentra estrutura, proximidade e execucao
                  premium.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {overview.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 * index,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-[26px] border border-white/8 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Timeline da esteira
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                O funil sobe de adesao para escala com progressao clara de valor.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                Os cards abaixo mostram a escada completa, com preco, tipo de
                oferta, narrativa principal, ancoragem e o proximo salto
                psicologico de cada etapa.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {Object.keys(signalMap).map((signal) => (
                <SignalPill key={signal} signal={signal as SignalKey} />
              ))}
            </div>
          </div>

          <div className="relative mt-8">
            <div className="absolute left-[25px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/80 to-amber-300/0 xl:hidden" />
            <div className="absolute left-16 right-16 top-4 hidden h-px bg-gradient-to-r from-cyan-400/0 via-cyan-300/80 to-amber-300/0 xl:block" />

            <div className="relative flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-5">
              {offers.map((offer, index) => {
                const Icon = offer.icon;

                return (
                  <Fragment key={offer.name}>
                    <div className="relative pl-14 xl:flex-1 xl:pl-0 xl:pt-9">
                      <div className="absolute left-[11px] top-8 flex size-7 items-center justify-center rounded-full border border-white/15 bg-[#0B0F19] text-[11px] font-semibold text-slate-200 shadow-[0_0_24px_rgba(34,211,238,0.16)] xl:left-1/2 xl:top-0 xl:-translate-x-1/2">
                        {index + 1}
                      </div>

                      <motion.article
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.08 * index,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{ y: -6, scale: 1.006 }}
                        className={`group relative flex h-full min-h-[620px] flex-col overflow-hidden rounded-[30px] border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl transition-all duration-300 sm:p-6 ${offer.theme.cardClass}`}
                        style={{
                          boxShadow: `0 32px 90px -44px ${offer.theme.glow}`,
                        }}
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${offer.theme.gradientClass}`}
                        />
                        <div className="relative flex h-full flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <span
                                className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${offer.theme.badgeClass}`}
                              >
                                {offer.stage}
                              </span>
                              <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                                Nome da oferta
                              </p>
                              <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-white">
                                {offer.name}
                              </h3>
                            </div>

                            <div
                              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${offer.theme.iconClass}`}
                            >
                              <Icon className="size-5" />
                            </div>
                          </div>

                          <div className="mt-6 rounded-[24px] border border-white/8 bg-black/20 p-4">
                            <div className="flex flex-col gap-3">
                              <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                  <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                                    Preco
                                  </p>
                                  <div className="mt-2 flex flex-wrap items-end gap-2">
                                    <span className="text-3xl font-semibold tracking-[-0.05em] text-white">
                                      {offer.price}
                                    </span>
                                    <span className="pb-1 text-sm text-slate-400">
                                      {offer.billing}
                                    </span>
                                  </div>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                                  {offer.kind}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                              Headline principal
                            </p>
                            <h4 className="mt-2 text-xl font-medium leading-tight tracking-[-0.03em] text-white">
                              {offer.headline}
                            </h4>
                            <p className="mt-3 text-sm leading-7 text-slate-300">
                              {offer.description}
                            </p>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-2">
                            {offer.signals.map((signal) => (
                              <SignalPill key={signal} signal={signal} />
                            ))}
                          </div>

                          <div className="mt-6">
                            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                              Bullet points
                            </p>
                            <ul className="mt-4 space-y-3">
                              {offer.bullets.map((bullet) => (
                                <li
                                  key={bullet}
                                  className="flex items-start gap-3 text-sm leading-6 text-slate-200"
                                >
                                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-cyan-200">
                                    <CheckCircle2 className="size-3.5" />
                                  </span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {offer.anchor ? (
                            <div className="mt-6 rounded-[22px] border border-amber-300/15 bg-amber-300/8 p-4">
                              <p className="text-[11px] uppercase tracking-[0.26em] text-amber-100/70">
                                Ancoragem
                              </p>
                              <p className="mt-2 text-sm font-medium leading-6 text-amber-100">
                                {offer.anchor}
                              </p>
                            </div>
                          ) : null}

                          <div className="mt-auto grid gap-3 pt-6 2xl:grid-cols-2">
                            <DetailBlock
                              label="Objetivo psicologico"
                              value={offer.psychology}
                              emphasis
                            />
                            <DetailBlock label="Proximo passo da escada" value={offer.nextStep} />
                          </div>
                        </div>
                      </motion.article>
                    </div>

                    {index < offers.length - 1 ? (
                      <div className="relative ml-14 flex h-8 items-center xl:ml-0 xl:h-auto xl:w-9 xl:justify-center">
                        <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.2)]">
                          <ArrowDown className="size-4 xl:hidden" />
                          <ArrowRight className="hidden size-4 xl:block" />
                        </div>
                      </div>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </motion.section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                <BrainCircuit className="size-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Escada psicologica
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                  A narrativa sobe em cinco estados mentais.
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-2">
              {psychologicalLadder.map((step, index) => (
                <Fragment key={step}>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.06 * index + 0.24,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                        Etapa {index + 1}
                      </p>
                      <p className="mt-1 text-lg font-medium tracking-[-0.03em] text-white">
                        {step}
                      </p>
                    </div>
                  </motion.div>

                  {index < psychologicalLadder.length - 1 ? (
                    <div className="ml-5 flex h-8 items-center">
                      <div className="h-full w-px bg-gradient-to-b from-cyan-300/70 to-transparent" />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-200">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Leitura estrategica
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                  O desenho da esteira faz a monetizacao parecer inevitavel.
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              {insights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08 * index + 0.32,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-[24px] border border-white/8 bg-black/20 p-5"
                  >
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

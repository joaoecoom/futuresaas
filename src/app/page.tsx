"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type QuizStep = {
  title: string;
  subtitle?: string;
  options: string[];
};

/** Botao de checkout na VSL so depois deste tempo de reproducao (mm:ss). */
const VSL_UNLOCK_AT_SECONDS = 4 * 60 + 18;

const quizSteps: QuizStep[] = [
  {
    title:
      "No Final Deste Mini Quiz Vai Receber Acesso a Uma Demonstracao Especial da Maquina de Mensalidades(TM)",
    subtitle: "Complete as proximas etapas para desbloquear o acesso.",
    options: ["Sim, quero descobrir", "Nao tenho interesse"],
  },
  {
    title: "Você é?",
    options: ["Homem", "Mulher"],
  },
  {
    title: "Qual sua idade?",
    options: ["18 - 25 anos", "26 - 35 anos", "36 - 45 anos", "46+ anos"],
  },
  {
    title: "Qual e o seu objetivo principal?",
    subtitle: "Escolha a alternativa que melhor descreve sua busca atual.",
    options: [
      "Ter uma renda extra de R$ 800 por dia",
      "Substituir o meu salario atual",
      "Ter liberdade financeira",
      "Trabalhar de casa no meu tempo",
      "Comecar o meu negocio online",
    ],
  },
  {
    title: "Qual sua situacao atual?",
    options: [
      "Trabalho CLT e quero renda extra",
      "Desempregada(o) buscando oportunidade",
      "Autonomo querendo aumentar a renda",
      "Aposentado com tempo livre",
      "Buscando liberdade no digital",
    ],
  },
  {
    title: "O que te motiva a querer ganhar dinheiro online agora?",
    subtitle: "Seja sincero(a), isso vai nos ajudar a personalizar sua estrategia:",
    options: [
      "Pagar as dividas e sair do vermelho",
      "Conquistar independencia financeira",
      "Realizar um sonho especifico",
      "Ter mais tempo com a familia",
      "Melhorar meu padrao de vida",
    ],
  },
  {
    title: "Como voce se sente em relacao a ganhar dinheiro online hoje?",
    options: [
      "Frustrado(a) — ja tentei e nao deu ✅ Mas quero uma chance real",
      "Confuso(a) — nao sei por onde comecar 🧭 Mas vou aprender o certo",
      "Cetico(a) — parece bom demais 🤨 Mas quero ver funcionando",
      "Animado(a), mas inseguro(a) 💸 Tenho medo de perder dinheiro",
      "Desesperado(a) — preciso de resultado agora 🚨 Vou fazer o necessario",
    ],
  },
  {
    title: "Voce esta satisfeito(a) com sua renda atual?",
    options: [
      "Não — preciso ganhar mais agora ⚡ Vou mudar isso em 2026",
      "Não — tenho medo de arriscar 🛡️ Mesmo assim vou tentar diferente",
      "Poderia ser melhor 💰 Quero renda extra sem complicação",
      "Não tenho renda hoje 🎯 Vou buscar minha primeira venda",
    ],
  },
  {
    title: "O que te impediu de ganhar dinheiro online ate agora?",
    subtitle: "Selecione o principal obstaculo",
    options: [
      "Nao sabia por onde comecar",
      "Perdi dinheiro com anuncios",
      "Metodos muito complicados",
      "Medo de aparecer em videos",
      "Falta de tempo e dinheiro para investir",
      "Tentei e nao funcionou",
    ],
  },
  {
    title: 'Qual e o seu "sonho de vida" que o dinheiro tornaria possivel?',
    subtitle: "Imagine que voce esta ganhando R$1000/dia com o sistema...",
    options: [
      "Viajar o mundo sem preocupacao",
      "Comprar a casa/carro dos meus sonhos",
      "Dar uma vida melhor para quem eu amo",
      "Sair do CLT e ter liberdade",
      "Ter tranquilidade e seguranca financeira",
      "Investir em mim mesma(o)",
    ],
  },
  {
    title: "Quanto voce quer estar ganhando por dia daqui a 30 dias?",
    subtitle: "Seja ambicioso(a) mas realista com seu esforco",
    options: [
      "Entre R$150 a 300 por dia",
      "Entre R$450 a 700 por dia",
      "Entre R$750 a 1000 por dia",
      "Entre R$1.000 a 2.000 por dia",
      "Acima de R$3.000 por dia",
    ],
  },
  {
    title: "Quanto tempo por dia voce pode dedicar?",
    options: [
      "Entre 10 a 30 minutos (começo rápido)",
      "Entre 1 a 2 horas (ideal para resultados)",
      "Entre 2 a 3 horas (ideal para quem quer faturar alto)",
      "Mais de 4 horas (dedicação total)",
    ],
  },
];

export default function Home() {
  const [step, setStep] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const resultStep = quizSteps.length;
  const vslStep = quizSteps.length + 1;
  const currentStep = quizSteps[step];
  const progress = useMemo(() => {
    const total = quizSteps.length + 2;
    const current = Math.max(0, step + 1);
    return Math.min(100, Math.round((current / total) * 100));
  }, [step]);

  const vslUrl =
    process.env.NEXT_PUBLIC_VSL_URL?.trim() || "/vsl.mp4";

  const isDirectVideoSrc = (url: string) => {
    const path = url.split(/[?#]/)[0]?.toLowerCase() ?? "";
    return /\.(mp4|webm|ogg|m4v)$/i.test(path);
  };

  const [vslCheckoutUnlocked, setVslCheckoutUnlocked] = useState(false);

  const maybeUnlockVslCheckout = (video: HTMLVideoElement) => {
    if (video.currentTime >= VSL_UNLOCK_AT_SECONDS) {
      setVslCheckoutUnlocked(true);
    }
  };

  const vslVideoRef = useRef<HTMLVideoElement | null>(null);
  const [vslVideoPlaying, setVslVideoPlaying] = useState(false);

  const toggleVslPlayback = () => {
    const el = vslVideoRef.current;
    if (!el) return;
    void (el.paused ? el.play() : el.pause());
  };

  const goNext = (index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      setSelectedIndex(null);
      setStep((prev) => prev + 1);
    }, 180);
  };

  const maxStep = vslStep;
  const goToStep = (nextStep: number) => {
    const boundedStep = Math.max(-1, Math.min(maxStep, nextStep));
    setSelectedIndex(null);
    if (boundedStep === vslStep) {
      setVslCheckoutUnlocked(!isDirectVideoSrc(vslUrl));
      setVslVideoPlaying(false);
    }
    setStep(boundedStep);
  };

  const enterVslStep = () => {
    setVslCheckoutUnlocked(!isDirectVideoSrc(vslUrl));
    setVslVideoPlaying(false);
    setStep(vslStep);
  };

  const isResultStep = step === resultStep;
  const isVslStep = step === vslStep;

  const getOptionEmoji = (stepIndex: number, optionIndex: number) => {
    if (stepIndex === 1 && optionIndex === 0) return "👱";
    if (stepIndex === 1 && optionIndex === 1) return "👸";
    if (stepIndex === 3 && optionIndex === 0) return "💰";
    if (stepIndex === 3 && optionIndex === 1) return "🔁";
    if (stepIndex === 3 && optionIndex === 2) return "🕊️";
    if (stepIndex === 3 && optionIndex === 3) return "😎";
    if (stepIndex === 3 && optionIndex === 4) return "💸";
    if (stepIndex === 6 && optionIndex === 0) return "😤";
    if (stepIndex === 6 && optionIndex === 1) return "🤔";
    if (stepIndex === 6 && optionIndex === 2) return "🧐";
    if (stepIndex === 6 && optionIndex === 3) return "🤯";
    if (stepIndex === 6 && optionIndex === 4) return "🚨";
    if (stepIndex === 7 && optionIndex === 0) return "🙅";
    if (stepIndex === 7 && optionIndex === 1) return "🤔";
    if (stepIndex === 7 && optionIndex === 2) return "💸";
    if (stepIndex === 7 && optionIndex === 3) return "🚀";
    if (stepIndex === 8 && optionIndex === 0) return "🧩";
    if (stepIndex === 8 && optionIndex === 1) return "💸";
    if (stepIndex === 8 && optionIndex === 2) return "🧠";
    if (stepIndex === 8 && optionIndex === 3) return "🙈";
    if (stepIndex === 8 && optionIndex === 4) return "⏰";
    if (stepIndex === 8 && optionIndex === 5) return "😤";
    if (stepIndex === 0 && optionIndex === 0) return "✅";
    if (stepIndex === 0 && optionIndex === 1) return "❌";
    return null;
  };

  const getOptionImage = (stepIndex: number, optionIndex: number) => {
    if (stepIndex === 4) {
      const images = [
        "/quiz-situacao-1.png",
        "/quiz-situacao-2.png",
        "/quiz-situacao-3.png",
        "/quiz-situacao-4.png",
        "/quiz-situacao-5.png",
      ];
      return images[optionIndex] || null;
    }
    if (stepIndex === 9) {
      const images = [
        "/quiz-sonho-1.png",
        "/quiz-sonho-2.png",
        "/quiz-sonho-3.png",
        "/quiz-sonho-4.png",
        "/quiz-sonho-5.png",
        "/quiz-sonho-6.png",
      ];
      return images[optionIndex] || null;
    }
    return null;
  };

  const devNav = (
    <div className="quizDevNav">
      <button
        className="quizDevBtn"
        onClick={() => goToStep(step - 1)}
        disabled={step <= -1}
      >
        ← Etapa anterior
      </button>
      <select
        className="quizDevSelect"
        value={step}
        onChange={(event) => goToStep(Number(event.target.value))}
      >
        <option value={-1}>Intro</option>
        {quizSteps.map((_, index) => (
          <option key={index} value={index}>
            Etapa {index + 1}
          </option>
        ))}
        <option value={resultStep}>Resultado final</option>
        <option value={vslStep}>VSL</option>
      </select>
      <button
        className="quizDevBtn"
        onClick={() => goToStep(step + 1)}
        disabled={step >= maxStep}
      >
        Proxima etapa →
      </button>
    </div>
  );

  if (step === -1) {
    return (
      <main className="quizRoot">
        <div className="quizCard quizCardIntro">
          {devNav}
          <div className="quizProgress">
            <div className="quizProgressFill" style={{ width: `${progress}%` }} />
          </div>
          <h1 className="quizHeroTitle">
            <span className="quizHeroTitleLine">
              Descubra como a Maquina de Mensalidades
            </span>
            <span className="quizHeroTitleLine">cria uma nova fonte de</span>
            <span className="quizHeroTitleLine">
              <span className="quizHeroHighlight">renda previsivel</span> com IA
              + WhatsApp.
            </span>
          </h1>
          <p className="quizHeroText">
            Sem aparecer, sem criar conteudo e sem precisar de seguidores.
          </p>
          <Image
            src="/quiz-hero-etapa-1.png"
            alt="Exemplo de resultado com automacao"
            width={716}
            height={1104}
            className="quizHeroImage"
            priority
          />
          <button className="quizCta quizCtaIntro" onClick={() => setStep(0)}>
            COMECAR AGORA
          </button>
          <p className="quizSocialProof">
            Mais de 1347 pessoas ja descobriram seu potencial.
          </p>
        </div>
      </main>
    );
  }

  if (isResultStep) {
    return (
      <main className="quizRoot">
        <div className="quizCard">
          {devNav}
          <div className="quizProgress">
            <div className="quizProgressFill" style={{ width: `${progress}%` }} />
          </div>
          <div className="quizAlert">
            Seu acesso a Maquina de Mensalidades foi liberado por tempo
            limitado.
          </div>
          <h2 className="quizTitle">Sua Jornada nos Próximos 30 Dias</h2>
          <p className="quizSubtitle">
            Baseado nas suas respostas, criamos a estratégia perfeita para VOCÊ
          </p>
          <div className="quizChartWrap">
            <div className="quizChart" key={`chart-${step}`}>
              <div className="quizChartGrid" />
              <svg
                className="quizChartSvg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="quizLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="quizAreaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#facc15" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <polygon
                  className="quizChartAreaPolygon"
                  points="0,100 100,100 100,0"
                  fill="url(#quizAreaGradient)"
                />
                <line
                  className="quizChartLinePath"
                  x1="0"
                  y1="100"
                  x2="100"
                  y2="0"
                  stroke="url(#quizLineGradient)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className="quizChartDotStart" />
              <span className="quizChartDotEnd" />
              <span className="quizChartY top">100</span>
              <span className="quizChartY midTop">75</span>
              <span className="quizChartY mid">50</span>
              <span className="quizChartY midBottom">25</span>
              <span className="quizChartY bottom">0</span>
            </div>
            <div className="quizChartXAxis">
              <span>R$ 0 por dia</span>
              <span>R$800/dia</span>
            </div>
          </div>
          <div className="quizResultGrid">
            <div className="quizResultBox">
              <div className="quizResultMeter" aria-hidden="true">
                <span className="quizResultMeterLabel">10%</span>
                <span className="quizResultMeterTrack">
                  <span className="quizResultMeterFill quizResultMeterFillLow" />
                </span>
              </div>
              <strong>Onde voce esta hoje</strong>
              <span>R$0 por dia</span>
            </div>
            <div className="quizResultBox quizResultBoxActive">
              <div className="quizResultMeter" aria-hidden="true">
                <span className="quizResultMeterLabel quizResultMeterLabelActive">
                  100%
                </span>
                <span className="quizResultMeterTrack">
                  <span className="quizResultMeterFill quizResultMeterFillHigh" />
                </span>
              </div>
              <strong>Onde voce vai estar em 30 dias</strong>
              <span>R$1000 por dia</span>
            </div>
          </div>
          <p className="quizTutorialCallout">
            Para desbloquear seu acesso a{" "}
            <strong>SISTEMA MAQUINA DE MENSALIDADES</strong> clique no botao abaixo
            e <span>assista o tutorial de acesso</span>
          </p>
          <button className="quizCta" onClick={enterVslStep}>
            CONTINUAR
          </button>
        </div>
      </main>
    );
  }

  if (isVslStep) {
    return (
      <main className="quizRoot">
        <div className="quizCard">
          {devNav}
          <div className="quizProgress">
            <div className="quizProgressFill" style={{ width: "100%" }} />
          </div>
          <div className="quizVslHead">
            <h2 className="quizVslTitle">Assista a apresentacao completa</h2>
            <p className="quizVslScarcity">
              Oferta por tempo limitado — vagas reduzidas nesta rodada
            </p>
            <p className="quizVslSubtitle">
              Assista agora: este acesso promocional pode ser encerrado sem aviso.
              Veja o video e descubra como aplicar a{" "}
              <span className="quizInlineHighlight">Maquina de Mensalidades</span>{" "}
              ao seu caso antes que fechemos esta janela.
            </p>
          </div>
          <div className="quizVslWrap">
            {isDirectVideoSrc(vslUrl) ? (
              <>
                <video
                  ref={vslVideoRef}
                  className="quizVslVideo"
                  src={vslUrl}
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  onClick={toggleVslPlayback}
                  onPlay={() => setVslVideoPlaying(true)}
                  onPause={() => setVslVideoPlaying(false)}
                  onTimeUpdate={(event) =>
                    maybeUnlockVslCheckout(event.currentTarget)
                  }
                  onSeeked={(event) =>
                    maybeUnlockVslCheckout(event.currentTarget)
                  }
                >
                  Seu navegador nao suporta reproducao de video HTML5.
                </video>
                {!vslVideoPlaying ? (
                  <button
                    type="button"
                    className="quizVslPlayOverlay"
                    aria-label="Aperte play para continuar"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleVslPlayback();
                    }}
                  >
                    <span className="quizVslPlayPulseWrap">
                      <Image
                        src="/vsl-play-overlay.png"
                        alt=""
                        width={960}
                        height={540}
                        className="quizVslPlayImage"
                        priority
                      />
                    </span>
                  </button>
                ) : null}
              </>
            ) : (
              <iframe
                className="quizVslFrame"
                src={vslUrl}
                title="Video de vendas"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>
          {vslCheckoutUnlocked ? (
            <Link className="quizCta" href="/checkout?offer=front-147">
              DESBLOQUEAR ACESSO
            </Link>
          ) : (
            <p className="quizVslCtaHint">
              Assista ate <strong>04:18</strong> para desbloquear o botao abaixo.
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="quizRoot">
      <div className="quizCard">
        {devNav}
        <div className="quizTopBar">
          <button className="quizBack" onClick={() => setStep((s) => s - 1)}>
            ←
          </button>
          <div className="quizProgress">
            <div className="quizProgressFill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {step === 0 ? (
          <>
            <h2 className="quizCommitHeadline">
              🎁 No Final Deste Mini Quiz Vai Receber Acesso a Uma Demonstracao
              Especial da Maquina de Mensalidades
            </h2>
            <p className="quizCommitSubtext">
              Complete as proximas etapas para desbloquear o acesso.
            </p>
            <p className="quizCommitQuestion">
              Compromete-se a responder as proximas perguntas com honestidade?
            </p>
          </>
        ) : (
          <>
            <h2
              className={`quizTitle ${step === 4 ? "quizTitleSituation" : ""} ${step === 5 ? "quizTitleMotivation" : ""} ${step === 6 ? "quizTitleFeeling" : ""} ${step === 8 ? "quizTitleBlocked" : ""} ${step === 9 ? "quizTitleDream" : ""} ${step === 10 ? "quizTitleGoal" : ""} ${step === 11 ? "quizTitleTime" : ""}`}
            >
              {step === 4 ? (
                "Qual sua situação atual?"
              ) : step === 11 ? (
                <>
                  Quanto tempo POR DIA você pode dedicar ao{" "}
                  <span className="quizInlineHighlight">
                    Máquina de Mensalidades
                  </span>
                  ?
                </>
              ) : step === 10 ? (
                <>
                  Quanto <span className="quizInlineHighlight">você quer</span>{" "}
                  estar GANHANDO por dia daqui a 30 dias?
                </>
              ) : (
                currentStep.title
              )}
            </h2>
            {currentStep.subtitle ? (
              <p
                className={`quizSubtitle ${step === 5 ? "quizSubtitleMotivation" : ""} ${step === 8 ? "quizSubtitleBlocked" : ""} ${step === 9 ? "quizSubtitleDream" : ""} ${step === 10 ? "quizSubtitleGoal" : ""}`}
              >
                {currentStep.subtitle}
              </p>
            ) : null}
          </>
        )}
        <div
          className={`quizOptions ${step === 0 || step === 1 ? "quizOptionsInline" : ""}`}
        >
          {currentStep.options.map((option, index) => (
            <button
              key={option}
              className={`quizOption ${selectedIndex === index ? "selected" : ""} ${step === 0 ? "quizOptionPremium" : ""} ${step === 1 ? "quizOptionGender" : ""} ${step === 2 ? "quizOptionAge" : ""} ${step === 3 ? "quizOptionObjective" : ""} ${step === 4 ? "quizOptionSituation" : ""} ${step === 5 ? "quizOptionMotivation" : ""} ${step === 6 ? "quizOptionFeeling" : ""} ${step === 7 ? "quizOptionIncome" : ""} ${step === 8 ? "quizOptionBlocked" : ""} ${step === 9 ? "quizOptionDream" : ""} ${step === 10 ? "quizOptionGoal" : ""} ${step === 11 ? "quizOptionTime" : ""}`}
              onClick={() => goNext(index)}
            >
              {step === 1 ? (
                <>
                  <span className="quizOptionGenderEmoji">
                    {getOptionEmoji(step, index)}
                  </span>
                  <span className="quizOptionGenderFooter">
                    <span className="quizOptionRadio" />
                    <span className="quizOptionText">{option}</span>
                  </span>
                </>
              ) : step === 3 ? (
                <>
                  <span className="quizOptionObjectiveEmoji">
                    {getOptionEmoji(step, index)}
                  </span>
                  <span className="quizOptionCheckbox" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 4 ? (
                <>
                  <Image
                    src={getOptionImage(step, index) || "/quiz-situacao-1.png"}
                    alt={option}
                    width={96}
                    height={64}
                    className="quizOptionSituationImage"
                  />
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 5 ? (
                <>
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 6 ? (
                <>
                  <span className="quizOptionFeelingEmoji">
                    {getOptionEmoji(step, index)}
                  </span>
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 7 ? (
                <>
                  <span className="quizOptionIncomeEmoji">
                    {getOptionEmoji(step, index)}
                  </span>
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 8 ? (
                <>
                  <span className="quizOptionBlockedEmoji">
                    {getOptionEmoji(step, index)}
                  </span>
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 9 ? (
                <>
                  <Image
                    src={getOptionImage(step, index) || "/quiz-sonho-1.png"}
                    alt={option}
                    width={96}
                    height={64}
                    className="quizOptionSituationImage"
                  />
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 10 ? (
                <>
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : step === 11 ? (
                <>
                  <span className="quizOptionRadio" />
                  <span className="quizOptionText">{option}</span>
                </>
              ) : (
                <>
                  {getOptionEmoji(step, index) ? (
                    <span className="quizOptionEmoji">
                      {getOptionEmoji(step, index)}
                    </span>
                  ) : null}
                  <span className="quizOptionText">{option}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

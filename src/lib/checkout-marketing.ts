/**
 * Copy editável do checkout low ticket.
 * Opcional: NEXT_PUBLIC_CHECKOUT_BANNER_URL para substituir o banner local.
 */

export type CheckoutMarketingCopy = {
  bannerSrc: string;
  bannerAlt: string;
  summaryBadge: string;
  /** Headline principal do card de oferta */
  summaryTitleTemplate: string;
  /** Subtítulo (premium, curto). Se vazio, usa a descrição da oferta. */
  summarySubtitle: string;
  includedBullets: string[];
  /** Sufixo do preço (ex. /mês). Vazio para omitir. */
  priceBillingSuffix: string;
  priceCancelNote: string;
  guaranteeBody: string;
  testimonialStars: number;
  testimonialQuote: string;
  testimonialAttribution?: string;
  testimonialSocialBadge: string;
  urgencyLine: string;
  primaryCtaLabel: string;
  primaryCtaLoadingLabel: string;
};

function envBannerUrl() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CHECKOUT_BANNER_URL) {
    return process.env.NEXT_PUBLIC_CHECKOUT_BANNER_URL;
  }
  return "/checkout-banner.png";
}

export const checkoutMarketingDefaults: CheckoutMarketingCopy = {
  bannerSrc: envBannerUrl(),
  bannerAlt:
    "Oferta exclusiva: automação com IA e WhatsApp, preço único, garantia de 7 dias e pagamento seguro.",
  summaryBadge: "ACESSO IMEDIATO",
  summaryTitleTemplate: "O seu acesso completo à ferramenta",
  summarySubtitle:
    "Automatize conversas, qualifique leads e escale com IA — com o mesmo sistema que empresas pagam todos os meses.",
  includedBullets: [
    "Acesso imediato à plataforma",
    "Fluxos prontos para usar",
    "Atualizações incluídas",
    "Comunidade exclusiva",
    "Treinamentos completos",
    "Garantia de 7 dias",
  ],
  priceBillingSuffix: "/mês",
  priceCancelNote: "Cancele quando quiser",
  guaranteeBody:
    "Teste sem risco por 7 dias. Se não for para si, pode pedir reembolso dentro do prazo da garantia.",
  testimonialStars: 5,
  testimonialQuote:
    "Consegui colocar o sistema a funcionar no mesmo dia. Hoje já tenho empresas interessadas em automação.",
  testimonialAttribution: "Cliente verificado",
  testimonialSocialBadge: "+1.200 alunos",
  urgencyLine: "Oferta promocional disponível hoje.",
  primaryCtaLabel: "Quero acesso imediato",
  primaryCtaLoadingLabel: "A processar…",
};

export function marketingSummaryTitle(
  template: string,
  productName: string,
): string {
  return template.replace(/\{productName\}/g, productName);
}

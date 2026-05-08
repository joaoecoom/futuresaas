export type FunnelOffer = {
  id: string;
  name: string;
  description: string;
  amountInCents: number;
  currency: "brl";
  stripePriceId: string;
  toolProductId: string;
  toolAccessTag: string;
  webhookPlan?: string;
};

function parseOffersFromEnv(): FunnelOffer[] {
  const raw = process.env.QUIZ_OFFERS_JSON;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as FunnelOffer[];
    return parsed.filter(
      (offer) =>
        offer?.id &&
        offer?.name &&
        offer?.stripePriceId &&
        offer?.toolProductId &&
        offer?.toolAccessTag,
    );
  } catch {
    return [];
  }
}

const fallbackOffers: FunnelOffer[] = [
  {
    id: "entrada-147",
    name: "Plano Entrada",
    description: "Acesso inicial da ferramenta",
    amountInCents: 14700,
    currency: "brl",
    stripePriceId: process.env.STRIPE_PRICE_ID || "",
    toolProductId: process.env.TOOL_PRODUCT_ID || "produto_entrada_147",
    toolAccessTag: "acesso_entrada",
    webhookPlan: "pro",
  },
];

export const funnelOffers = parseOffersFromEnv().length
  ? parseOffersFromEnv()
  : fallbackOffers;

export function getOfferById(id?: string | null) {
  if (!id) return null;
  return funnelOffers.find((offer) => offer.id === id) || null;
}

export function formatPriceBRL(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

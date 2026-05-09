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
    name: "Front - Acesso à Ferramenta",
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

/** Substitui copy antiga no checkout. */
function normalizeCheckoutOfferDisplay(offer: FunnelOffer): FunnelOffer {
  const name = offer.name.replace(/Acesso App/gi, "Acesso à Ferramenta");
  return name === offer.name ? offer : { ...offer, name };
}

/**
 * Ofertas mostradas no checkout low ticket (resto do catálogo fica para upsell).
 * CHECKOUT_OFFER_IDS=id1,id2 (opcional). Por defeito: front-147 ou entrada-147.
 */
export function getCheckoutOffers(): FunnelOffer[] {
  const all = funnelOffers;
  const envRaw = process.env.CHECKOUT_OFFER_IDS;
  let picked: FunnelOffer[] = [];

  if (envRaw?.trim()) {
    const ids = new Set(
      envRaw.split(",").map((s) => s.trim()).filter(Boolean),
    );
    picked = all.filter((o) => ids.has(o.id));
  }

  if (!picked.length) {
    const preferred = ["front-147", "entrada-147"];
    for (const id of preferred) {
      const o = all.find((x) => x.id === id);
      if (o) {
        picked = [o];
        break;
      }
    }
  }

  if (!picked.length && all.length) {
    picked = [all[0]];
  }

  return picked.map(normalizeCheckoutOfferDisplay);
}

export const checkoutOffers = getCheckoutOffers();

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

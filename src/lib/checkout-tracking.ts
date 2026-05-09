export type CheckoutTrackPayload = {
  funnel_id?: string;
  step_id?: string;
  offer_id?: string;
  price?: number;
  currency?: string;
  session_id?: string;
  visitor_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
};

const VISITOR_KEY = "ff_visitor_id";
const SESSION_KEY = "ff_session_id";

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}

export function parseMarketingParams(
  searchParams: URLSearchParams,
): Partial<CheckoutTrackPayload> {
  return {
    funnel_id: searchParams.get("funnel_id") || undefined,
    step_id: searchParams.get("step_id") || undefined,
    utm_source: searchParams.get("utm_source") || undefined,
    utm_medium: searchParams.get("utm_medium") || undefined,
    utm_campaign: searchParams.get("utm_campaign") || undefined,
    utm_content: searchParams.get("utm_content") || undefined,
    utm_term: searchParams.get("utm_term") || undefined,
    fbclid: searchParams.get("fbclid") || undefined,
    gclid: searchParams.get("gclid") || undefined,
    ttclid: searchParams.get("ttclid") || undefined,
  };
}

export function buildCheckoutTrackingBase(
  searchParams: URLSearchParams,
  offer: { id: string; amountInCents: number; currency: string } | null,
): CheckoutTrackPayload {
  const fromUrl = parseMarketingParams(searchParams);
  const offerIdFromQuery = searchParams.get("offer_id");
  return {
    ...fromUrl,
    visitor_id: getOrCreateVisitorId(),
    session_id: getOrCreateSessionId(),
    offer_id: offer?.id || offerIdFromQuery || undefined,
    price: offer ? offer.amountInCents / 100 : undefined,
    currency: offer?.currency?.toUpperCase(),
  };
}

export type CheckoutTrackEventName =
  | "checkout_viewed"
  | "checkout_started"
  | "checkout_cta_clicked"
  | "payment_started"
  | "payment_success"
  | "payment_failed";

export function trackCheckoutEvent(
  name: CheckoutTrackEventName,
  base: CheckoutTrackPayload,
  extra?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;

  const payload = {
    event: name,
    ...base,
    ...extra,
    ts: Date.now(),
  };

  window.dispatchEvent(new CustomEvent("checkout_track", { detail: payload }));

  type DataLayerItem = Record<string, unknown>;
  const w = window as Window & { dataLayer?: DataLayerItem[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(payload as DataLayerItem);
  }
}

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Define STRIPE_SECRET_KEY no ambiente.");
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: "2026-04-22.dahlia",
  });
  return stripeClient;
}

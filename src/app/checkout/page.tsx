import { funnelOffers } from "@/lib/offers";
import CheckoutClient from "./ui";

type CheckoutPageProps = {
  searchParams: Promise<{ offer?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const selectedOfferId = params.offer || funnelOffers[0]?.id;

  return <CheckoutClient offers={funnelOffers} selectedOfferId={selectedOfferId} />;
}

import { Suspense } from "react";
import { checkoutOffers } from "@/lib/offers";
import CheckoutClient from "./ui";

type CheckoutPageProps = {
  searchParams: Promise<{ offer?: string }>;
};

function CheckoutFallback() {
  return (
    <main className="checkoutRoot">
      <div className="checkoutInner">
        <p className="checkoutLoadingText">A carregar checkout…</p>
      </div>
    </main>
  );
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const allowed = new Set(checkoutOffers.map((o) => o.id));
  const requested = params.offer;
  const selectedOfferId =
    requested && allowed.has(requested)
      ? requested
      : checkoutOffers[0]?.id;

  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient offers={checkoutOffers} selectedOfferId={selectedOfferId} />
    </Suspense>
  );
}

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CheckoutHeroBanner from "@/components/checkout/CheckoutHeroBanner";
import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";
import OfferSummary from "@/components/checkout/OfferSummary";
import SecurePaymentNotice from "@/components/checkout/SecurePaymentNotice";
import SocialProofBox from "@/components/checkout/SocialProofBox";
import TrustBadges from "@/components/checkout/TrustBadges";
import UrgencyStrip from "@/components/checkout/UrgencyStrip";
import { checkoutMarketingDefaults } from "@/lib/checkout-marketing";
import {
  buildCheckoutTrackingBase,
  trackCheckoutEvent,
  type CheckoutTrackPayload,
} from "@/lib/checkout-tracking";
import { formatPriceBRL, type FunnelOffer } from "@/lib/offers";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

const marketing = checkoutMarketingDefaults;

type CheckoutClientProps = {
  offers: FunnelOffer[];
  selectedOfferId?: string;
};

export default function CheckoutClient({
  offers,
  selectedOfferId,
}: CheckoutClientProps) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const searchParams = useSearchParams();
  const startedSent = useRef(false);

  const phoneCountries = [
    { code: "+55", label: "Brasil (+55)" },
    { code: "+351", label: "Portugal (+351)" },
    { code: "+1", label: "EUA/Canada (+1)" },
    { code: "+34", label: "Espanha (+34)" },
  ];

  const [offerId, setOfferId] = useState(selectedOfferId || offers[0]?.id || "");
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === offerId) || offers[0],
    [offers, offerId],
  );

  const trackingBase: CheckoutTrackPayload = useMemo(
    () => buildCheckoutTrackingBase(searchParams, selectedOffer ?? null),
    [searchParams, selectedOffer],
  );

  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("+55");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    trackCheckoutEvent(
      "checkout_viewed",
      buildCheckoutTrackingBase(searchParams, selectedOffer ?? null),
    );
    // Intentionally só na primeira montagem da página de checkout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clientSecret && !startedSent.current) {
      startedSent.current = true;
      trackCheckoutEvent("checkout_started", trackingBase);
    }
    if (!clientSecret) {
      startedSent.current = false;
    }
  }, [clientSecret, trackingBase]);

  const initializePayment = async () => {
    if (!selectedOffer) {
      setError("Nenhuma oferta disponível.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId: selectedOffer.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao iniciar pagamento na Stripe.");
      }

      const data = (await response.json()) as {
        clientSecret?: string;
        paymentIntentId?: string;
      };

      if (!data.clientSecret || !data.paymentIntentId) {
        throw new Error("Não foi possível obter dados de pagamento.");
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado no checkout.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId]);

  if (!publishableKey) {
    return (
      <main className="checkoutRoot">
        <div className="checkoutInner">
          <section className="checkoutCard checkoutCardError">
            <p className="error">
              Falta definir NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no ambiente.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!selectedOffer) {
    return (
      <main className="checkoutRoot">
        <div className="checkoutInner">
          <section className="checkoutCard checkoutCardError">
            <p className="error">Nenhuma oferta configurada.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="checkoutRoot">
      <div className="checkoutInner">
        <CheckoutHeroBanner
          src={marketing.bannerSrc}
          alt={marketing.bannerAlt}
          priority
        />

        <OfferSummary
          copy={marketing}
          productName={selectedOffer.name}
          description={selectedOffer.description}
          amountInCents={selectedOffer.amountInCents}
        />

        <SocialProofBox
          stars={marketing.testimonialStars}
          quote={marketing.testimonialQuote}
          attribution={marketing.testimonialAttribution}
          socialBadge={marketing.testimonialSocialBadge}
        />

        <UrgencyStrip text={marketing.urgencyLine} />

        <section className="checkoutCard" aria-labelledby="checkout-form-heading">
          <h2 id="checkout-form-heading" className="checkoutFormHeading">
            Dados para acesso imediato
          </h2>
          <p className="checkoutFormSub">
            <strong className="checkoutFormPriceLine">
              {new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(selectedOffer.amountInCents / 100)}{" "}
              mês
            </strong>
          </p>
          <p className="checkoutFormIntro">
            Escolha o seu país, adicione o seu número de WhatsApp e o seu melhor
            email.
          </p>

          {offers.length > 1 ? (
            <>
              <label className="checkoutFieldLabel" htmlFor="checkout-offer">
                Plano
              </label>
              <select
                id="checkout-offer"
                className="input"
                value={offerId}
                onChange={(event) => {
                  setOfferId(event.target.value);
                  setClientSecret("");
                  setPaymentIntentId("");
                  setError("");
                }}
              >
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} — {formatPriceBRL(offer.amountInCents)}
                  </option>
                ))}
              </select>
            </>
          ) : null}

          <div className="phoneRow">
            <select
              className="input country"
              value={phoneCountry}
              onChange={(event) => setPhoneCountry(event.target.value)}
              aria-label="Indicativo"
            >
              {phoneCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="nº Whatsapp"
              className="input"
              autoComplete="tel"
            />
          </div>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="o seu email"
            className="input"
            autoComplete="email"
          />

          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#059669",
                    borderRadius: "12px",
                  },
                },
              }}
            >
              <CheckoutPaymentForm
                paymentIntentId={paymentIntentId}
                offerId={selectedOffer.id}
                email={email}
                phoneCountry={phoneCountry}
                phoneNumber={phoneNumber}
                trackingBase={trackingBase}
                guaranteeBody={marketing.guaranteeBody}
                primaryCtaLabel={marketing.primaryCtaLabel}
                primaryCtaLoadingLabel={marketing.primaryCtaLoadingLabel}
              />
            </Elements>
          ) : (
            <button className="button checkoutCtaButton" type="button" disabled>
              {isLoading ? "A preparar pagamento seguro…" : "A carregar checkout…"}
            </button>
          )}

          {error ? <p className="error">{error}</p> : null}

          <SecurePaymentNotice />
          <TrustBadges />
        </section>
      </div>
    </main>
  );
}

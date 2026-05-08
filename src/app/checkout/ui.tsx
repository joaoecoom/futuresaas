"use client";

import { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { formatPriceBRL, type FunnelOffer } from "@/lib/offers";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type CheckoutClientProps = {
  offers: FunnelOffer[];
  selectedOfferId?: string;
};

export default function CheckoutClient({
  offers,
  selectedOfferId,
}: CheckoutClientProps) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const phoneCountries = [
    { code: "+55", label: "Brasil (+55)" },
    { code: "+351", label: "Portugal (+351)" },
    { code: "+1", label: "EUA/Canada (+1)" },
    { code: "+34", label: "Espanha (+34)" },
  ];

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) || offers[0],
    [offers, selectedOfferId],
  );

  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("+55");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startPayment = async () => {
    if (!selectedOffer) {
      setError("Nenhuma oferta disponivel.");
      return;
    }

    if (!email.trim()) {
      setError("Preenche o email para receber o acesso.");
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (!phoneCountry || digitsOnly.length < 8) {
      setError("Preenche pais e numero de WhatsApp validos.");
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
          email,
          offerId: selectedOffer.id,
          phoneCountry,
          phoneNumber: digitsOnly,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao iniciar pagamento na Stripe.");
      }

      const data = (await response.json()) as { clientSecret?: string };

      if (!data.clientSecret) {
        throw new Error("Nao foi possivel obter dados de pagamento.");
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado no checkout.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!publishableKey) {
    return (
      <main className="container">
        <section className="card">
          <p className="error">
            Falta definir NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no ambiente.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="card">
        <Image
          src="/logo-future-saas.png"
          alt="Future SaaS logo"
          width={420}
          height={180}
          className="brandLogo"
          priority
        />
        <p className="kicker">Checkout</p>
        <h1>Finalizar compra</h1>
        <p className="description">
          Clique para abrir o checkout hospedado pela Stripe.
        </p>
        {selectedOffer ? (
          <div className="offerSummary">
            <strong>{selectedOffer.name}</strong>
            <span>{selectedOffer.description}</span>
            <span>{formatPriceBRL(selectedOffer.amountInCents)}</span>
          </div>
        ) : null}

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="teu@email.com"
          className="input"
          autoComplete="email"
        />

        <div className="phoneRow">
          <select
            className="input country"
            value={phoneCountry}
            onChange={(event) => setPhoneCountry(event.target.value)}
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
            placeholder="Numero WhatsApp"
            className="input"
            autoComplete="tel"
          />
        </div>

        {!clientSecret ? (
          <button className="button" onClick={startPayment} disabled={isLoading}>
            {isLoading ? "A preparar pagamento..." : "Continuar para pagamento"}
          </button>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "night" },
            }}
          >
            <PaymentForm />
          </Elements>
        )}

        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      setError("Pagamento ainda a inicializar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/sucesso`,
        },
      });

      if (result.error?.message) {
        setError(result.error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="paymentBox">
      <PaymentElement />
      <button className="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "A processar..." : "Pagar agora"}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

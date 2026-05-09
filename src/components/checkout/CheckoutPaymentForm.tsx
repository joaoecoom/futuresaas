"use client";

import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import GuaranteeBox from "@/components/checkout/GuaranteeBox";
import type { CheckoutTrackPayload } from "@/lib/checkout-tracking";
import { trackCheckoutEvent } from "@/lib/checkout-tracking";

type Props = {
  paymentIntentId: string;
  offerId: string;
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  trackingBase: CheckoutTrackPayload;
  guaranteeBody: string;
  primaryCtaLabel: string;
  primaryCtaLoadingLabel: string;
};

export default function CheckoutPaymentForm({
  paymentIntentId,
  offerId,
  email,
  phoneCountry,
  phoneNumber,
  trackingBase,
  guaranteeBody,
  primaryCtaLabel,
  primaryCtaLoadingLabel,
}: Props) {
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

      const digitsOnly = phoneNumber.replace(/\D/g, "");
      if (!email.trim() || !phoneCountry || digitsOnly.length < 8) {
        setError("Preenche email e WhatsApp válidos antes de continuar.");
        setIsSubmitting(false);
        return;
      }

      trackCheckoutEvent("checkout_cta_clicked", trackingBase);

      const syncResponse = await fetch("/api/checkout", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          offerId,
          email,
          phoneCountry,
          phoneNumber: digitsOnly,
        }),
      });

      if (!syncResponse.ok) {
        const syncData = (await syncResponse.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(syncData?.error || "Falha ao validar dados do comprador.");
      }

      trackCheckoutEvent("payment_started", trackingBase);

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/sucesso?offer_id=${encodeURIComponent(offerId)}`,
        },
      });

      if (result.error?.message) {
        trackCheckoutEvent("payment_failed", trackingBase, {
          error_message: result.error.message,
        });
        setError(result.error.message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao processar pagamento.";
      trackCheckoutEvent("payment_failed", trackingBase, {
        error_message: message,
      });
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkoutPaymentBlock">
      <div className="paymentBox">
        <PaymentElement />
      </div>
      <GuaranteeBox body={guaranteeBody} />
      <button
        type="button"
        className="button checkoutCtaButton"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? primaryCtaLoadingLabel : primaryCtaLabel}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

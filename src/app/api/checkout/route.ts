import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getOfferById } from "@/lib/offers";
import { getStripeClient } from "@/lib/stripe";

type CheckoutPayload = {
  email?: string;
  offerId?: string;
  phoneCountry?: string;
  phoneNumber?: string;
  paymentIntentId?: string;
};

function normalizeContact(payload: CheckoutPayload) {
  const email = payload.email?.trim().toLowerCase();
  const phoneCountry = payload.phoneCountry?.trim();
  const phoneNumber = payload.phoneNumber?.replace(/\D/g, "").trim();
  const whatsappE164 =
    phoneCountry && phoneNumber ? `${phoneCountry}${phoneNumber}` : "";

  return { email, phoneCountry, phoneNumber, whatsappE164 };
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;
    const { email, phoneCountry, phoneNumber, whatsappE164 } = normalizeContact(
      payload || {},
    );
    const offer = getOfferById(payload?.offerId);
    const coproducerAccountId = process.env.COPRODUCER_ACCOUNT_ID;
    const ownerPercentRaw = process.env.SPLIT_OWNER_PERCENT ?? "70";
    const coproducerPercentRaw = process.env.SPLIT_COPRODUCER_PERCENT ?? "30";

    if (!offer?.stripePriceId) {
      return NextResponse.json(
        { error: "Oferta invalida ou sem stripePriceId." },
        { status: 400 },
      );
    }

    const ownerPercent = Number(ownerPercentRaw);
    const coproducerPercent = Number(coproducerPercentRaw);
    const hasCoproducer = Boolean(coproducerAccountId);

    if (
      hasCoproducer &&
      (!Number.isFinite(ownerPercent) || !Number.isFinite(coproducerPercent))
    ) {
      return NextResponse.json(
        { error: "Percentagens de split invalidas." },
        { status: 400 },
      );
    }

    if (hasCoproducer && ownerPercent + coproducerPercent !== 100) {
      return NextResponse.json(
        { error: "SPLIT_OWNER_PERCENT + SPLIT_COPRODUCER_PERCENT deve ser 100." },
        { status: 400 },
      );
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: offer.amountInCents,
      currency: "brl",
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      metadata: {
        buyer_email: email || "",
        buyer_phone_country: phoneCountry || "",
        buyer_phone_number: phoneNumber || "",
        buyer_whatsapp_e164: whatsappE164 || "",
        offer_id: offer.id,
        offer_name: offer.name,
        webhook_plan: offer.webhookPlan || offer.id,
        tool_product_id: offer.toolProductId,
        tool_access_tag: offer.toolAccessTag,
      },
    };

    let splitApplied = false;
    if (hasCoproducer) {
      if (!offer.amountInCents || offer.amountInCents <= 0) {
        return NextResponse.json(
          { error: "O preco da oferta e invalido para calcular split." },
          { status: 400 },
        );
      }

      const ownerAmount = Math.round((offer.amountInCents * ownerPercent) / 100);

      paymentIntentParams.application_fee_amount = ownerAmount;
      paymentIntentParams.transfer_data = {
        destination: coproducerAccountId!,
      };
      splitApplied = true;
    }

    let paymentIntent: Stripe.PaymentIntent;

    try {
      paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    } catch (error) {
      const stripeError = error as { code?: string; param?: string };
      const isInvalidDestination =
        stripeError.code === "resource_missing" &&
        stripeError.param === "transfer_data[destination]";

      if (!isInvalidDestination || !splitApplied) {
        throw error;
      }

      console.warn(
        "Conta de coprodutor ainda nao conectada. Pagamento criado sem split.",
      );

      const fallbackParams: Stripe.PaymentIntentCreateParams = {
        ...paymentIntentParams,
      };
      delete fallbackParams.application_fee_amount;
      delete fallbackParams.transfer_data;
      paymentIntent = await stripe.paymentIntents.create(fallbackParams);
    }

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Nao foi possivel obter client_secret do pagamento." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Erro Stripe payment intent:", error);
    return NextResponse.json(
      { error: "Nao foi possivel iniciar o pagamento." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const stripe = getStripeClient();
    const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;
    const offer = getOfferById(payload?.offerId);
    const paymentIntentId = payload?.paymentIntentId?.trim();
    const { email, phoneCountry, phoneNumber, whatsappE164 } = normalizeContact(
      payload || {},
    );

    if (!paymentIntentId || !offer?.stripePriceId) {
      return NextResponse.json(
        { error: "paymentIntentId e oferta sao obrigatorios." },
        { status: 400 },
      );
    }

    if (!email || !phoneCountry || !phoneNumber || phoneNumber.length < 8) {
      return NextResponse.json(
        { error: "Email e WhatsApp (pais + numero) sao obrigatorios." },
        { status: 400 },
      );
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      receipt_email: email,
      metadata: {
        buyer_email: email,
        buyer_phone_country: phoneCountry,
        buyer_phone_number: phoneNumber,
        buyer_whatsapp_e164: whatsappE164,
        offer_id: offer.id,
        offer_name: offer.name,
        webhook_plan: offer.webhookPlan || offer.id,
        tool_product_id: offer.toolProductId,
        tool_access_tag: offer.toolAccessTag,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao atualizar payment intent:", error);
    return NextResponse.json(
      { error: "Nao foi possivel validar dados do pagamento." },
      { status: 500 },
    );
  }
}

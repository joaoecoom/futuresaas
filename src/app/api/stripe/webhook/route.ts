import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { unlockToolAccess } from "@/lib/tool-access";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Define STRIPE_WEBHOOK_SECRET no .env.local" },
      { status: 500 },
    );
  }

  const signature = (await headers()).get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json(
      { error: "Header stripe-signature ausente." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Webhook assinatura invalida:", error);
    return NextResponse.json({ error: "Assinatura invalida." }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const email =
      paymentIntent.receipt_email || paymentIntent.metadata?.buyer_email || "";
    const whatsapp = paymentIntent.metadata?.buyer_whatsapp_e164 || "";
    const offerId = paymentIntent.metadata?.offer_id;
    const webhookPlan = paymentIntent.metadata?.webhook_plan || offerId;
    const toolProductId = paymentIntent.metadata?.tool_product_id;
    const toolAccessTag = paymentIntent.metadata?.tool_access_tag;

    if (!email || !offerId || !webhookPlan || !toolProductId || !toolAccessTag) {
      console.error(
        "Pagamento sem dados minimos (email/produto/acesso), nao foi possivel desbloquear.",
      );
      return NextResponse.json({ received: true });
    }

    try {
      await unlockToolAccess({
        email,
        sessionId: paymentIntent.id,
        eventId: event.id,
        amountTotal: paymentIntent.amount_received || paymentIntent.amount || 0,
        currency: paymentIntent.currency ?? "brl",
        whatsapp,
        offerId,
        webhookPlan,
        toolProductId,
        toolAccessTag,
      });
    } catch (error) {
      console.error("Erro ao desbloquear acesso na ferramenta:", error);
      return NextResponse.json(
        { error: "Pagamento confirmado, mas falhou desbloqueio da ferramenta." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

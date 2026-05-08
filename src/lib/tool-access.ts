type UnlockAccessInput = {
  email: string;
  sessionId: string;
  eventId: string;
  amountTotal: number;
  currency: string;
  whatsapp: string;
  offerId: string;
  webhookPlan: string;
  toolProductId: string;
  toolAccessTag: string;
};

export async function unlockToolAccess(input: UnlockAccessInput) {
  const toolApiUrl = process.env.TOOL_API_URL;
  const toolApiKey = process.env.TOOL_API_KEY;
  const toolWebhookUrl = process.env.TOOL_WEBHOOK_URL;
  const toolWebhookToken = process.env.TOOL_WEBHOOK_TOKEN;
  const defaultToolProductId = process.env.TOOL_PRODUCT_ID;

  if (!toolApiUrl && !toolWebhookUrl) {
    throw new Error("Define TOOL_API_URL ou TOOL_WEBHOOK_URL no .env.local");
  }

  if (toolWebhookUrl) {
    const response = await fetch(toolWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(toolWebhookToken
          ? { Authorization: `Bearer ${toolWebhookToken}` }
          : {}),
      },
      body: JSON.stringify({
        event: "sale.approved",
        source: "stripe",
        eventId: input.eventId,
        plan: input.webhookPlan,
        amount_cents: input.amountTotal,
        amount: (input.amountTotal / 100).toFixed(2),
        currency: input.currency,
        customer: {
          email: input.email,
          phone: input.whatsapp,
          whatsapp: input.whatsapp,
        },
        offer: {
          id: input.offerId,
          accessTag: input.toolAccessTag,
          productId: input.toolProductId || defaultToolProductId,
        },
        payment: {
          provider: "stripe",
          status: "paid",
          sessionId: input.sessionId,
          amountTotal: input.amountTotal,
          currency: input.currency,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Falha no webhook da ferramenta: ${body}`);
    }
    return;
  }

  const response = await fetch(`${toolApiUrl}/access/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${toolApiKey}`,
    },
    body: JSON.stringify({
      email: input.email,
      whatsapp: input.whatsapp,
      productId: input.toolProductId || defaultToolProductId,
      accessTag: input.toolAccessTag,
      payment: {
        provider: "stripe",
        sessionId: input.sessionId,
        amountTotal: input.amountTotal,
        currency: input.currency,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao desbloquear acesso na ferramenta: ${body}`);
  }
}

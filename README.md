# Quiz Funnel + Stripe Checkout

Fluxo inicial implementado:

1. Pagina inicial (`/`) com botao **Quero comprar**
2. Pagina de checkout (`/checkout`) com captura de email
3. API route segura (`/api/checkout`) que cria `Checkout Session` no servidor
4. Webhook Stripe (`/api/stripe/webhook`) para desbloquear acesso na ferramenta apos pagamento

## Passo a passo para correr local

1. Copia o ficheiro de exemplo para variaveis locais:
   ```bash
   cp .env.example .env.local
   ```
2. Preenche as variaveis no `.env.local`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
   - `STRIPE_WEBHOOK_SECRET`
   - `TOOL_API_URL`
   - `TOOL_API_KEY`
   - `TOOL_PRODUCT_ID`
3. Arranca o projeto:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:3000`

## Que dados da Stripe precisas fornecer

- `STRIPE_SECRET_KEY` (chave secreta da conta que vai cobrar)
- `STRIPE_PRICE_ID` (preco do produto que sera comprado no checkout)

## Coproducao (outra conta Stripe)

Para separar comissoes entre duas contas Stripe, o caminho certo e usar **Stripe Connect**.

Dados que vou precisar da outra pessoa:

- `account_id` da conta conectada (formato `acct_...`)
- Confirmacao do tipo de fluxo que querem:
  - `destination charges` (recomendado para coproducao)
  - ou `direct charges` (caso especifico)
- Regra de split (exemplo: 70/30)

Com isso, no proximo passo eu adapto o endpoint para criar o pagamento ja com split automatico.

## Desbloqueio automatico na ferramenta

Quando o pagamento e concluido:

1. Stripe envia evento `checkout.session.completed` para `/api/stripe/webhook`
2. O webhook valida a assinatura (`STRIPE_WEBHOOK_SECRET`)
3. O backend desbloqueia por uma das formas:
   - `TOOL_WEBHOOK_URL`: envia webhook unico no estilo Kiwify (`sale.approved`)
   - `TOOL_API_URL`: chama `POST /access/unlock`
4. O payload sempre inclui email, oferta, tag de acesso e dados do pagamento Stripe

### Expor webhook local para testes

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

O comando acima retorna um `whsec_...` que deves colocar em `STRIPE_WEBHOOK_SECRET`.

## Ofertas atuais configuradas

- Front - acesso app: R$147
- Plano anual: R$997
- Plano CoProducao: R$1297
- White Label Marca Propria: R$5000
- White Label mensalidade fixa: R$297
- Licenca adicional: R$30

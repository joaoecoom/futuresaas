import { Suspense } from "react";
import Link from "next/link";
import CheckoutSuccessTracker from "@/components/checkout/CheckoutSuccessTracker";

export default function CheckoutSuccessPage() {
  return (
    <main className="container">
      <Suspense fallback={null}>
        <CheckoutSuccessTracker />
      </Suspense>
      <section className="card">
        <p className="kicker">Pagamento aprovado</p>
        <h1>Compra confirmada</h1>
        <p className="description">
          O acesso é liberado automaticamente em segundos. Se demorar mais de 2
          minutos, contacta o suporte com o email usado na compra.
        </p>
        <Link className="button" href="/">
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}

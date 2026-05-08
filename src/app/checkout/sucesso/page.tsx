import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="container">
      <section className="card">
        <p className="kicker">Pagamento aprovado</p>
        <h1>Compra confirmada</h1>
        <p className="description">
          O acesso e libertado automaticamente em segundos. Se demorar mais de 2
          minutos, contacta o suporte com o email usado na compra.
        </p>
        <Link className="button" href="/">
          Voltar ao inicio
        </Link>
      </section>
    </main>
  );
}

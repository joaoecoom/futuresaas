import Link from "next/link";
import Image from "next/image";
import { formatPriceBRL, funnelOffers } from "@/lib/offers";

export default function Home() {
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
        <p className="kicker">Quiz Funil</p>
        <h1>Descubra o melhor plano para si</h1>
        <p className="description">
          Este e o inicio do funil. Escolhe uma oferta para seguir para o
          checkout.
        </p>
        <div className="offerList">
          {funnelOffers.map((offer) => (
            <article className="offerCard" key={offer.id}>
              <h2>{offer.name}</h2>
              <p className="description">{offer.description}</p>
              <p className="price">{formatPriceBRL(offer.amountInCents)}</p>
              <Link className="button" href={`/checkout?offer=${offer.id}`}>
                Quero comprar
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

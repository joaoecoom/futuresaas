type Props = {
  stars: number;
  quote: string;
  attribution?: string;
  socialBadge: string;
};

function StarRow({ count }: { count: number }) {
  const n = Math.min(5, Math.max(1, count));
  return (
    <div className="checkoutSocialProofStarsRow" aria-label={`${n} de 5 estrelas`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="checkoutSocialProofStar" aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export default function SocialProofBox({
  stars,
  quote,
  attribution,
  socialBadge,
}: Props) {
  return (
    <figure className="checkoutSocialProof">
      <div className="checkoutSocialProofTop">
        <div className="checkoutSocialProofAvatar" aria-hidden>
          <span className="checkoutSocialProofAvatarInner">FF</span>
        </div>
        <div className="checkoutSocialProofMeta">
          <StarRow count={stars} />
          <span className="checkoutSocialProofBadge">{socialBadge}</span>
        </div>
      </div>
      <div className="checkoutSocialProofQuoteWrap">
        <span className="checkoutSocialProofQuoteMark" aria-hidden>
          “
        </span>
        <blockquote className="checkoutSocialProofQuote">{quote}</blockquote>
      </div>
      {attribution ? (
        <figcaption className="checkoutSocialProofAttr">
          <span className="checkoutSocialProofDash">—</span> {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}

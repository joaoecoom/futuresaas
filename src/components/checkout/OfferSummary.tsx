import { useId } from "react";
import type { CheckoutMarketingCopy } from "@/lib/checkout-marketing";

type Props = {
  copy: CheckoutMarketingCopy;
  productName: string;
  description: string;
  amountInCents: number;
};

function CheckIcon() {
  const rid = useId().replace(/:/g, "");
  const gradId = `ckg-${rid}`;

  return (
    <svg
      className="checkoutBulletIcon"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <circle cx="9" cy="9" r="9" fill={`url(#${gradId})`} opacity={0.18} />
      <path
        d="M5 9L8 12L13 6.5"
        stroke={`url(#${gradId})`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1="5"
          y1="6"
          x2="13"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#059669" />
          <stop offset={1} stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function OfferSummary({
  copy,
  productName,
  description,
  amountInCents,
}: Props) {
  const subtitle = copy.summarySubtitle.trim() || description;
  const numeric = (amountInCents / 100).toFixed(2).replace(".", ",");
  const [intPart, decPart] = numeric.split(",");
  const title = copy.summaryTitleTemplate.includes("{productName}")
    ? copy.summaryTitleTemplate.replace(/\{productName\}/g, productName)
    : copy.summaryTitleTemplate;

  return (
    <section
      className="checkoutOfferSummary"
      aria-labelledby="checkout-offer-heading"
    >
      <div className="checkoutOfferSummaryHeader">
        <span className="checkoutOfferBadge">{copy.summaryBadge}</span>
        <h2 id="checkout-offer-heading" className="checkoutOfferSummaryTitle">
          {title}
        </h2>
        <p className="checkoutOfferSummaryDesc">{subtitle}</p>
      </div>

      <div className="checkoutPriceHero" aria-live="polite">
        <div className="checkoutPriceHeroInner">
          <span className="checkoutPriceSym">R$</span>
          <span className="checkoutPriceInt">{intPart}</span>
          <span className="checkoutPriceDec">,{decPart}</span>
          {copy.priceBillingSuffix ? (
            <span className="checkoutPricePeriod">{copy.priceBillingSuffix}</span>
          ) : null}
        </div>
        {copy.priceCancelNote ? (
          <p className="checkoutPriceCancel">{copy.priceCancelNote}</p>
        ) : null}
      </div>

      <ul className="checkoutOfferBullets">
        {copy.includedBullets.map((line) => (
          <li key={line}>
            <span className="checkoutBulletIconWrap" aria-hidden>
              <CheckIcon />
            </span>
            <span className="checkoutBulletText">{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type Props = {
  text: string;
};

export default function UrgencyStrip({ text }: Props) {
  return (
    <div className="checkoutUrgencyStrip" role="status">
      <span className="checkoutUrgencyIcon" aria-hidden>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="checkoutUrgencyText">{text}</span>
    </div>
  );
}

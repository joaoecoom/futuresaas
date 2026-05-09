type Props = {
  body: string;
};

export default function GuaranteeBox({ body }: Props) {
  return (
    <aside className="checkoutGuaranteeBox">
      <span className="checkoutGuaranteeSeal" aria-hidden>
        ✓
      </span>
      <div>
        <p className="checkoutGuaranteeTitle">Garantia de 7 dias</p>
        <p className="checkoutGuaranteeBody">{body}</p>
      </div>
    </aside>
  );
}

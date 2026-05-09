import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

export default function CheckoutHeroBanner({
  src,
  alt,
  priority = true,
}: Props) {
  const isRemote = src.startsWith("http://") || src.startsWith("https://");

  return (
    <div className="checkoutHeroBanner">
      <div className="checkoutHeroBannerInner">
        {isRemote ? (
          // Evita exigir remotePatterns no next.config para A/B com URL externa.
          <img
            src={src}
            alt={alt}
            className="checkoutHeroBannerImg"
            width={1024}
            height={576}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1024}
            height={576}
            className="checkoutHeroBannerImg"
            priority={priority}
            sizes="(max-width: 768px) 100vw, min(1024px, 100vw)"
          />
        )}
      </div>
    </div>
  );
}

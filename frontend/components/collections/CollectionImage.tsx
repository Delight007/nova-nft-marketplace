"use client";

import Image from "next/image";
import { useState } from "react";

type CollectionImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function CollectionImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: CollectionImageProps) {
  return (
    <CollectionImageLoader
      key={src}
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}

function CollectionImageLoader({
  src,
  alt,
  sizes,
  className,
  priority,
}: CollectionImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  return (
    <>
      {status === "loading" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.06]"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`${className ?? ""} ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

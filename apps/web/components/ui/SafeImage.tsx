"use client";
import { useState } from "react";
export function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <img src="https://placehold.co/400x400/F5EBE6/a3a3a3?text=ECLOSIA" alt={alt} className={className} />;
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

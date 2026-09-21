"use client";

import { usePathname } from "next/navigation";

export function ConditionalAiChat({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si l'utilisateur est dans l'espace client, on ne rend pas le chat
  if (pathname?.startsWith("/compte")) {
    return null;
  }

  return <>{children}</>;
}
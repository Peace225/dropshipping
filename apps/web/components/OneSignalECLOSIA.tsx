"use client";
import { useEffect, useRef } from "react";

export default function OneSignalECLOSIA() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("192.168") ||
      hostname.includes("vercel.app");

    if (isLocal) {
      console.log("[OneSignal] Désactivé en local/dev");
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    const initOneSignal = async () => {
      try {
        const OneSignal = (await import("react-onesignal")).default;
        // @ts-ignore
        if ((OneSignal as any).initialized) return;

        await OneSignal.init({
          appId: "736df7a8-256e-481a-83a4-29332cd36698",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false,
          } as any,
          welcomeNotification: {
            title: "ECLOSIA 🤱",
            message:
              "Merci! Vous recevrez nos offres exclusives -10% sur culottes et matelas",
            url: "https://eclosia.shop",
          } as any,
        } as any);

        // Tag pour tes 18 produits corrigés
        (OneSignal as any).sendTag("univers", "bebe_maman");
        (OneSignal as any).sendTag("source", "eclosia_shop");

        console.log("[OneSignal] OK sur eclosia.shop");
      } catch (error: any) {
        if (error?.message?.includes("Can only be used on")) {
          console.warn("[OneSignal] Domaine non autorisé en dev, skip");
        } else {
          console.warn("[OneSignal] Init skip:", error?.message);
        }
      }
    };

    initOneSignal();
  }, []);

  return null;
}
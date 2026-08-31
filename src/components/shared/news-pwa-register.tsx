"use client";

import { useEffect } from "react";

export function NewsPwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw-news.js", { scope: "/news" })
          .then((reg) => {
            console.log("[SuchnaSetu News PWA] Service worker registered on scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[SuchnaSetu News PWA] Service worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}

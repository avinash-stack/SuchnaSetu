"use client";

import { useEffect } from "react";

export function AdminPwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw-admin.js", { scope: "/admin" })
          .then((reg) => {
            console.log("[SuchnaSetu Admin PWA] Service worker registered on scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[SuchnaSetu Admin PWA] Service worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}

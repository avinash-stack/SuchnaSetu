/**
 * SuchnaSetu Admin PWA Service Worker (v1.0.0)
 * Strategy: Pass-through for administrative API operations and authenticated mutations;
 * Pre-cache static admin shell assets.
 */

const ADMIN_CACHE_NAME = "suchnasetu-admin-v1";
const ADMIN_STATIC_ASSETS = [
  "/admin/manifest.webmanifest",
  "/icons/admin/icon-192x192.png",
  "/icons/admin/icon-512x512.png",
  "/icons/admin/icon.svg",
  "/brand/logo-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(ADMIN_CACHE_NAME)
      .then((cache) => cache.addAll(ADMIN_STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[Admin SW] Pre-cache warning:", err))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== ADMIN_CACHE_NAME && key.startsWith("suchnasetu-admin-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Pass-through ALL non-GET, API routes, Cron endpoints, and Auth requests directly to network
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.includes("supabase")
  ) {
    return;
  }

  // 2. Cache-First for static Admin Icons and Brand assets
  if (
    url.pathname.startsWith("/icons/admin/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkRes) => {
          if (networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(ADMIN_CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // 3. Admin Navigation -> Network-First (ensures live, up-to-date administrative telemetry)
  if (url.pathname.startsWith("/admin")) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          return new Response("You are currently offline. Administrative actions require an active connection.", {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            status: 503,
          });
        });
      })
    );
  }
});

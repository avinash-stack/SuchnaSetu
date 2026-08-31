/**
 * SuchnaSetu News PWA Service Worker (v1.0.0)
 * Strategy: Network-First for live news & dynamic articles; Cache-First for static shell assets.
 * Guarantees fresh news content without stale data retention.
 */

const CACHE_NAME = "suchnasetu-news-v1";
const STATIC_ASSETS = [
  "/news",
  "/news-manifest.json",
  "/icons/news/icon-192x192.png",
  "/icons/news/icon-512x512.png",
  "/icons/news/icon.svg",
  "/brand/logo-icon.png",
];

// 1. Install Event: Pre-cache static shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[News SW] Pre-cache warning:", err))
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key.startsWith("suchnasetu-news-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-first for all news pages and data APIs
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin tracking/analytics requests
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Static Assets (Icons, Images, Fonts) -> Cache-First
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkRes) => {
          if (networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // News Pages & Dynamic Content -> Network-First (with offline cache fallback)
  if (url.pathname.startsWith("/news")) {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes.ok && networkRes.type === "basic") {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        })
        .catch(() => {
          // If offline, attempt cache match or fallback to /news index shell
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match("/news");
          });
        })
    );
  }
});

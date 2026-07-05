const CACHE_NAME = "luna-offline-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/game.html",
  "/ludo.html",
  "/puzzle.html",
  "/soccer.html",
  "/script.js",
  "/style.css",
  "/manifest.json",
  "/offline.html" // Tambahkan offline.html ke dalam cache
];

// INSTALL (cache semua file)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE (hapus cache lama)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Menghapus cache lama:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH (Strategi: Network first, lalu Fallback ke Cache)
self.addEventListener("fetch", event => {
  // Hanya handle request GET (menghindari error pada request POST/API)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(res => {
        // Jika jaringan aktif, kembalikan respons jaringan
        return res;
      })
      .catch(() => {
        // Jika jaringan mati, cari di cache
        return caches.match(event.request)
          .then(res => {
            // Jika ada di cache, tampilkan. Jika tidak, tampilkan offline.html
            return res || caches.match("/offline.html");
          });
      })
  );
});

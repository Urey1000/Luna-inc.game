const STATIC_CACHE = "luna-static-v3";
const DYNAMIC_CACHE = "luna-dynamic-v3";

// File penting (precache) yang wajib ada walau offline
const STATIC_FILES = [
  "/",
  "/index.html",
  "/login.html",
  "/manifest.json",
  "/offline.html"
];

// Fungsi untuk membatasi ukuran cache dinamis
function limitCache(cacheName, size) {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        // Hapus cache paling lama (index 0) lalu panggil fungsi ini lagi secara rekursif
        cache.delete(keys[0]).then(() => limitCache(cacheName, size));
      }
    });
  });
}

// INSTALL (Simpan file statis ke Cache)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("[Service Worker] Caching Static Files");
      return cache.addAll(STATIC_FILES);
    })
  );
  
  // OPSI 1: Aktifkan baris di bawah ini jika ingin aplikasi SELALU OTOMATIS UPDATE
  // Jika ini diaktifkan, event "message" di paling bawah tidak akan terpakai.
  self.skipWaiting(); 
});

// ACTIVATE (Hapus cache lama dari versi sebelumnya)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("[Service Worker] Menghapus cache lama:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Langsung mengambil alih semua halaman yang terbuka
});

// FETCH (Strategi: Cache First, fallback ke Network lalu masukkan ke Dynamic Cache)
self.addEventListener("fetch", event => {
  // Hanya proses request GET dan valid (http/https), abaikan POST / chrome-extension://
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // 1. Jika ada di cache, langsung tampilkan
      if (cached) return cached;

      // 2. Jika tidak ada, ambil dari internet (network)
      return fetch(event.request)
        .then(res => {
          // Pastikan respon valid sebelum disimpan (bukan error 404/500)
          if (!res || res.status !== 200 || res.type !== "basic") {
            return res;
          }

          // Salin respons (clone) karena stream hanya bisa dibaca sekali
          const responseToCache = res.clone();

          // Simpan ke Dynamic Cache
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
            // Panggil pembatas cache setelah item baru dimasukkan
            limitCache(DYNAMIC_CACHE, 50);
          });

          return res;
        })
        .catch(() => {
          // 3. Jika gagal ambil dari network (offline)
          // Cek apakah request-nya berupa halaman web (HTML)
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html");
          }
          // Jika request gambar/script, biarkan saja gagal agar tidak error memuat HTML
        });
    })
  );
});

// OPSI 2: Pembaruan manual melalui pesan dari file utama (misal dari tombol "Update Now")
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

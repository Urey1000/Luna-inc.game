// ==========================================
// Luna-Inc PWA Update Manager V1.0
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration = await navigator.serviceWorker.register("/service-worker.js");

            console.log("✅ Service Worker Registered");

            // Jika ada Service Worker baru
            registration.addEventListener("updatefound", () => {

                const newWorker = registration.installing;

                newWorker.addEventListener("statechange", () => {

                    if (
                        newWorker.state === "installed" &&
                        navigator.serviceWorker.controller
                    ) {

                        const update = confirm(
`🚀 Luna-Inc Update

Versi terbaru tersedia.

Tekan OK untuk memperbarui aplikasi.`
                        );

                        if (update) {
                            newWorker.postMessage("SKIP_WAITING");
                        }

                    }

                });

            });

        } catch (err) {

            console.error("❌ Service Worker gagal:", err);

        }

    });

}

// Reload otomatis setelah Service Worker baru aktif
navigator.serviceWorker.addEventListener("controllerchange", () => {

    window.location.reload();

});
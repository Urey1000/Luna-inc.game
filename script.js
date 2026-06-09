// 1. DATA JSON (Ditambah baris "tautan" dan memasukkan Game Tebak Angka)
const dataJSON = `[
    {
        "nama": "Game Buah-buahan",
        "kategori": "Asah Otak",
        "rating": "🌟🌟🌟🌟🌟",
        "gambar": "Luna1.png",
        "tautan": "game.html" 
    },
    {
        "nama": "Poker game Luna",
        "kategori": "Aksi & Petualangan",
        "rating": "🌟🌟🌟🌟",
        "gambar": "Luna4.png",
        "tautan": "poker.html" 
    },
    {
        "nama": "Balapan Liar 3D",
        "kategori": "Olahraga",
        "rating": "🌟🌟🌟🌟🌟",
        "gambar": "Luna3.png",
        "tautan": "balapan.html" 
    },
 {
        "nama": "Ludo Game",
        "kategori": "Olahraga",
        "rating": "🌟🌟🌟🌟🌟",
        "gambar": "luna6.png",
        "tautan": "ludo.html" 
    },
     {
        "nama": "Pesawat Antariksa",
        "kategori": "Petualangan",
        "rating": "🌟🌟🌟🌟🌟",
        "gambar": "war1.jpg",
        "tautan": "war.html" 
    },
    {
    "nama" : "Game Bonanza"
    "kategori":"Slot Game"
    "rating":"🌟🌟🌟🌟🌟"
    "gambar":"  .jpg"
    "tautan":"bonanza.html"
    }
   
]`;

// Catatan: Tautan "#" artinya kosong/belum ada gamenya.

const daftarPermainan = JSON.parse(dataJSON);

const wadah = document.getElementById("wadah-game");
const kolomCari = document.getElementById("kolom-cari");

function tampilkanGame(data) {
    wadah.innerHTML = ""; 

    data.forEach(function(game) {
        const kotakElemen = document.createElement("div");
        kotakElemen.className = "kartu-game";
        
        // BARU: Menambahkan <a class="btn-main"> di baris paling bawah kotak
        kotakElemen.innerHTML = `
            <img src="${game.gambar}" alt="Gambar dari ${game.nama}">
            <h3>${game.nama}</h3>
            <p><strong>Kategori:</strong> ${game.kategori}</p>
            <p><strong>Penilaian:</strong> ${game.rating}</p>
            <a href="${game.tautan}" class="btn-main">▶ Mainkan</a>
        `;
        wadah.appendChild(kotakElemen);
    });
}

// Tampilkan semua game saat pertama kali dibuka
tampilkanGame(daftarPermainan);

// Logika Pencarian
kolomCari.addEventListener("keyup", function(event) {
    const kataKunci = event.target.value.toLowerCase();
    const hasilFilter = daftarPermainan.filter(function(game) {
        return game.nama.toLowerCase().includes(kataKunci);
    });
    tampilkanGame(hasilFilter);
});

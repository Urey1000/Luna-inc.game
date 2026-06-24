// =========================================
// INISIALISASI DOM
// =========================================
const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
const userText = document.getElementById("userText");

// =========================================
// LOGIN CHECK
// =========================================
const user = localStorage.getItem("namaPemain");

if (user) {
  if (userText) userText.innerText = user;
} else {
  // Peringatan: Pastikan file login.html ada
  window.location.href = "login.html";
}

// =========================================
// GAME DATA
// =========================================
const games = [
  { name: "Game Buah", category: "puzzle", img: "buah1.png", link: "bonanza.html" },
  { name: "Slot Buah", category: "action", img: "dl1.png", link: "Slotbuah.html" },
  { name: "Mini Soccer", category: "action", img: "ms.png", link: "soccer.html" },
  { name: "Farmer Game", category: "action", img: "farm.png", link: "farm.html" },
  { name: "Racing Car", category: "racing", img: "mb2.png", link: "balapan.html" },
  { name: "Racing bike", category: "racing", img: "mo2.png", link: "motor.html" },
  { name: "Ludo Game", category: "puzzle", img: "L9.png", link: "ludo.html" },
  { name: "Akuarium Game", category: "puzzle", img: "aquarium.png", link: "aquarium.html" },
  { name: "Puzzle Game", category: "puzzle", img: "pzl1.png", link: "puzzle.html" },
  { name: "Sky War", category: "action", img: "P1.png", link: "war.html", featured: true },
  { name: "Snake Deluxe", category: "action", img: "UR1.png", link: "Snake_Deluxe.html" }
];

// =========================================
// SMART SLIDER LOGIC
// =========================================
function getSmartSlider() {
  const lastPlayed = localStorage.getItem("lastGame");

  // 1. Ambil last played
  let lastGameObj = games.find(g => g.link === lastPlayed);

  // 2. Ambil featured (KECUALIKAN jika dia adalah lastPlayed untuk hindari duplikat)
  let featured = games.filter(g => g.featured && g.link !== lastPlayed);

  // 3. Ambil random game lain (kecuali yang last played dan featured)
  let others = games.filter(g =>
    g.link !== lastPlayed && !g.featured
  );

  // Shuffle (Acak) random games
  others.sort(() => Math.random() - 0.5);

  // Gabungkan
  let result = [];

  if (lastGameObj) result.push(lastGameObj);
  result.push(...featured);
  result.push(...others);

  // Batasi max 5 biar tidak kepanjangan
  return result.slice(0, 5);
}

// Inisialisasi Slider
let featuredGames = getSmartSlider();
let featuredIndex = 0;

function renderFeatured() {
  const container = document.getElementById("featuredGame");
  if (!container) return;

  const game = featuredGames[featuredIndex];
  
  // Penentuan Badge Dinamis
  const isLast = game.link === localStorage.getItem("lastGame");
  let badge = "🔥 Trending";
  if (isLast) badge = "▶ Last Played";
  else if (game.featured) badge = "⭐ Featured";

  container.innerHTML = `
    <div class="featured-image">
      <img src="${game.img}" alt="${game.name}">
    </div>
    <div class="featured-content">
      <span class="badge">${badge}</span>
      <h2>${game.name}</h2>
      <p>Mainkan game populer pilihan Luna-Inc.</p>
      
      <button onclick="playGame('${game.link}')" class="play-btn" style="border: none; cursor: pointer; font-family: inherit; font-size: 16px;">
        🚀 Mainkan Sekarang
      </button>
    </div>
  `;
}

// Fungsi untuk geser otomatis
function nextFeatured() {
  featuredIndex = (featuredIndex + 1) % featuredGames.length;
  renderFeatured();
}

// Auto Slide setiap 4 detik
setInterval(nextFeatured, 4000);

// =========================================
// RENDER GAME GRID
// =========================================
function render(data) {
  if (!grid) return;
  
  if (data.length === 0) {
    grid.innerHTML = `<p style="text-align: center; width: 100%; color: #aaa;">Game tidak ditemukan.</p>`;
    return;
  }

  grid.innerHTML = data.map((game, i) => `
    <div class="game-card" 
         style="animation-delay: ${i * 0.05}s" 
         onclick="playGame('${game.link}')" 
         data-category="${game.category}">
         
      <img src="${game.img}" loading="lazy" alt="${game.name}">
      
      <div class="overlay">
        <h3>${game.name}</h3>
        <button onclick="event.stopPropagation(); playGame('${game.link}')">
          ▶ Mainkan
        </button>
      </div>
      
    </div>
  `).join('');
}

// =========================================
// EVENT LISTENERS (SEARCH & FILTER)
// =========================================
if (search) {
  search.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const result = games.filter(game => game.name.toLowerCase().includes(keyword));
    render(result);
  });
}

function filterGame(category) {
  const buttons = document.querySelectorAll('.categories button');
  buttons.forEach(btn => {
    if (btn.innerText.toLowerCase() === category || (category === 'all' && btn.innerText === 'All')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (category === "all") {
    render(games);
    return;
  }
  const result = games.filter(game => game.category === category);
  render(result);
}

// =========================================
// MODAL GAMEPLAY CONTROLS & ACTIONS
// =========================================

function playGame(url) {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");
  const loading = document.getElementById("gameLoading");

  // Simpan memori game terakhir dimainkan
  localStorage.setItem("lastGame", url);

  // Jika iframe tidak ditemukan, gunakan efek transisi & direct link yang Anda buat
  if (!modal || !frame || !loading) {
    document.body.style.transition = "opacity 0.2s";
    document.body.style.opacity = "0.5";
    setTimeout(() => {
      window.location.href = url;
    }, 200);
    return;
  }

  // Jika Iframe ada, jalankan modal (seperti biasa)
  modal.classList.add("active");
  loading.style.display = "block";
  document.body.style.overflow = "hidden"; // Mencegah background bisa di-scroll

  frame.src = url;

  frame.onload = () => {
    loading.style.display = "none";
  };
}

function closeGame() {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");
  const pauseScreen = document.getElementById("pauseScreen");

  if (frame) frame.src = ""; 
  if (modal) modal.classList.remove("active");
  if (pauseScreen) pauseScreen.classList.remove("active"); 
  
  document.body.style.overflow = "auto"; 

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  // Update isi smart slider segera setelah game ditutup
  featuredGames = getSmartSlider();
  renderFeatured();
}

function toggleFullscreen() {
  const modal = document.getElementById("gameModal");
  if (!modal) return;

  if (!document.fullscreenElement) {
    modal.requestFullscreen().catch(err => {
      console.warn(`Gagal masuk ke mode Fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

function pauseGame() {
  const pauseScreen = document.getElementById("pauseScreen");
  if (pauseScreen) {
    pauseScreen.classList.add("active");
  }
}

function resumeGame() {
  const pauseScreen = document.getElementById("pauseScreen");
  if (pauseScreen) {
    pauseScreen.classList.remove("active");
  }
}

let isMuted = false;
function toggleSound() {
  const frame = document.getElementById("gameFrame");
  if (!frame) return;

  isMuted = !isMuted;
  frame.style.filter = isMuted ? "grayscale(1)" : "none";
  alert(isMuted ? "🔇 Sound OFF" : "🔊 Sound ON");
}

// =========================================
// SWIPE TO CLOSE EVENT (MOBILE)
// =========================================
let startY = 0;

document.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  const modal = document.getElementById("gameModal");
  
  if (modal && modal.classList.contains("active")) {
    let endY = e.changedTouches[0].clientY;

    if (endY - startY > 100) {
      closeGame();
    }
  }
});

// =========================================
// LOGOUT
// =========================================
function logout() {
  localStorage.removeItem("namaPemain");
  window.location.href = "login.html";
}

// =========================================
// INITIALIZATION ON LOAD
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const lastGame = localStorage.getItem("lastGame");
  if (lastGame) {
    console.log("Last played:", lastGame);
  }

  // Inisialisasi Smart Slider & Render
  featuredGames = getSmartSlider();
  renderFeatured();
  render(games);

  const allBtn = document.querySelector('.categories button');
  if (allBtn) allBtn.classList.add('active');

  // Counter Animasi
  const counters = document.querySelectorAll('.counter');
  const animationDuration = 2000; 

  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    
    if (isNaN(target)) return;
    
    const isFloat = !Number.isInteger(target) && target.toString().includes('.');
    let startTime = null;

    const updateCount = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;

      const currentVal = Math.min((progress / animationDuration) * target, target);

      if (isFloat) {
        counter.innerText = currentVal.toFixed(1) + suffix;
      } else {
        counter.innerText = Math.ceil(currentVal) + suffix;
      }

      if (progress < animationDuration) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target + suffix; 
      }
    };

    requestAnimationFrame(updateCount);
  });
});


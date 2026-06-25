// =========================================
// DOM
// =========================================
const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
const userText = document.getElementById("userText");
const userAvatar = document.getElementById("userAvatar");
const resultInfo = document.getElementById("resultInfo");
const featuredContainer = document.getElementById("featuredGame");
const featuredDots = document.getElementById("featuredDots");
const continueSection = document.getElementById("continueSection");
const continueCard = document.getElementById("continueCard");
const refreshBtn = document.getElementById("refreshBtn");

// =========================================
// LOGIN CHECK
// =========================================
const user = localStorage.getItem("namaPemain");

if (user) {
  if (userText) userText.innerText = user;
  if (userAvatar) userAvatar.innerText = user.charAt(0).toUpperCase();
} else {
  window.location.href = "login.html";
}

// =========================================
// GAME DATA
// =========================================
const games = [
  {
    name: "Game Buah",
    category: "puzzle",
    img: "buah1.png",
    link: "bonanza.html",
    desc: "Game santai bertema buah dengan nuansa puzzle ringan.",
    rating: 4.5,
    plays: "1.1K",
    tag: "Casual"
  },
  {
    name: "Slot Buah",
    category: "action",
    img: "dl1.png",
    link: "Slotbuah.html",
    desc: "Arcade cepat dengan tampilan buah penuh warna.",
    rating: 4.4,
    plays: "900",
    tag: "Hot"
  },
  {
    name: "Mini Soccer",
    category: "action",
    img: "ms.png",
    link: "soccer.html",
    desc: "Mini soccer arcade ringan dengan aksi cepat dan kontrol sederhana.",
    rating: 4.8,
    plays: "1.6K",
    tag: "Trending",
    featured: true
  },
  {
    name: "Farmer Game",
    category: "action",
    img: "farm.png",
    link: "farm.html",
    desc: "Game santai bertema kebun dan farming dengan nuansa casual.",
    rating: 4.6,
    plays: "1.1K",
    tag: "New Game",
    featured: true
  },
  {
    name: "Racing Car",
    category: "racing",
    img: "mb2.png",
    link: "balapan.html",
    desc: "Balapan mobil cepat dengan lintasan seru dan kontrol ringan.",
    rating: 4.7,
    plays: "1.3K",
    tag: "Speed"
  },
  {
    name: "Racing Bike",
    category: "racing",
    img: "mo2.png",
    link: "motor.html",
    desc: "Balapan motor penuh adrenalin dengan sensasi arcade.",
    rating: 4.5,
    plays: "1K",
    tag: "Racing"
  },
  {
    name: "Ludo Game",
    category: "puzzle",
    img: "L9.png",
    link: "ludo.html",
    desc: "Board game santai untuk main ringan dan seru.",
    rating: 4.3,
    plays: "870",
    tag: "Classic"
  },
  {
    name: "Akuarium Game",
    category: "puzzle",
    img: "aquarium.png",
    link: "aquarium.html",
    desc: "Game santai bertema aquarium dengan gameplay ringan.",
    rating: 4.6,
    plays: "950",
    tag: "Relax"
  },
  {
    name: "Puzzle Game",
    category: "puzzle",
    img: "pzl1.png",
    link: "puzzle.html",
    desc: "Puzzle ringan untuk pemain casual yang suka tantangan santai.",
    rating: 4.4,
    plays: "820",
    tag: "Puzzle"
  },
  {
    name: "Sky War",
    category: "action",
    img: "P1.png",
    link: "war.html",
    desc: "Game tembak arcade dengan nuansa perang udara.",
    rating: 4.7,
    plays: "1.4K",
    tag: "Featured",
    featured: true
  },
  {
    name: "Snake Deluxe",
    category: "action",
    img: "UR1.png",
    link: "Snake_Deluxe.html",
    desc: "Versi modern dari snake classic dengan gaya arcade.",
    rating: 4.5,
    plays: "980",
    tag: "Retro"
  }
];

// =========================================
// STATE
// =========================================
let currentCategory = "all";
let currentKeyword = "";
let featuredGames = [];
let featuredIndex = 0;
let autoSlide = null;
let startY = 0;
let isMuted = false;

// =========================================
// HELPERS
// =========================================
function getGameByLink(link) {
  return games.find(g => g.link === link);
}

function getCategoryLabel(category) {
  const map = {
    action: "Action",
    racing: "Racing",
    puzzle: "Puzzle"
  };
  return map[category] || "Game";
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateResultInfo(text) {
  if (resultInfo) resultInfo.textContent = text;
}

function getFilteredGames() {
  return games.filter(game => {
    const matchCategory = currentCategory === "all" || game.category === currentCategory;
    const matchKeyword = game.name.toLowerCase().includes(currentKeyword.toLowerCase());
    return matchCategory && matchKeyword;
  });
}

// =========================================
// CONTINUE PLAYING
// =========================================
function renderContinuePlaying() {
  const lastGameLink = localStorage.getItem("lastGame");
  const game = getGameByLink(lastGameLink);

  if (!game || !continueSection || !continueCard) {
    continueSection?.classList.add("hidden");
    return;
  }

  continueSection.classList.remove("hidden");

  continueCard.innerHTML = `
    <div class="continue-thumb">
      <img src="${game.img}" alt="${escapeHtml(game.name)}" loading="lazy">
      <div class="continue-overlay"></div>
    </div>

    <div class="continue-content">
      <span class="section-badge">🎮 Last Played</span>
      <h3>${escapeHtml(game.name)}</h3>
      <p>${escapeHtml(game.desc)}</p>

      <div class="meta-chips">
        <span class="meta-chip">🎯 ${getCategoryLabel(game.category)}</span>
        <span class="meta-chip">⭐ Rating ${game.rating}</span>
        <span class="meta-chip">🔥 ${game.plays} plays</span>
      </div>

      <div class="cta-row">
        <button class="btn-primary" onclick="playGame('${game.link}')">🚀 Lanjut Main</button>
        <button class="btn-secondary" onclick="scrollToCollection()">📚 Lihat Koleksi Game</button>
      </div>
    </div>
  `;
}

function scrollToCollection() {
  document.querySelector(".collection-section")?.scrollIntoView({ behavior: "smooth" });
}

// =========================================
// FEATURED LOGIC
// =========================================
function getFeaturedGames() {
  const lastPlayed = localStorage.getItem("lastGame");
  const lastGameObj = games.find(g => g.link === lastPlayed);

  const featuredOnly = games.filter(g => g.featured && g.link !== lastPlayed);
  const others = games.filter(g => !g.featured && g.link !== lastPlayed);

  // random ringan
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);

  const result = [];
  if (lastGameObj) result.push(lastGameObj);
  result.push(...featuredOnly);
  result.push(...shuffledOthers);

  return result.slice(0, 5);
}

function getFeaturedBadge(game) {
  const lastPlayed = localStorage.getItem("lastGame");
  if (game.link === lastPlayed) return "▶ Last Played";
  if (game.tag) return `🔥 ${game.tag}`;
  return "⭐ Featured";
}

function renderFeatured() {
  if (!featuredContainer) return;
  if (!featuredGames.length) {
    featuredContainer.innerHTML = `<div class="empty-state"><h3>Belum ada featured game</h3><p>Tambahkan game unggulan untuk ditampilkan di sini.</p></div>`;
    return;
  }

  const game = featuredGames[featuredIndex];

  featuredContainer.innerHTML = `
    <div class="featured-media">
      <img src="${game.img}" alt="${escapeHtml(game.name)}">
    </div>

    <div class="featured-info">
      <span class="section-badge">${getFeaturedBadge(game)}</span>
      <h3>${escapeHtml(game.name)}</h3>
      <p>${escapeHtml(game.desc)}</p>

      <div class="meta-chips">
        <span class="meta-chip">🎯 ${getCategoryLabel(game.category)}</span>
        <span class="meta-chip">⭐ Rating ${game.rating}</span>
        <span class="meta-chip">🔥 ${game.plays} plays</span>
      </div>

      <div class="cta-row">
        <button class="btn-primary" onclick="playGame('${game.link}')">🚀 Mainkan Sekarang</button>
        <button class="btn-secondary" onclick="scrollToCollection()">📚 Lihat Koleksi Game</button>
      </div>
    </div>
  `;

  renderFeaturedDots();
}

function renderFeaturedDots() {
  if (!featuredDots) return;
  featuredDots.innerHTML = featuredGames.map((_, i) => `
    <span class="featured-dot ${i === featuredIndex ? 'active' : ''}" onclick="goToFeatured(${i})"></span>
  `).join("");
}

function nextFeatured() {
  if (!featuredGames.length) return;
  featuredIndex = (featuredIndex + 1) % featuredGames.length;
  renderFeatured();
}

function prevFeatured() {
  if (!featuredGames.length) return;
  featuredIndex = (featuredIndex - 1 + featuredGames.length) % featuredGames.length;
  renderFeatured();
}

function goToFeatured(index) {
  featuredIndex = index;
  renderFeatured();
}

function startFeaturedAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    nextFeatured();
  }, 4500);
}

// =========================================
// GRID
// =========================================
function renderGrid(data) {
  if (!grid) return;

  if (!data.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Game tidak ditemukan</h3>
        <p>Coba ganti kata kunci pencarian atau pilih kategori lain.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = data.map((game, i) => `
    <article class="game-card" style="animation-delay:${i * 0.05}s" onclick="playGame('${game.link}')">
      <div class="game-thumb">
        <img src="${game.img}" alt="${escapeHtml(game.name)}" loading="lazy">
        <div class="game-overlay-top">
          <span class="tag-badge">${escapeHtml(game.tag || "Game")}</span>
          <button class="play-mini" onclick="event.stopPropagation(); playGame('${game.link}')">▶</button>
        </div>
      </div>

      <div class="game-content">
        <h3 class="game-title">${escapeHtml(game.name)}</h3>
        <p class="game-desc">${escapeHtml(game.desc)}</p>

        <div class="game-meta">
          <span class="meta-chip">🎯 ${getCategoryLabel(game.category)}</span>
          <span class="meta-chip">⭐ ${game.rating}</span>
          <span class="meta-chip">🔥 ${game.plays}</span>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCollection() {
  const filtered = getFilteredGames();
  renderGrid(filtered);

  const categoryText = currentCategory === "all"
    ? "semua kategori"
    : `kategori ${getCategoryLabel(currentCategory)}`;

  if (currentKeyword) {
    updateResultInfo(`Menampilkan ${filtered.length} game untuk "${currentKeyword}"`);
  } else {
    updateResultInfo(`Menampilkan ${filtered.length} game untuk ${categoryText}`);
  }
}

// =========================================
// SEARCH + FILTER
// =========================================
function filterGame(category, btn = null) {
  currentCategory = category;

  document.querySelectorAll("#categories button").forEach(button => {
    button.classList.remove("active");
  });

  if (btn) btn.classList.add("active");
  renderCollection();
}

if (search) {
  search.addEventListener("input", (e) => {
    currentKeyword = e.target.value.trim().toLowerCase();
    renderCollection();
  });
}

// =========================================
// GAME MODAL
// =========================================
function playGame(url) {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");
  const loading = document.getElementById("gameLoading");
  const title = document.getElementById("gameTitle");
  const subtitle = document.getElementById("gameSubtitle");
  const pauseScreen = document.getElementById("pauseScreen");

  const game = getGameByLink(url);

  localStorage.setItem("lastGame", url);

  if (!modal || !frame || !loading) {
    window.location.href = url;
    return;
  }

  if (title) title.textContent = `🎮 ${game ? game.name : "Playing..."}`;
  if (subtitle) subtitle.textContent = game ? `${getCategoryLabel(game.category)} • Luna-Inc Portal` : "Luna-Inc Portal";

  if (pauseScreen) pauseScreen.classList.remove("active");

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  loading.style.display = "flex";

  frame.src = url;

  frame.onload = () => {
    loading.style.display = "none";
    renderContinuePlaying();

    // refresh featured kalau lastGame berubah
    featuredGames = getFeaturedGames();
    featuredIndex = 0;
    renderFeatured();
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

  renderContinuePlaying();
  featuredGames = getFeaturedGames();
  featuredIndex = 0;
  renderFeatured();
}

function toggleFullscreen() {
  const modal = document.getElementById("gameModal");
  if (!modal) return;

  if (!document.fullscreenElement) {
    modal.requestFullscreen?.().catch(err => {
      console.warn("Gagal fullscreen:", err.message);
    });
  } else {
    document.exitFullscreen?.();
  }
}

function pauseGame() {
  const pauseScreen = document.getElementById("pauseScreen");
  if (pauseScreen) pauseScreen.classList.add("active");
}

function resumeGame() {
  const pauseScreen = document.getElementById("pauseScreen");
  if (pauseScreen) pauseScreen.classList.remove("active");
}

function toggleSound() {
  const frame = document.getElementById("gameFrame");
  isMuted = !isMuted;

  // cuma efek visual karena iframe game beda-beda
  if (frame) {
    frame.style.filter = isMuted ? "grayscale(0.3) brightness(0.8)" : "none";
  }

  alert(isMuted ? "🔇 Sound OFF" : "🔊 Sound ON");
}

// =========================================
// SWIPE TO CLOSE (MOBILE)
// =========================================
document.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  const modal = document.getElementById("gameModal");
  if (!modal || !modal.classList.contains("active")) return;

  const endY = e.changedTouches[0].clientY;
  if (endY - startY > 120) {
    closeGame();
  }
}, { passive: true });

// =========================================
// LOGOUT
// =========================================
function logout() {
  localStorage.removeItem("namaPemain");
  window.location.href = "login.html?action=logout";
}

// =========================================
// COUNTER
// =========================================
function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  const animationDuration = 1800;

  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";

    if (isNaN(target)) return;

    const isFloat = !Number.isInteger(target) && String(target).includes(".");
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
}

// =========================================
// INIT
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  renderContinuePlaying();

  featuredGames = getFeaturedGames();
  featuredIndex = 0;
  renderFeatured();
  startFeaturedAutoSlide();

  renderCollection();
  animateCounters();

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      featuredGames = getFeaturedGames();
      featuredIndex = 0;
      renderFeatured();
    });
  }
});

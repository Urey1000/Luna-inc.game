const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
const userText = document.getElementById("userText");

// LOGIN CHECK
const user = localStorage.getItem("namaPemain");

if (user) {
userText.innerText = user;
} else {
window.location.href = "login.html";
}

// GAME DATA
const games = [
{
name: "Game Buah",
category: "puzzle",
img: "buah1.png",
link: "bonanza.html"
},
{
name: "Slot Buah",
category: "action",
img: "dl1.png",
link: "Slotbuah.html"
},
{
name: "Racing Car",
category: "racing",
img: "mb2.png",
link: "balapan.html"
},
{
name: "Ludo Game",
category: "puzzle",
img: "L9.png",
link: "ludo.html"
},
{
name: "Sky War",
category: "action",
img: "P1.png",
link: "war.html",
featured: true
},
{
name: "Snake Deluxe",
category: "action",
img: "UR1.png",
link: "Snake_Deluxe.html"
}
];

// FEATURED GAME
const featuredGames = games.filter(
g => g.featured || true
);

let featuredIndex = 0;

function renderFeatured() {

const game =
featuredGames[featuredIndex];

const container =
document.getElementById("featuredGame");

container.innerHTML = `
<div class="featured-image">
<img src="${game.img}" alt="${game.name}">
</div>

<div class="featured-content">

  <span class="badge">
    🔥 Trending Game
  </span>

  <h2>${game.name}</h2>

  <p>
    Mainkan game populer pilihan Luna-Inc.
  </p>

  <a href="${game.link}" class="play-btn">
    🚀 Mainkan Sekarang
  </a>

 <div class="slider-controls"><button onclick="prevFeatured()">◀</button>

  <div class="slider-dots">
    ${featuredGames.map((_, i) =>
      `<span class="${
        i === featuredIndex ? 'active' : ''
      }"></span>`
    ).join('')}
  </div><button onclick="nextFeatured()">▶</button>

</div>

`;
}

function nextFeatured(){

featuredIndex++;

if(featuredIndex >= featuredGames.length){
featuredIndex = 0;
}

renderFeatured();
}

function prevFeatured(){

featuredIndex--;

if(featuredIndex < 0){
featuredIndex =
featuredGames.length - 1;
}

renderFeatured();
}

// AUTO SLIDE
setInterval(() => {
nextFeatured();
}, 4000);

// RENDER GAME GRID
function render(data) {

grid.innerHTML = "";

data.forEach(g => {

grid.innerHTML += `
  <div class="card">

    <img src="${g.img}" alt="${g.name}">

    <div class="info">
      <h3>${g.name}</h3>
      <p>${g.category}</p>

      <a href="${g.link}">
        <button>Mainkan</button>
      </a>
    </div>

  </div>
`;

});

}

// SEARCH
search.addEventListener("input", (e) => {

const keyword =
e.target.value.toLowerCase();

const result =
games.filter(game =>
game.name.toLowerCase().includes(keyword)
);

render(result);

});

// FILTER CATEGORY
function filterGame(category) {

if (category === "all") {
render(games);
return;
}

const result =
games.filter(game =>
game.category === category
);

render(result);

}

// LOGOUT
function logout() {

localStorage.removeItem("namaPemain");
window.location.href = "login.html";

}

// INIT
renderFeatured();
render(games);

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
  { name:"Game Buah", category:"puzzle", img:"Luna1.png", link:"bonanza.html" },
  { name:"Slot Buah", category:"action", img:"Luna4.png", link:"Slotbuah.html" },
  { name:"Racing Car", category:"racing", img:"L8.png", link:"balapan.html" },
  { name:"Ludo Game", category:"puzzle", img:"luna6.png", link:"ludo.html" },
  { name:"Sky War", category:"action", img:"war1.jpg", link:"war.html" }, // Koma ditambahkan di sini
  { name:"Snake Deluxe", category:"action", img:"L100.jpg", link:"Snake_Deluxe.html" }
];

// RENDER
function render(data){
  grid.innerHTML = "";

  data.forEach(g => {
    grid.innerHTML += `
      <div class="card">
        <img src="${g.img}">
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

render(games);

// SEARCH
search.addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  render(games.filter(g => g.name.toLowerCase().includes(val)));
});

// CATEGORY FILTER
function filterGame(cat){
  if(cat === "all") return render(games);
  render(games.filter(g => g.category === cat));
}

// LOGOUT
function logout(){
  localStorage.removeItem("namaPemain");
  window.location.href = "login.html";
}

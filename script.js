const soupsEl = document.querySelector("#soups");
const spcEl = document.querySelector("#spc");
const spsEl = document.querySelector("#sps");
const spcInlineEl = document.querySelector("#spcInline");
const stirBtn = document.querySelector("#stirBtn");
const buySpoonBtn = document.querySelector("#buySpoon");
const spoonCostEl = document.querySelector("#spoonCost");
const buyCommisBtn = document.querySelector("#buyCommis");
const commisCostEl = document.querySelector("#commisCost");
const buyPotBtn = document.querySelector("#buyPot");
const potCostEl = document.querySelector("#potCost");

let soups = 0;
let baseSPC = 1;  
let baseSPS = 0;  

let totalSoups = 0; 
let totalClicks = 0;

let soupsPerClick = 1;
let soupsPerSecond = 0;

let spoonLevel = 0;
const spoonBaseCost = 15;
function spoonCost() {
  return Math.ceil(spoonBaseCost * (1.15 ** spoonLevel)); 
}

let commisLevel = 0;
const commisBaseCost = 50;
function commisCost() {
  return Math.ceil(commisBaseCost * (1.2 ** commisLevel)); 
}

let potLevel = 0;
const potBaseCost = 150;
const potMult = 1.12;
function potCost() {
  return Math.ceil(potBaseCost * (1.25 ** potLevel)); 
}

function globalMultiplier() {
  return potMult ** potLevel; 
}

function recomputeRates() {
  const mult = globalMultiplier();
  soupsPerClick = baseSPC * mult;
  soupsPerSecond = baseSPS * mult;
}

function render() {
  soupsEl.textContent = Math.floor(soups);

  spcEl.textContent = soupsPerClick.toFixed(1);
  spsEl.textContent = soupsPerSecond.toFixed(1);
  spcInlineEl.textContent = soupsPerClick.toFixed(1);

  spoonCostEl.textContent = spoonCost();
  commisCostEl.textContent = commisCost();
  potCostEl.textContent = potCost();

  buySpoonBtn.disabled = soups < spoonCost();
  buyCommisBtn.disabled = soups < commisCost();
  buyPotBtn.disabled = soups < potCost();
}

stirBtn.addEventListener("click", () => {
  soups += soupsPerClick;
  totalSoups += soupsPerClick;
  totalClicks += 1;

  checkAchievements();
  render();
});

buySpoonBtn.addEventListener("click", (e) => {
  if (e.currentTarget.dataset.upgrade !== "spoon") return;

  const cost = spoonCost();
  if (soups < cost) return;

  soups -= cost;
  spoonLevel += 1;
  baseSPC += 1;     
  recomputeRates(); 
  checkAchievements()
  render();
});

buyCommisBtn.addEventListener("click", (e) => {
  if (e.currentTarget.dataset.upgrade !== "commis") return;

  const cost = commisCost();
  if (soups < cost) return;

  soups -= cost;
  commisLevel += 1;
  baseSPS += 0.2;   
  recomputeRates();
  checkAchievements()
  spawnCommisCat();
  render();
});

buyPotBtn.addEventListener("click", (e) => {
  if (e.currentTarget.dataset.upgrade !== "pot") return;

  const cost = potCost();
  if (soups < cost) return;

  soups -= cost;
  potLevel += 1;
  recomputeRates(); 
  checkAchievements()
  render();
});

setInterval(() => {
  const gain = soupsPerSecond / 10;
  soups += gain;
  totalSoups += gain;

  checkAchievements();
  render();
}, 100);

recomputeRates();
render();

const toastLayer = document.querySelector("#toastLayer");

function showToast(text) {
  if (!toastLayer) return;

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  toastLayer.appendChild(t);

  setTimeout(() => {
    t.classList.add("toast--out"); 
    setTimeout(() => t.remove(), 240);
  }, 2000);
}

let achSoup100 = false;
let achSoup300 = false;
let achSoup500 = false;
let achSoup1000 = false;
let achSoup2000 = false;
let achClick50 = false;
let achClick100 = false;
let achClick200 = false;
let achClick300 = false;
let achClick400 = false;
let achClick500 = false;
let achSpoon1 = false;
let achSpoon2 = false;
let achSpoon3 = false;
let achSpoon4 = false;
let achSpoon5 = false;
let achCommis1 = false;
let achCommis2 = false;
let archCommis3 = false;
let archCommis4 = false;
let archCommis5 = false;
let achPot1 = false;
let achPot2 = false;
let achPot3 = false;
let achPot4 = false;
let achPot5 = false;

function checkAchievements() {
  if (!achSoup100 && totalSoups >= 100) {
    achSoup100 = true;
    showToast("Succès débloqué : 100 d'une longue lignée !");
  }
  if (!achSoup300 && totalSoups >= 300) {
    achSoup300 = true;
    showToast("Succès débloqué : 300 soupes, ça en fait une grande famille !");
  }
  if (!achSoup500 && totalSoups >= 500) {
    achSoup500 = true;
    showToast("Succès débloqué : 500 soupes, bientôt un banquet !");
  }
  if (!achSoup1000 && totalSoups >= 1000) {
    achSoup1000 = true;
    showToast("Succès débloqué : 1000 soupes, vous avez une armée ?!");
  }
  if (!achSoup2000 && totalSoups >= 2000) {
    achSoup2000 = true;
    showToast("Succès débloqué : 2000 soupes, ça n'en fait pas un nimbus !");
  }
  if (!achClick50 && totalClicks >= 50) {
    achClick50 = true;
    showToast("Succès débloqué : 50 touilles !");
  }
  if (!achClick100 && totalClicks >= 100) {
    achClick100 = true;
    showToast("Succès débloqué : 100 touilles !");
  }
  if (!achClick200 && totalClicks >= 200) {
    achClick200 = true;
    showToast("Succès débloqué : 200 touilles (ça va le doigt ?) !");
  }
  if (!achClick300 && totalClicks >= 300) {
    achClick300 = true;
    showToast("Succès débloqué : 300 touilles (J'ai des doigts en acier trempé !)");
  }
  if (!achClick400 && totalClicks >= 400) {
    achClick400 = true;
    showToast("Succès débloqué : 400 touilles (T'avais la ref du précédent ?) !");
  }
  if (!achClick500 && totalClicks >= 500) {
    achClick500 = true;
    showToast("Succès débloqué : 500 touilles (Tu vas finir sourd) !");
  }
  if (!achSpoon1 && spoonLevel >= 1) {
    achSpoon1 = true;
    showToast("Succès débloqué : Première cuillère (il était temps) !");
  }
  if (!achCommis1 && commisLevel >= 1) {
  achCommis1 = true;
  showToast("Succès débloqué : Premier es-*tousse* commis !");
 }
 if (!achSpoon2 && spoonLevel >= 10) {
  achSpoon2 = true;
  showToast("Succès débloqué : En réalité, ça n'en ajoute pas vraiment plus !");
 }
  if (!achSpoon3 && spoonLevel >= 25) {
    achSpoon3 = true;
    showToast("Succès débloqué : Cuillères à profusion !");
  }
  if (!achSpoon4 && spoonLevel >= 50) {
    achSpoon4 = true;
    showToast("Succès débloqué : Maître cuillier, une leçon de Zen !");
  }
  if (!achSpoon5 && spoonLevel >= 100) {
    achSpoon5 = true;
    showToast("Succès débloqué : L'ultime cuillère !");
  }
  if (!achCommis2 && commisLevel >= 5) {
    achCommis2 = true;
    showToast("Succès débloqué : Mes commis sont mes amis !");
  }
  if (!archCommis3 && commisLevel >= 10) {
    archCommis3 = true;
    showToast("Succès débloqué : On part en conquête !");
  }
  if (!archCommis4 && commisLevel >= 20) {
    archCommis4 = true;
    showToast("Succès débloqué : Bientôt la révolution des soupiers !");
  }
  if (!archCommis5 && commisLevel >= 50) {
    archCommis5 = true;
    showToast("Succès débloqué : Bienvenue en enfer !");
  }
  if (!achPot1 && potLevel >= 1) {
    achPot1 = true;
    showToast("Succès débloqué : Premier chaudron !");
  }
  if (!achPot2 && potLevel >= 5) {
    achPot2 = true;
    showToast("Succès débloqué : La soupe bout !");
  }
  if (!achPot3 && potLevel >= 10) {
    achPot3 = true;
    showToast("Succès débloqué : Marmite géante !");
  }
  if (!achPot4 && potLevel >= 25) {
    achPot4 = true;
    showToast("Succès débloqué : Océan de soupe !");
  }
  if (!achPot5 && potLevel >= 50) {
    achPot5 = true;
    showToast("Succès débloqué : Big Bang de soupe !");
  }
}

// random cat chaos layer

const chaosLayer = document.querySelector("#chaosLayer");
const catTypes = ["cat1", "cat2", "cat3", "cat4", "cat5", "cat6"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function spawnCommisCat() {
  if (!chaosLayer) return;

  const el = document.createElement("div");
  el.classList.add("cat-sprite");

  const type = catTypes[randInt(0, catTypes.length - 1)];
  el.classList.add(type);

  const size = 64;
  const padding = 4;

  const w = window.innerWidth;
  const h = window.innerHeight;

  el.style.left = randInt(padding, Math.max(padding, w - size - padding)) + "px";
  el.style.top  = randInt(padding, Math.max(padding, h - size - padding)) + "px";

  // Bonus chaos : rotation + random scale
  const scale = randInt(70, 350) / 100; // 0.70 à 1.50
  const rot = randInt(-25, 25);
  el.style.transform = `rotate(${rot}deg) scale(${scale})`;

  chaosLayer.appendChild(el); // insertion DOM
}

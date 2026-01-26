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
  return Math.ceil(commisBaseCost * (1.15 ** commisLevel)); 
}

let potLevel = 0;
const potBaseCost = 150;
const potMult = 1.12;
function potCost() {
  return Math.ceil(potBaseCost * (1.15 ** potLevel)); 
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

let achCommis1 = false;
let achSoup100 = false;
let achClick50 = false;
let achSpoon1 = false;

function checkAchievements() {
  if (!achSoup100 && totalSoups >= 100) {
    achSoup100 = true;
    showToast("Succès débloqué : 100 d'une longue lignée !");
  }
  if (!achClick50 && totalClicks >= 50) {
    achClick50 = true;
    showToast("Succès débloqué : 50 touilles !");
  }
  if (!achSpoon1 && spoonLevel >= 1) {
    achSpoon1 = true;
    showToast("Succès débloqué : Première cuillère (il était temps) !");
  }
  if (!achCommis1 && commisLevel >= 1) {
  achCommis1 = true;
  showToast("Succès débloqué : Premier es-*tousse* commis !");
}
}
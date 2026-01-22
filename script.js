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
  render();
});

buyPotBtn.addEventListener("click", (e) => {
  if (e.currentTarget.dataset.upgrade !== "pot") return;

  const cost = potCost();
  if (soups < cost) return;

  soups -= cost;
  potLevel += 1;
  recomputeRates(); 
  render();
});

setInterval(() => {
  soups += soupsPerSecond / 10;
  render();
}, 100); 

recomputeRates();
render();

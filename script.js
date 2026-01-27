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

// --- SFX --- (sound effects)
const sfx = {
  buy: new Audio("sfx/thanks1.wav"),
  spawns: [
    new Audio("sfx/random1.wav"),
    new Audio("sfx/random2.wav"),
    new Audio("sfx/random3.wav"),
  ],
};

// Volume global
sfx.buy.volume = 0.25;
sfx.spawns.forEach(a => a.volume = 0.35);

function playSfx(a) {
  if (!a) return;
  a.currentTime = 0;              // restart from beginning
  a.play().catch(() => {});       // play() renvoie une Promise
}

function playRandom(list) {
  const i = Math.floor(Math.random() * list.length);
  playSfx(list[i]);
}

function randMs(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

const spawnUrls = ["sfx/random1.wav", "sfx/random2.wav", "sfx/random3.wav"];
const commisLoops = [];

function addCommisRandomLoop(minGapMs = 300, maxGapMs = 2000) {
  const url = spawnUrls[Math.floor(Math.random() * spawnUrls.length)];
  const a = new Audio(url);

  a.volume = 0.20;
  a.loop = false; // IMPORTANT : without that, 'ended' event won't fire

  a.addEventListener("ended", () => {
    const wait = randMs(minGapMs, maxGapMs);
    setTimeout(() => {
      a.currentTime = 0;
      a.play().catch(() => {});
    }, wait); // setTimeout enables random gap
  });

  commisLoops.push(a);
  a.play().catch(() => {});
}

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
  playSfx(sfx.buy);  
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
  playSfx(sfx.buy);
  checkAchievements()
  spawnCommisCat();
  addCommisRandomLoop(300, 2000);
  playRandom(sfx.spawns);
  render();
});

buyPotBtn.addEventListener("click", (e) => {
  if (e.currentTarget.dataset.upgrade !== "pot") return;

  const cost = potCost();
  if (soups < cost) return;

  soups -= cost;
  potLevel += 1;
  recomputeRates();
  playSfx(sfx.buy); 
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

const unlocked = {};

const ACHIEVEMENTS = [
  // Soup
  { id: "soup100",  when: () => totalSoups >= 100,  msg: "Succès débloqué : 100 d'une longue lignée !" },
  { id: "soup300",  when: () => totalSoups >= 300,  msg: "Succès débloqué : 300 soupes, ça en fait une grande famille !" },
  { id: "soup500",  when: () => totalSoups >= 500,  msg: "Succès débloqué : 500 soupes, bientôt un banquet !" },
  { id: "soup1000", when: () => totalSoups >= 1000, msg: "Succès débloqué : 1000 soupes, vous avez une armée ?!" },
  { id: "soup2000", when: () => totalSoups >= 2000, msg: "Succès débloqué : 2000 soupes, ça n'en fait pas un nimbus !" },

  // Clicks
  { id: "click50",  when: () => totalClicks >= 50,  msg: "Succès débloqué : 50 touilles !" },
  { id: "click100", when: () => totalClicks >= 100, msg: "Succès débloqué : 100 touilles !" },
  { id: "click200", when: () => totalClicks >= 200, msg: "Succès débloqué : 200 touilles (ça va le doigt ?) !" },
  { id: "click300", when: () => totalClicks >= 300, msg: "Succès débloqué : 300 touilles (J'ai des doigts en acier trempé !)" },
  { id: "click400", when: () => totalClicks >= 400, msg: "Succès débloqué : 400 touilles (T'avais la ref du précédent ?) !" },
  { id: "click500", when: () => totalClicks >= 500, msg: "Succès débloqué : 500 touilles (Tu vas finir sourd) !" },

  // spoons
  { id: "spoon1", when: () => spoonLevel >= 1,   msg: "Succès débloqué : Première cuillère (il était temps) !" },
  { id: "spoon2", when: () => spoonLevel >= 10,  msg: "Succès débloqué : En réalité, ça n'en ajoute pas vraiment plus !" },
  { id: "spoon3", when: () => spoonLevel >= 25,  msg: "Succès débloqué : Cuillères à profusion !" },
  { id: "spoon4", when: () => spoonLevel >= 50,  msg: "Succès débloqué : Maître cuillier, une leçon de Zen !" },
  { id: "spoon5", when: () => spoonLevel >= 100, msg: "Succès débloqué : L'ultime cuillère !" },

  // Commis
  { id: "commis1", when: () => commisLevel >= 1,  msg: "Succès débloqué : Premier es-*tousse* commis !" },
  { id: "commis2", when: () => commisLevel >= 5,  msg: "Succès débloqué : Mes commis sont mes amis !" },
  { id: "commis3", when: () => commisLevel >= 10, msg: "Succès débloqué : On part en conquête !" },
  { id: "commis4", when: () => commisLevel >= 20, msg: "Succès débloqué : Bientôt la révolution des soupiers !" },
  { id: "commis5", when: () => commisLevel >= 50, msg: "Succès débloqué : Bienvenue en enfer !" },

  // pots
  { id: "pot1", when: () => potLevel >= 1,  msg: "Succès débloqué : Premier chaudron !" },
  { id: "pot2", when: () => potLevel >= 5,  msg: "Succès débloqué : La soupe bout !" },
  { id: "pot3", when: () => potLevel >= 10, msg: "Succès débloqué : Marmite géante !" },
  { id: "pot4", when: () => potLevel >= 25, msg: "Succès débloqué : Océan de soupe !" },
  { id: "pot5", when: () => potLevel >= 50, msg: "Succès débloqué : Big Bang de soupe !" },
];

function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {       
    if (unlocked[a.id]) return;
    if (a.when()) {
      unlocked[a.id] = true;
      showToast(a.msg);
    }
  });
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

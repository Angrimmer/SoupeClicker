// Get UI Elements
const soupsEl = document.querySelector("#soups");
const spcEl = document.querySelector("#spc");
const spsEl = document.querySelector("#sps");
const spcInlineEl = document.querySelector("#spcInline");
const stirBtn = document.querySelector("#stirBtn");

let soups = 0;
let soupsPerClick = 1;
let soupsPerSecond = 0; 

function render() {
  soupsEl.textContent = Math.floor(soups);
  spcEl.textContent = soupsPerClick;
  spsEl.textContent = soupsPerSecond;
  spcInlineEl.textContent = soupsPerClick;
}

stirBtn.addEventListener("click", () => {
  soups += soupsPerClick;
  render();
}); 

setInterval(() => {
  soups += soupsPerSecond / 10; 
  render();
}, 100); 

render();

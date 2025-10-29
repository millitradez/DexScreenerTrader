console.log("Dexscreener Trader Extension loaded ✅");

const tradeButton = document.createElement("button");
tradeButton.textContent = "Trade Now";
tradeButton.style.position = "fixed";
tradeButton.style.bottom = "20px";
tradeButton.style.right = "20px";
tradeButton.style.padding = "10px 16px";
tradeButton.style.background = "#00c38a";
tradeButton.style.color = "#fff";
tradeButton.style.border = "none";
tradeButton.style.borderRadius = "6px";
tradeButton.style.cursor = "pointer";
tradeButton.style.zIndex = "9999";

tradeButton.addEventListener("click", () => {
  alert("Trading action triggered — you can connect wallet or API next.");
});

document.body.appendChild(tradeButton);

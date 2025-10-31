
// content.js
function injectRorkModal() {
  if (document.getElementById("rork-modal")) {
    console.log("Rork modal already exists, skipping injection");
    return;
  }

  console.log("Injecting Rork modal into page");
  const modal = document.createElement("div");
  modal.id = "rork-modal";
  modal.innerHTML = `
    <div style="position: fixed; top: 10%; right: 10%; background: #000; padding: 20px; border-radius: 10px; z-index: 999999; color: white; width: 300px;">
      <h3 style="margin-bottom:10px;">Rork Embedded Wallet</h3>
      <input id="privateKey" placeholder="Enter Private Key" style="width:100%;padding:8px;margin-bottom:10px;border-radius:5px;border:none;">
      <button id="loadWallet" style="width:100%;margin-bottom:5px;padding:8px;background:#007bff;color:white;border:none;border-radius:5px;">Load / Generate Wallet</button>
      <button id="encryptWallet" style="width:100%;margin-bottom:5px;padding:8px;background:#007bff;color:white;border:none;border-radius:5px;">Encrypt & Save Wallet</button>
      <button id="buyToken" style="width:100%;margin-bottom:5px;padding:8px;background:#007bff;color:white;border:none;border-radius:5px;">Buy Token</button>
      <button id="sellToken" style="width:100%;padding:8px;background:#007bff;color:white;border:none;border-radius:5px;">Sell Token</button>
    </div>
  `;
  document.body.appendChild(modal);
  console.log("Rork modal injected successfully");

  // Add event listeners with proper error handling
  document.getElementById("loadWallet").addEventListener("click", () => {
    const pk = document.getElementById("privateKey").value.trim();
    console.log("Load wallet button clicked");
    chrome.runtime.sendMessage({ action: "loadWallet", pk }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        alert("Error communicating with extension: " + chrome.runtime.lastError.message);
      } else {
        console.log("Response from service worker:", response);
        alert(response.message || "Wallet load initiated");
      }
    });
  });

  document.getElementById("encryptWallet").addEventListener("click", () => {
    console.log("Encrypt wallet button clicked");
    chrome.runtime.sendMessage({ action: "encryptWallet" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        alert("Error communicating with extension: " + chrome.runtime.lastError.message);
      } else {
        console.log("Response from service worker:", response);
        alert(response.message || "Wallet encryption initiated");
      }
    });
  });

  document.getElementById("buyToken").addEventListener("click", () => {
    console.log("Buy token button clicked");
    chrome.runtime.sendMessage({ action: "buyToken" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        alert("Error communicating with extension: " + chrome.runtime.lastError.message);
      } else {
        console.log("Response from service worker:", response);
        alert(response.message || "Buy token initiated");
      }
    });
  });

  document.getElementById("sellToken").addEventListener("click", () => {
    console.log("Sell token button clicked");
    chrome.runtime.sendMessage({ action: "sellToken" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        alert("Error communicating with extension: " + chrome.runtime.lastError.message);
      } else {
        console.log("Response from service worker:", response);
        alert(response.message || "Sell token initiated");
      }
    });
  });
}

// Inject when Dexscreener loads
if (window.location.href.includes("dexscreener.com")) {
  console.log("DexScreener detected, injecting modal");
  injectRorkModal();
} else {
  console.log("Not on DexScreener, current URL:", window.location.href);
}

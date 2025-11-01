

// content.js
function injectRorkModal() {
  if (document.getElementById("rork-modal")) return;

  const modal = document.createElement("div");
  modal.id = "rork-modal";
  modal.innerHTML = `
    <div style="position: fixed; top: 10%; right: 10%; background: #000; padding: 20px; border-radius: 10px; z-index: 999999; color: white; width: 300px;">
      <h3 style="margin-bottom:10px;">Rork Embedded Wallet</h3>
      <input id="privateKey" placeholder="Enter Private Key" style="width:100%;padding:8px;margin-bottom:10px;border-radius:5px;border:none;">
      <button id="loadWallet" style="width:100%;margin-bottom:5px;padding:8px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">Load / Generate Wallet</button>
      <button id="encryptWallet" style="width:100%;margin-bottom:5px;padding:8px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">Encrypt & Save Wallet</button>
      <button id="buyToken" style="width:100%;margin-bottom:5px;padding:8px;background:#28a745;color:white;border:none;border-radius:5px;cursor:pointer;">Buy Token</button>
      <button id="sellToken" style="width:100%;padding:8px;background:#dc3545;color:white;border:none;border-radius:5px;cursor:pointer;">Sell Token</button>
      <div id="statusMessage" style="margin-top:10px;font-size:12px;color:#aaa;"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Helper to show status messages
  function showStatus(message, isError = false) {
    const statusEl = document.getElementById("statusMessage");
    statusEl.textContent = message;
    statusEl.style.color = isError ? "#ff6b6b" : "#4ade80";
    setTimeout(() => {
      statusEl.textContent = "";
    }, 3000);
  }

  // Add event listeners
  document.getElementById("loadWallet").addEventListener("click", () => {
    const pk = document.getElementById("privateKey").value.trim();
    showStatus("Loading wallet...");
    chrome.runtime.sendMessage({ action: "loadWallet", pk }, (response) => {
      if (response && response.success) {
        showStatus(response.message);
      } else {
        showStatus(response?.error || "Failed to load wallet", true);
      }
    });
  });

  document.getElementById("encryptWallet").addEventListener("click", () => {
    showStatus("Checking wallet encryption...");
    chrome.runtime.sendMessage({ action: "encryptWallet" }, (response) => {
      if (response && response.success) {
        showStatus(response.message);
      } else {
        showStatus(response?.error || "Encryption check failed", true);
      }
    });
  });

  document.getElementById("buyToken").addEventListener("click", () => {
    showStatus("Initiating buy...");
    chrome.runtime.sendMessage({ action: "buyToken" }, (response) => {
      if (response && response.success) {
        showStatus(response.message);
      } else {
        showStatus(response?.error || "Buy failed", true);
      }
    });
  });

  document.getElementById("sellToken").addEventListener("click", () => {
    showStatus("Initiating sell...");
    chrome.runtime.sendMessage({ action: "sellToken" }, (response) => {
      if (response && response.success) {
        showStatus(response.message);
      } else {
        showStatus(response?.error || "Sell failed", true);
      }
    });
  });

  console.log("Rork modal injected successfully");
}

// Inject when Dexscreener loads
if (window.location.href.includes("dexscreener.com")) {
  // Wait for page to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectRorkModal);
  } else {
    injectRorkModal();
  }
}

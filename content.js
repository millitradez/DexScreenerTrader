

// content.js
function injectRorkModal() {
  if (document.getElementById("rork-modal")) return;

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

  // Add event listeners
  document.getElementById("loadWallet").addEventListener("click", () => {
    const pk = document.getElementById("privateKey").value.trim();
    chrome.runtime.sendMessage({ action: "loadWallet", pk });
  });

  document.getElementById("encryptWallet").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "encryptWallet" });
  });

  document.getElementById("buyToken").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "buyToken" });
  });

  document.getElementById("sellToken").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "sellToken" });
  });
}

// Inject when Dexscreener loads
if (window.location.href.includes("dexscreener.com")) {
  injectRorkModal();
}

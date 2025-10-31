
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

  // Helper function to handle message sending with proper error handling
  function sendMessageToBackground(action, additionalData = {}) {
    console.log(`${action} button clicked`);
    chrome.runtime.sendMessage({ action, ...additionalData }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        alert("Error communicating with extension: " + chrome.runtime.lastError.message);
      } else if (!response) {
        console.error("No response received from service worker");
        alert("No response from extension service worker");
      } else {
        console.log("Response from service worker:", response);
        alert(response.message || `${action} initiated`);
      }
    });
  }

  // Add event listeners with proper error handling
  document.getElementById("loadWallet").addEventListener("click", () => {
    const pk = document.getElementById("privateKey").value.trim();
    sendMessageToBackground("loadWallet", { pk });
  });

  document.getElementById("encryptWallet").addEventListener("click", () => {
    sendMessageToBackground("encryptWallet");
  });

  document.getElementById("buyToken").addEventListener("click", () => {
    sendMessageToBackground("buyToken");
  });

  document.getElementById("sellToken").addEventListener("click", () => {
    sendMessageToBackground("sellToken");
  });
}

// Inject when Dexscreener loads
if (window.location.href.includes("dexscreener.com")) {
  console.log("DexScreener detected, injecting modal");
  injectRorkModal();
} else {
  console.log("Not on DexScreener, current URL:", window.location.href);
}

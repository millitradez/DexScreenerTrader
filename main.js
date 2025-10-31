// Service worker for DexScreener Trader extension
// Handles messages from content scripts and popup

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in service worker:", message);
  
  switch (message.action) {
    case "loadWallet":
      console.log("Loading wallet (PK length:", message.pk?.length || 0, "characters)");
      // call Jupiter / Rork logic here
      sendResponse({ success: true, message: "Wallet load initiated" });
      break;

    case "encryptWallet":
      console.log("Encrypting wallet...");
      sendResponse({ success: true, message: "Wallet encryption initiated" });
      break;

    case "buyToken":
      console.log("Buy token clicked");
      sendResponse({ success: true, message: "Buy token initiated" });
      break;

    case "sellToken":
      console.log("Sell token clicked");
      sendResponse({ success: true, message: "Sell token initiated" });
      break;
    
    default:
      console.log("Unknown action:", message.action);
      sendResponse({ success: false, message: "Unknown action" });
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
});

console.log("DexScreener Trader service worker loaded");

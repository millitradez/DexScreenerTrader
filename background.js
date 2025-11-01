// background.js - Service worker for handling messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message.action);

  switch (message.action) {
    case "loadWallet":
      handleLoadWallet(message.pk).then(sendResponse);
      return true; // Keep channel open for async response

    case "encryptWallet":
      handleEncryptWallet().then(sendResponse);
      return true;

    case "buyToken":
      handleBuyToken().then(sendResponse);
      return true;

    case "sellToken":
      handleSellToken().then(sendResponse);
      return true;
  }
});

async function handleLoadWallet(pk) {
  try {
    if (!pk) {
      // Generate new wallet
      // Note: In production, user should create wallet through popup UI with password
      console.log("Wallet generation should be done through popup UI with password protection");
      return { success: false, message: "Please use the extension popup to create a wallet" };
    } else {
      // Import wallet from private key
      // Note: In production, this would require password input from user
      console.log("Wallet import should be done through popup UI with password protection");
      return { success: false, message: "Please use the extension popup to import a wallet" };
    }
  } catch (error) {
    console.error("Load wallet error:", error);
    return { success: false, error: error.message };
  }
}

async function handleEncryptWallet() {
  try {
    // Check if wallet exists
    const result = await chrome.storage.local.get(['dst_wallet_v4']);
    const stored = result['dst_wallet_v4'];
    
    if (!stored) {
      return { success: false, error: "No wallet found to encrypt" };
    }

    if (stored.enc) {
      return { success: true, message: "Wallet is already encrypted" };
    }

    // If we get here, wallet exists but isn't encrypted (shouldn't happen in current flow)
    return { success: true, message: "Wallet encryption verified" };
  } catch (error) {
    console.error("Encrypt wallet error:", error);
    return { success: false, error: error.message };
  }
}

async function handleBuyToken() {
  try {
    console.log("Buy token action triggered");
    // Check if wallet exists
    const result = await chrome.storage.local.get(['dst_wallet_v4']);
    const stored = result['dst_wallet_v4'];
    
    if (!stored || !stored.pubkey) {
      return { success: false, error: "No wallet found. Please create a wallet first." };
    }

    // In production, this would:
    // 1. Get token address from current page
    // 2. Prompt for amount and password
    // 3. Use Fluxbeam API to get quote and execute swap
    return { success: true, message: "Buy token action logged. Full implementation requires UI flow." };
  } catch (error) {
    console.error("Buy token error:", error);
    return { success: false, error: error.message };
  }
}

async function handleSellToken() {
  try {
    console.log("Sell token action triggered");
    // Check if wallet exists
    const result = await chrome.storage.local.get(['dst_wallet_v4']);
    const stored = result['dst_wallet_v4'];
    
    if (!stored || !stored.pubkey) {
      return { success: false, error: "No wallet found. Please create a wallet first." };
    }

    // In production, this would:
    // 1. Get token address from current page
    // 2. Prompt for amount and password
    // 3. Use Fluxbeam API to get quote and execute swap
    return { success: true, message: "Sell token action logged. Full implementation requires UI flow." };
  } catch (error) {
    console.error("Sell token error:", error);
    return { success: false, error: error.message };
  }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "loadWallet":
      console.log("Loading wallet with PK:", message.pk);
      // call Jupiter / Rork logic here
      break;

    case "encryptWallet":
      console.log("Encrypting wallet...");
      break;

    case "buyToken":
      console.log("Buy token clicked");
      break;

    case "sellToken":
      console.log("Sell token clicked");
      break;
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded event fired");
  
  const connectBtn = document.getElementById("connectWallet");
  const walletAddressEl = document.getElementById("walletAddress");
  const tradeBtn = document.getElementById("tradeBtn");
  const tokenInput = document.getElementById("tokenAddress");
  const amountInput = document.getElementById("amount");

  console.log("Elements found:", {
    connectBtn: !!connectBtn,
    walletAddressEl: !!walletAddressEl,
    tradeBtn: !!tradeBtn,
    tokenInput: !!tokenInput,
    amountInput: !!amountInput
  });

  let wallet = null;

  // ✅ Connect Wallet button
  connectBtn.addEventListener("click", async () => {
    console.log("Connect wallet button clicked");
    try {
      if (!window.solana) {
        console.error("window.solana not found");
        alert("No Solana wallet detected. Please install Phantom.");
        return;
      }

      console.log("Attempting to connect to Solana wallet");
      const response = await window.solana.connect();
      wallet = response.publicKey.toString();
      console.log("Wallet connected:", wallet);
      walletAddressEl.textContent = `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
      connectBtn.textContent = "Connected ✅";
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet: " + err.message);
    }
  });

  // ✅ Execute Trade button
  tradeBtn.addEventListener("click", async () => {
    console.log("Trade button clicked");
    if (!wallet) {
      console.warn("No wallet connected");
      alert("Please connect your wallet first.");
      return;
    }

    const tokenAddress = tokenInput.value.trim();
    const amount = parseFloat(amountInput.value);

    console.log("Trade parameters:", { tokenAddress, amount });

    if (!tokenAddress || isNaN(amount) || amount <= 0) {
      console.warn("Invalid trade parameters");
      alert("Please enter a valid token address and amount.");
      return;
    }

    try {
      console.log(`Trading ${amount} SOL for token: ${tokenAddress}`);
      alert(`Trade executed! (mock for now)`);
    } catch (err) {
      console.error("Trade error:", err);
      alert("Trade failed. Check console for details.");
    }
  });

  console.log("DexScreener Trader popup loaded successfully.");
});

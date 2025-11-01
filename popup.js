function isValidTradeInput(tokenAddress, amountValue) {
  const amountRegex = /^[0-9]*\.?[0-9]+$/;
  if (!tokenAddress || !amountRegex.test(amountValue) || parseFloat(amountValue) <= 0) {
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connectWallet");
  const walletAddressEl = document.getElementById("walletAddress");
  const tradeBtn = document.getElementById("tradeBtn");
  const tokenInput = document.getElementById("tokenAddress");
  const amountInput = document.getElementById("amount");

  let wallet = null;

  // ✅ Connect Wallet button
  connectBtn.addEventListener("click", async () => {
    try {
      if (!window.solana) {
        alert("No Solana wallet detected. Please install Phantom.");
        return;
      }

      const response = await window.solana.connect();
      wallet = response.publicKey.toString();
      walletAddressEl.textContent = `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
      connectBtn.textContent = "Connected ✅";
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet.");
    }
  });

  // ✅ Execute Trade button
  tradeBtn.addEventListener("click", async () => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }

    const tokenAddress = tokenInput.value.trim();
    const amountValue = amountInput.value.trim();

    if (!isValidTradeInput(tokenAddress, amountValue)) {
      alert("Please enter a valid token address and amount.");
      return;
    }

    const amount = parseFloat(amountValue);

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

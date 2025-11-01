function isValidTradeInput(tokenAddress, amountValue) {
  const amountRegex = /^[0-9]*\.?[0-9]+$/;
  if (!tokenAddress || !amountRegex.test(amountValue) || parseFloat(amountValue) <= 0) {
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", async () => {
  const loadWalletBtn = document.getElementById("loadWallet");
  const encryptWalletBtn = document.getElementById("encryptWallet");
  const walletAddressEl = document.getElementById("walletAddress");
  const tradeBtn = document.getElementById("tradeBtn");
  const tokenInput = document.getElementById("tokenAddress");
  const amountInput = document.getElementById("amount");
  const privateKeyInput = document.getElementById("privateKey");
  const passwordInput = document.getElementById("password");

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

  // Auto-load wallet from storage if it exists
  const password = localStorage.getItem("password");
  if (password) {
    passwordInput.value = password;
    embeddedWallet.loadAndDecryptWallet(password);
    const publicKey = embeddedWallet.getPublicKey();
    if (publicKey) {
      walletAddressEl.textContent = `Loaded: ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;
    }
  }

  // ✅ Load / Generate Wallet button
  loadWalletBtn.addEventListener("click", async () => {
    const privateKey = privateKeyInput.value.trim();
    if (privateKey) {
      embeddedWallet.importWallet(privateKey);
    } else {
      embeddedWallet.generateNewWallet();
    }
    const publicKey = embeddedWallet.getPublicKey();
    if (publicKey) {
      walletAddressEl.textContent = `Loaded: ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;
    } else {
      walletAddressEl.textContent = "Failed to load wallet.";
    }
  });

  // ✅ Encrypt & Save Wallet button
  encryptWalletBtn.addEventListener("click", async () => {
    const password = passwordInput.value.trim();
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    embeddedWallet.encryptAndSaveWallet(password);
    localStorage.setItem("password", password);
    alert("Wallet encrypted and saved.");
  });

  // ✅ Execute Trade button
  tradeBtn.addEventListener("click", async () => {
    const wallet = embeddedWallet;
    if (!wallet.keypair) {
      alert("Please load or generate a wallet first.");
      return;
    }

    const tokenAddress = tokenInput.value.trim();
    const amountValue = amountInput.value.trim();

    if (!isValidTradeInput(tokenAddress, amountValue)) {
      alert("Please enter a valid token address and amount.");
      return;
    }

    const amount = parseFloat(amountValue);
    const SOL_MINT = "So11111111111111111111111111111111111111112";
    const amountInLamports = amount * solanaWeb3.LAMPORTS_PER_SOL;

    try {
      // 1. Get a quote
      const quote = await Fluxbeam.fetchQuote(SOL_MINT, tokenAddress, amountInLamports);

      // 2. Get the swap transaction
      const { transaction: base64Transaction } = await Fluxbeam.fetchSwapTransaction(
        quote,
        wallet.getPublicKey(),
        true
      );

      // 3. Sign and send the transaction
      const transactionBuffer = buffer.Buffer.from(base64Transaction, 'base64');
      const transaction = solanaWeb3.Transaction.from(transactionBuffer);

      transaction.partialSign(wallet.keypair);

      const signature = await connection.sendRawTransaction(transaction.serialize());

      alert(`Transaction sent with signature: ${signature}`);

    } catch (err) {
      console.error("Trade error:", err);
      alert("Trade failed. Check console for details.");
    }
  });

  console.log("DexScreener Trader popup loaded successfully.");
});

document.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connectWallet");
  const walletAddressEl = document.getElementById("walletAddress");
  const tradeBtn = document.getElementById("tradeBtn");
  const tokenInput = document.getElementById("tokenAddress");
  const amountInput = document.getElementById("amount");

  let walletData = null;

  // Check if wallet exists on load
  try {
    const stored = await new Promise((resolve) => {
      chrome.storage.local.get(['dst_wallet_v4'], (items) => {
        resolve(items['dst_wallet_v4']);
      });
    });
    
    if (stored && stored.pubkey) {
      walletData = stored;
      walletAddressEl.textContent = `Wallet: ${stored.pubkey.slice(0, 6)}...${stored.pubkey.slice(-4)}`;
      connectBtn.textContent = "Wallet Loaded ✅";
      connectBtn.disabled = true;
    }
  } catch (err) {
    console.error("Error checking wallet:", err);
  }

  // Connect/Create Wallet button
  connectBtn.addEventListener("click", async () => {
    try {
      // TODO: Replace prompt() with proper password dialog
      // Current implementation uses prompt() which is not ideal for passwords as:
      // - Password is visible while typing
      // - May be logged in browser history
      // Consider creating a modal with <input type="password"> for production use
      const password = prompt("Enter a password to create/unlock your wallet:");
      if (!password) {
        return;
      }

      // Check if wallet exists
      const stored = await new Promise((resolve) => {
        chrome.storage.local.get(['dst_wallet_v4'], (items) => {
          resolve(items['dst_wallet_v4']);
        });
      });

      if (stored && stored.enc) {
        // Unlock existing wallet
        try {
          const unlocked = await Wallet.unlock(password);
          walletData = { pubkey: unlocked.pubkey };
          walletAddressEl.textContent = `Connected: ${unlocked.pubkey.slice(0, 6)}...${unlocked.pubkey.slice(-4)}`;
          connectBtn.textContent = "Connected ✅";
          connectBtn.disabled = true;
          alert("Wallet unlocked successfully!");
        } catch (err) {
          console.error("Unlock error:", err);
          alert("Failed to unlock wallet. Incorrect password?");
        }
      } else {
        // Create new wallet
        const created = await Wallet.createWallet(password);
        walletData = created;
        walletAddressEl.textContent = `Created: ${created.pubkey.slice(0, 6)}...${created.pubkey.slice(-4)}`;
        connectBtn.textContent = "Wallet Created ✅";
        connectBtn.disabled = true;
        alert("New wallet created! Please save your private key securely.");
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect/create wallet: " + err.message);
    }
  });

  // Execute Trade button
  tradeBtn.addEventListener("click", async () => {
    if (!walletData || !walletData.pubkey) {
      alert("Please connect your wallet first.");
      return;
    }

    const tokenAddress = tokenInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!tokenAddress || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid token address and amount.");
      return;
    }

    try {
      // TODO: Replace prompt() with proper password dialog (see comment above connectBtn)
      const password = prompt("Enter your wallet password to execute trade:");
      if (!password) {
        return;
      }

      // Unlock wallet to get keypair
      const unlocked = await Wallet.unlock(password);
      console.log(`Trading ${amount} SOL for token: ${tokenAddress}`);
      
      // Get balance to verify
      const balance = await Wallet.getBalance(unlocked.pubkey, unlocked.conn);
      console.log(`Current balance: ${balance} SOL`);
      
      if (balance < amount) {
        alert(`Insufficient balance. You have ${balance} SOL but need ${amount} SOL.`);
        return;
      }

      alert(`Trade prepared! Balance: ${balance} SOL\n(Actual swap execution requires Fluxbeam API integration)`);
    } catch (err) {
      console.error("Trade error:", err);
      alert("Trade failed: " + err.message);
    }
  });

  console.log("DexScreener Trader popup loaded successfully.");
});

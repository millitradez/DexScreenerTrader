
// popup.js
(function () {
  const createBtn = document.getElementById('createWalletBtn');
  const importBtn = document.getElementById('importWalletBtn');
  const unlockBtn = document.getElementById('unlockBtn');
  const pwInput = document.getElementById('pw');
  const pubkeySpan = document.getElementById('pubkey');
  const balanceSpan = document.getElementById('balance');
  const walletInfo = document.getElementById('walletInfo');
  const sendSolBtn = document.getElementById('sendSolBtn');
  const toAddrInput = document.getElementById('toAddr');
  const sendAmtInput = document.getElementById('sendAmt');
  const receiveBtn = document.getElementById('receiveBtn');
  const showSeedBtn = document.getElementById('showSeedBtn');
  const lockBtn = document.getElementById('lockBtn');
  const messageDiv = document.getElementById('message');

  const inputMintEl = document.getElementById('inputMint');
  const outputMintEl = document.getElementById('outputMint');
  const amountEl = document.getElementById('amount');
  const quoteBtn = document.getElementById('quoteBtn');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const quoteResult = document.getElementById('quoteResult');
  const tradeStatus = document.getElementById('tradeStatus');

  const rpcInput = document.getElementById('rpcInput');
  const saveRpcBtn = document.getElementById('saveRpcBtn');

  let current = null; // { kp, conn, pubkey }

  function setMessage(txt, isError=false) {
    messageDiv.textContent = txt || '';
    messageDiv.style.color = isError ? '#ff6666' : '#ffd700';
  }

  // Create wallet
  createBtn.onclick = async () => {
    const pw = prompt('Choose a strong password to encrypt your wallet (remember it!)');
    if (!pw) return;
    setMessage('Creating wallet...');
    try {
      const res = await Wallet.createWallet(pw);
      setMessage('Wallet created: ' + res.pubkey);
    } catch (e) {
      setMessage('Create failed: ' + e.message, true);
    }
  };

  // Import wallet
  importBtn.onclick = async () => {
    const secret = prompt('Paste base58 secretKey or JSON array of bytes:');
    if (!secret) return;
    const pw = prompt('Choose a password to encrypt imported wallet:');
    if (!pw) return;
    setMessage('Importing...');
    try {
      const res = await Wallet.importWallet(secret, pw);
      setMessage('Imported wallet: ' + res.pubkey);
    } catch (e) {
      setMessage('Import failed: ' + e.message, true);
    }
  };

  // Unlock wallet
  unlockBtn.onclick = async () => {
    const pw = pwInput.value;
    if (!pw) { setMessage('Enter password', true); return; }
    setMessage('Unlocking...');
    try {
      const unlocked = await Wallet.unlock(pw);
      current = unlocked;
      pubkeySpan.textContent = unlocked.pubkey;
      walletInfo.style.display = 'block';
      const bal = await Wallet.getBalance(unlocked.pubkey, unlocked.conn);
      balanceSpan.textContent = (Number(bal)).toFixed(6) + ' SOL';
      setMessage('Unlocked');
    } catch (e) {
      setMessage('Unlock failed: ' + e.message, true);
    }
  };

  lockBtn.onclick = () => {
    current = null;
    pubkeySpan.textContent = '';
    balanceSpan.textContent = '—';
    walletInfo.style.display = 'none';
    setMessage('Locked');
  };

  // Send SOL
  sendSolBtn.onclick = async () => {
    if (!current) { setMessage('Unlock first', true); return; }
    const to = toAddrInput.value.trim();
    const amt = parseFloat(sendAmtInput.value);
    if (!to || !amt) { setMessage('Recipient and amount required', true); return; }
    setMessage('Sending...');
    try {
      const sig = await Wallet.sendSol(current.kp, current.conn, to, amt);
      setMessage('Sent! tx: ' + sig);
      const b = await Wallet.getBalance(current.pubkey, current.conn);
      balanceSpan.textContent = b.toFixed(6) + ' SOL';
    } catch (e) {
      setMessage('Send failed: ' + e.message, true);
    }
  };

  receiveBtn.onclick = async () => {
    if (!current) { setMessage('Unlock first', true); return; }
    await navigator.clipboard.writeText(current.pubkey);
    alert('Address copied to clipboard:\n' + current.pubkey);
  };

  showSeedBtn.onclick = async () => {
    const pw = prompt('Re-enter password to decrypt seed (careful!)');
    if (!pw) return;
    try {
      // decrypt quick by calling wallet.unlock with pw but avoid storing kp globally if you prefer
      const { kp } = await Wallet.unlock(pw);
      const secretBase58 = solanaWeb3.bs58.encode(kp.secretKey);
      alert('Secret key (base58):\n' + secretBase58);
    } catch (e) {
      alert('Decrypt failed: ' + e.message);
    }
  };

  // Quote flow
  quoteBtn.onclick = async () => {
    const inputMint = inputMintEl.value.trim();
    const outputMint = outputMintEl.value.trim();
    const amount = amountEl.value.trim();
    if (!inputMint || !outputMint || !amount) { setMessage('Provide inputMint, outputMint, amount', true); return; }
    setMessage('Fetching quote...');
    try {
      const quote = await Fluxbeam.fetchQuote(inputMint, outputMint, amount);
      quoteResult.textContent = JSON.stringify(quote);
      setMessage('Quote fetched');
    } catch (e) {
      setMessage('Quote error: ' + e.message, true);
    }
  };

  // Place swap: fetch swap transaction from fluxbeam, decode base64, sign with kp, send
  placeOrderBtn.onclick = async () => {
    if (!current) { setMessage('Unlock first', true); return; }
    const inputMint = inputMintEl.value.trim();
    const outputMint = outputMintEl.value.trim();
    const amount = amountEl.value.trim();
    if (!inputMint || !outputMint || !amount) { setMessage('Provide inputMint, outputMint, amount', true); return; }
    setMessage('Getting quote & swap transaction...');
    try {
      const quote = await Fluxbeam.fetchQuote(inputMint, outputMint, amount);
      // fetch transaction to sign
      const txRes = await Fluxbeam.fetchSwapTransaction(quote, current.pubkey, true);
      if (!txRes.transaction) throw new Error('No transaction returned from Fluxbeam');
      const txBase64 = txRes.transaction;
      // decode base64 -> Uint8Array
      function base64ToUint8Array(b64) {
        const binary = atob(b64);
        const len = binary.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) arr[i] = binary.charCodeAt(i);
        return arr;
      }
      // create Transaction from raw
      const raw = base64ToUint8Array(txBase64);
      const tx = solanaWeb3.Transaction.from(raw);
      // sign (partial sign with embedded Keypair)
      tx.partialSign(current.kp);
      const signed = tx.serialize();
      const sig = await current.conn.sendRawTransaction(signed);
      // confirm
      await current.conn.confirmTransaction(sig, 'confirmed');
      setMessage('Swap executed. tx: ' + sig);
      tradeStatus.textContent = 'Swap tx: ' + sig;
      // refresh balance
      const b = await Wallet.getBalance(current.pubkey, current.conn);
      balanceSpan.textContent = b.toFixed(6) + ' SOL';
    } catch (e) {
      setMessage('Swap failed: ' + e.message, true);
    }
  };

  saveRpcBtn.onclick = async () => {
    const url = rpcInput.value.trim();
    if (!url) return;
    await Wallet.storeRpc(url);
    setMessage('RPC saved');
  };

  // init stored rpc
  (async () => {
    const rpc = await Wallet.loadRpc();
    rpcInput.value = rpc;
  })();

})();

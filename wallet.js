// wallet.js
// Exposes Wallet API to popup.js
// relies on solanaWeb3 global (from CDN)

const Wallet = (function () {
  const STORAGE_KEY = 'dst_wallet_v4';
  const RPC_KEY = 'dst_rpc_v4';
  const base58 = solanaWeb3.bs58;

  // helpers
  function abToBase64(buf) {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  function base64ToUint8Array(b64) {
    const binary = atob(b64);
    const len = binary.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) arr[i] = binary.charCodeAt(i);
    return arr;
  }
  async function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }
  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({
      name: 'PBKDF2',
      salt: salt,
      iterations: 200000,
      hash: 'SHA-256'
    }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt','decrypt']);
  }

  async function encryptSeed(seedUint8, password) {
    const salt = await generateSalt();
    const key = await deriveKey(password, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, seedUint8);
    return {
      salt: abToBase64(salt.buffer),
      iv: abToBase64(iv.buffer),
      ct: abToBase64(ct)
    };
  }

  async function decryptSeed(encObj, password) {
    const salt = base64ToUint8Array(encObj.salt);
    const iv = base64ToUint8Array(encObj.iv);
    const ct = base64ToUint8Array(encObj.ct);
    const key = await deriveKey(password, salt);
    const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, ct.buffer);
    return new Uint8Array(plain);
  }

  function store(obj) {
    return new Promise((res) => chrome.storage.local.set({ [STORAGE_KEY]: obj }, () => res()));
  }
  function loadStored() {
    return new Promise((res) => chrome.storage.local.get([STORAGE_KEY], (items) => res(items[STORAGE_KEY])));
  }
  function storeRpc(url) {
    return new Promise((res) => chrome.storage.local.set({ [RPC_KEY]: url }, () => res()));
  }
  function loadRpc() {
    return new Promise((res) => chrome.storage.local.get([RPC_KEY], (items) => res(items[RPC_KEY] || 'https://api.mainnet-beta.solana.com')));
  }

  // create wallet, return pubkey
  async function createWallet(password) {
    const kp = solanaWeb3.Keypair.generate();
    const seed = kp.secretKey; // Uint8Array
    const enc = await encryptSeed(seed, password);
    const payload = { enc, pubkey: kp.publicKey.toBase58() };
    await store(payload);
    return payload;
  }

  // import secretKey: accepts base58 or JSON array
  async function importWallet(secretKeyInput, password) {
    let secret;
    try {
      secret = base58.decode(secretKeyInput);
    } catch (e) {
      // try JSON array
      const arr = JSON.parse(secretKeyInput);
      secret = new Uint8Array(arr);
    }
    const enc = await encryptSeed(secret, password);
    const kp = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(secret));
    const payload = { enc, pubkey: kp.publicKey.toBase58() };
    await store(payload);
    return payload;
  }

  // unlock returns {kp, conn}
  async function unlock(password) {
    const stored = await loadStored();
    if (!stored) throw new Error('No wallet found');
    const seed = await decryptSeed(stored.enc, password);
    const kp = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(seed));
    const rpc = await loadRpc();
    const conn = new solanaWeb3.Connection(rpc, 'confirmed');
    return { kp, conn, pubkey: kp.publicKey.toBase58() };
  }

  async function getBalance(pubkey, conn) {
    const p = new solanaWeb3.PublicKey(pubkey);
    const lamports = await conn.getBalance(p);
    return lamports / solanaWeb3.LAMPORTS_PER_SOL;
  }

  async function sendSol(kp, conn, toAddr, amount) {
    const tx = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: kp.publicKey,
        toPubkey: new solanaWeb3.PublicKey(toAddr),
        lamports: Math.round(amount * solanaWeb3.LAMPORTS_PER_SOL)
      })
    );
    const sig = await solanaWeb3.sendAndConfirmTransaction(conn, tx, [kp]);
    return sig;
  }

  // helper for SPL token send would go here (left for v4.4.1 if you want full SPL flow)
  return {
    createWallet,
    importWallet,
    unlock,
    getBalance,
    sendSol,
    storeRpc,
    loadRpc
  };
})();


// libs/solana.js
// ✅ Lightweight Solana connection & keypair utility (browser-compatible)

export class Connection {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getBalance(pubkey) {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [pubkey]
      })
    });
    const data = await res.json();
    return data.result?.value || 0;
  }
}

export class PublicKey {
  constructor(value) {
    this.value = value;
  }
  toBase58() {
    return this.value;
  }
}

export class Keypair {
  constructor(secret) {
    this.secret = secret;
    this.publicKey = new PublicKey(btoa(String.fromCharCode(...secret)).slice(0, 32));
  }

  static fromSeed(seed) {
    const secret = new Uint8Array(seed);
    return new Keypair(secret);
  }
}

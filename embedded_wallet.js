// embedded_wallet.js

// This object will hold the wallet's state.
const embeddedWallet = {
  keypair: null,

  // Generates a new Solana keypair.
  generateNewWallet: function() {
    this.keypair = solanaWeb3.Keypair.generate();
    console.log("New wallet generated:", this.getPublicKey());
  },

  // Imports a wallet from a private key.
  importWallet: function(privateKey) {
    try {
      const decoded = this.bs58.decode(privateKey);
      this.keypair = solanaWeb3.Keypair.fromSecretKey(decoded);
      console.log("Wallet imported:", this.getPublicKey());
    } catch (e) {
      console.error("Failed to import wallet:", e);
      this.keypair = null;
    }
  },

  // Encrypts and saves the wallet to local storage.
  encryptAndSaveWallet: function(password) {
    if (!this.keypair) {
      console.error("No keypair to save.");
      return;
    }
    const privateKey = this.keypair.secretKey;
    const encrypted = CryptoJS.AES.encrypt(privateKey.toString(), password).toString();
    localStorage.setItem("encryptedWallet", encrypted);
    console.log("Wallet saved and encrypted.");
  },

  // Loads and decrypts the wallet from local storage.
  loadAndDecryptWallet: function(password) {
    const encrypted = localStorage.getItem("encryptedWallet");
    if (!encrypted) {
      console.error("No wallet found in storage.");
      return;
    }
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, password);
      const privateKey = new Uint8Array(decrypted.toString(CryptoJS.enc.Utf8).split(','));
      this.keypair = solanaWeb3.Keypair.fromSecretKey(privateKey);
      console.log("Wallet loaded and decrypted.");
    } catch (e) {
      console.error("Failed to decrypt wallet:", e);
      this.keypair = null;
    }
  },

  // Returns the public key of the current wallet.
  getPublicKey: function() {
    return this.keypair ? this.keypair.publicKey.toString() : null;
  },

  bs58: {
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    base: 58,
    decode: function(string) {
      if (string.length === 0) return new Uint8Array(0)

      var bytes = [0]
      for (var i = 0; i < string.length; i++) {
        var char = string[i]
        var value = this.alphabet.indexOf(char)
        if (value === -1) throw new Error('Invalid base58 character')

        for (var j = 0, len = bytes.length; j < len; j++) {
          value += bytes[j] * this.base
          bytes[j] = value & 0xff
          value >>= 8
        }

        while (value > 0) {
          bytes.push(value & 0xff)
          value >>= 8
        }
      }

      // deal with leading zeros
      for (var k = 0; k < string.length && string[k] === '1'; k++) {
        bytes.push(0)
      }

      return new Uint8Array(bytes.reverse())
    }
  }
};

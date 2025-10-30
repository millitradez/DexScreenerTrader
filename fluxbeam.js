// fluxbeam.js
const Fluxbeam = (function () {
  const API_ROOT = 'https://api.fluxbeam.xyz/v1';

  async function fetchQuote(inputMint, outputMint, amount, slippageBps = 50) {
    // amount is assumed in smallest unit for the input token (depends on token decimals)
    const params = new URLSearchParams({
      inputMint, outputMint, amount: String(amount), slippageBps: String(slippageBps)
    });
    const url = `${API_ROOT}/quote?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Quote error: ${res.status} ${txt}`);
    }
    return await res.json(); // expect quote data
  }

  async function fetchSwapTransaction(quoteObj, userPublicKey, wrapAndUnwrapSol = true) {
    const url = `${API_ROOT}/swap/transaction`;
    const body = { quote: quoteObj, userPublicKey, wrapAndUnwrapSol };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Swap transaction error: ${res.status} ${txt}`);
    }
    return await res.json(); // expect { transaction: "<base64>" } or similar
  }

  return {
    fetchQuote,
    fetchSwapTransaction
  };
})();

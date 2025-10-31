
// libs/jupiter.js
// ✅ Jupiter aggregator minimal API wrapper (browser-safe)

const JUP_API = 'https://quote-api.jup.ag/v6/quote';
const SWAP_API = 'https://quote-api.jup.ag/v6/swap';

export async function buyToken(wallet, tokenMint, amount) {
  const quoteUrl = `${JUP_API}?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenMint}&amount=${amount}&slippageBps=50`;
  const quote = await (await fetch(quoteUrl)).json();

  if (!quote.data) throw new Error('Quote not found');

  console.log('[Jupiter] Quote received for BUY:', quote);

  // Normally you'd sign+send transaction here — stub for extension demo
  return { txid: 'demo-buy-' + Date.now(), details: quote.data };
}

export async function sellToken(wallet, tokenMint, amount) {
  const quoteUrl = `${JUP_API}?inputMint=${tokenMint}&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&slippageBps=50`;
  const quote = await (await fetch(quoteUrl)).json();

  if (!quote.data) throw new Error('Quote not found');

  console.log('[Jupiter] Quote received for SELL:', quote);

  return { txid: 'demo-sell-' + Date.now(), details: quote.data };
}

// api/ticks.js — Vercel serverless proxy to EC2 tick_api.py
// Sits at /api/ticks?asset=BTC&n=52 — same HTTPS origin as the dashboard
export default async function handler(req, res) {
  const { asset = 'BTC', n = 52 } = req.query;

  const EC2_TICK_API = 'http://3.252.249.167:7701';

  try {
    const upstream = await fetch(
      `${EC2_TICK_API}/ticks?asset=${asset}&n=${n}`,
      { signal: AbortSignal.timeout(2500) }
    );
    const data = await upstream.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: 'tick_api unreachable', detail: e.message });
  }
}

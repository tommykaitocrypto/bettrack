// api/keepalive.js — Vercel Serverless Function
// Ping Supabase toutes les 24h pour éviter la pause automatique du plan gratuit
// Setup : ajouter ce fichier dans /api/keepalive.js de ton repo GitHub
// Puis dans vercel.json, ajouter le cron (voir instructions ci-dessous)

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://tpebejuthrbkbjwbdjqz.supabase.co";
  const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZWJlanV0aHJia2Jqd2JkanF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDM4MjEsImV4cCI6MjA4ODY3OTgyMX0.oysT_KLsQhjJmdKSWAwKgqgU0p66Hz0WNNn-1sN19Tk";

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/users?select=username&limit=1`, {
      headers: {
        "apikey": SUPABASE_ANON,
        "Authorization": `Bearer ${SUPABASE_ANON}`
      }
    });
    const ok = r.ok;
    console.log(`[keepalive] Supabase ping: ${ok ? "OK" : "FAIL"} — ${new Date().toISOString()}`);
    res.status(200).json({ ok, ts: new Date().toISOString() });
  } catch (e) {
    console.error("[keepalive] Error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
}

// Netlify Scheduled Function: chama /api/keepalive todo dia para que o
// Supabase (plano Free) registre atividade externa e não pause o projeto.
// Roda só em deploys de produção. Substitui os crons do vercel.json, que não
// executam no Netlify.
export default async () => {
  const baseUrl = process.env.URL;

  if (!baseUrl) {
    console.error("[keepalive] Variável URL do Netlify ausente.");
    return;
  }

  const headers = process.env.CRON_SECRET
    ? { Authorization: `Bearer ${process.env.CRON_SECRET}` }
    : {};

  const response = await fetch(`${baseUrl}/api/keepalive`, { headers });
  const body = await response.text();

  console.log(`[keepalive] ${response.status} ${body}`);
};

export const config = {
  schedule: "0 9 * * *",
};

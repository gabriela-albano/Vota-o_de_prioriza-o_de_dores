import { getStore } from "@netlify/blobs";

// Devolve o registro de todos os participantes (consistência forte, para o
// painel nunca mostrar dado atrasado).
export default async () => {
  const store = getStore({ name: "votacao-priorizacao", consistency: "strong" });
  const { blobs } = await store.list();

  const lidos = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
  const votos = lidos.filter(Boolean);

  return new Response(JSON.stringify({ votos }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};

export const config = { path: "/api/results" };

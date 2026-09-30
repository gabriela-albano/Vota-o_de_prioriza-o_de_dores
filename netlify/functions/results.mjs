import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("votacao-priorizacao");
  const { blobs } = await store.list();

  const votos = [];
  for (const b of blobs) {
    const data = await store.get(b.key, { type: "json" });
    if (data) votos.push(data);
  }

  return new Response(JSON.stringify({ votos }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/results" };

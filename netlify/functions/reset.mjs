import { getStore } from "@netlify/blobs";

// Apaga todos os votos registrados. Use só para limpar testes antes do
// dia real da oficina — não tem confirmação no servidor, a confirmação
// acontece na tela do admin (admin.html) antes de chamar esta função.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
  }

  const store = getStore("votacao-priorizacao");
  const { blobs } = await store.list();
  for (const b of blobs) {
    await store.delete(b.key);
  }

  // Também volta o modo guiado para "não iniciado", para não ficar preso
  // numa etapa antiga depois de zerar os votos de teste.
  const estadoStore = getStore("votacao-priorizacao-estado");
  await estadoStore.setJSON("estado", { etapa: -1, duracaoSeg: 120, iniciadoEm: null });

  return new Response(JSON.stringify({ ok: true, removidos: blobs.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/reset" };

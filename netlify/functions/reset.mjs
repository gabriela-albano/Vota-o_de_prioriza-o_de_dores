import { getStore } from "@netlify/blobs";

// Apaga todos os votos registrados. Use só para limpar testes antes do
// dia real da oficina — não tem confirmação no servidor, a confirmação
// acontece na tela do admin (admin.html) antes de chamar esta função.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
  }

  const store = getStore({ name: "votacao-priorizacao", consistency: "strong" });
  const { blobs } = await store.list();
  for (const b of blobs) {
    await store.delete(b.key);
  }

  // Também volta o modo guiado para "não iniciado", para não ficar preso
  // numa etapa antiga depois de zerar os votos de teste.
  // ...e abre uma SESSÃO nova: os celulares dos participantes veem o número
  // mudar e descartam as respostas antigas guardadas localmente (sem isso, o
  // próximo clique de qualquer pessoa reenviava todos os votos zerados).
  const estadoStore = getStore({ name: "votacao-priorizacao-estado", consistency: "strong" });
  const sessao = Date.now();
  await estadoStore.setJSON("estado", { etapa: -1, duracaoSeg: 180, iniciadoEm: null, modo: "triagem", sessao });

  // ...e reativa todas as dores (desfaz o corte de um ensaio anterior), para a
  // Rodada 1 → corte → Rodada 2 recomeçar limpa.
  const catStore = getStore({ name: "votacao-priorizacao-catalogo", consistency: "strong" });
  const catalogo = await catStore.get("catalogo", { type: "json" });
  if (catalogo && Array.isArray(catalogo.dores)) {
    catalogo.dores = catalogo.dores.map((d) => ({ ...d, selecionada: true }));
    catalogo.atualizadoEm = Date.now();
    await catStore.setJSON("catalogo", catalogo);
  }

  // confere que não sobrou nada (lista de novo)
  const restantes = (await store.list()).blobs;
  for (const b of restantes) await store.delete(b.key);

  return new Response(JSON.stringify({ ok: true, removidos: blobs.length, sessao }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/reset" };
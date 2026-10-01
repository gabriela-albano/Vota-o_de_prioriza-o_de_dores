import { getStore } from "@netlify/blobs";

// Registro de cada participante: { nome, entrouEm, ts, respostas }.
//
// IMPORTANTE (correção da perda de votos): antes, cada clique mandava UMA
// resposta e o servidor fazia "lê o registro → acrescenta → grava". Com
// cliques rápidos (dot voting, ou C1/C2/C3 em sequência), duas gravações
// liam o mesmo registro antigo e a última apagava a anterior — além disso o
// banco lia com consistência "eventual" (podia devolver dado de até ~1 min
// atrás). Agora o navegador do participante é a fonte da verdade das
// próprias respostas: ele manda SEMPRE o conjunto completo, um envio de cada
// vez (fila), e o servidor só grava — não lê nada antes. Consistência forte.
//
// POST { nome, entrouEm, respostas }  → grava o registro inteiro
// GET  ?nome=Fulano                   → devolve o registro dessa pessoa
//                                       (para restaurar se ela recarregar a página)

function chaveDoNome(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function sanitizarRespostas(respostas) {
  const limpo = {};
  if (!respostas || typeof respostas !== "object") return limpo;
  for (const [doreId, crits] of Object.entries(respostas).slice(0, 200)) {
    if (!crits || typeof crits !== "object") continue;
    const id = String(doreId).slice(0, 60);
    const r = {};
    for (const [critId, valor] of Object.entries(crits)) {
      const v = Number(valor);
      // 1-4 = escalas dos critérios; 0 = "desmarquei" na triagem
      if ([0, 1, 2, 3, 4].includes(v)) r[String(critId).slice(0, 30)] = v;
    }
    if (Object.keys(r).length) limpo[id] = r;
  }
  return limpo;
}

export default async (req) => {
  const store = getStore({ name: "votacao-priorizacao", consistency: "strong" });

  if (req.method === "GET") {
    const nome = new URL(req.url).searchParams.get("nome");
    const chave = chaveDoNome(nome);
    if (!chave) return new Response(JSON.stringify({ registro: null }), { status: 200 });
    const registro = await store.get(chave, { type: "json" });
    return new Response(JSON.stringify({ registro: registro || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido." }), { status: 400 });
  }

  const nome = body && typeof body.nome === "string" ? body.nome.trim() : "";
  const chave = chaveDoNome(nome);
  if (!chave) {
    return new Response(JSON.stringify({ error: "Nome ausente." }), { status: 400 });
  }

  const registro = {
    nome: nome.slice(0, 80),
    entrouEm: Number(body.entrouEm) || Date.now(),
    ts: Date.now(),
    respostas: sanitizarRespostas(body.respostas),
  };
  await store.setJSON(chave, registro);

  return new Response(JSON.stringify({ ok: true, ts: registro.ts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/vote" };

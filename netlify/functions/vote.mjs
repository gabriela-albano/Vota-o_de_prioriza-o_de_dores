import { getStore } from "@netlify/blobs";

// Aceita um voto parcial: {nome, doreId, criterioId, valor}.
// Faz merge no registro existente do participante (não sobrescreve as
// respostas anteriores dele em outras dores/critérios) — pensado para o
// modo guiado, onde cada resposta é salva assim que a pessoa clica, sem
// esperar um botão de "enviar tudo" no final.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido." }), { status: 400 });
  }

  const { nome, doreId, criterioId, valor } = body || {};
  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return new Response(JSON.stringify({ error: "Nome ausente." }), { status: 400 });
  }
  if (!doreId || !criterioId || ![1, 2, 3, 4].includes(Number(valor))) {
    return new Response(JSON.stringify({ error: "Resposta inválida." }), { status: 400 });
  }

  const store = getStore("votacao-priorizacao");
  const chave = nome.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `anon-${Date.now()}`;

  const atual = (await store.get(chave, { type: "json" })) || { nome: nome.trim(), respostas: {} };
  if (!atual.respostas) atual.respostas = {};
  if (!atual.respostas[doreId]) atual.respostas[doreId] = {};
  atual.respostas[doreId][criterioId] = Number(valor);
  atual.nome = nome.trim();
  atual.ts = Date.now();

  await store.setJSON(chave, atual);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/vote" };

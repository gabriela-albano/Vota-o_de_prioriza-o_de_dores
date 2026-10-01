import { getStore } from "@netlify/blobs";

// Estado compartilhado do "modo guiado": qual dor está em votação agora e
// desde quando, para o cronômetro ser o mesmo para todo mundo.
//   etapa: -1 (ainda não começou) | número (índice da dor atual) | "fim"
//   duracaoSeg: quantos segundos essa etapa dura
//   iniciadoEm: timestamp (ms) de quando essa etapa começou a contar
//   modo: "completa" (3 critérios, só nas dores "selecionada") | "triagem"
//         (voto rápido sim/não, sobre TODAS as dores do banco, para decidir
//         quais entram na rodada completa)
//   sessao: número que muda a cada "Zerar votos". Os participantes guardam as
//         próprias respostas no celular e reenviam o conjunto completo a cada
//         clique — sem isso, depois de zerar, o próximo clique de qualquer
//         pessoa devolvia TODOS os votos antigos. Quando a sessao muda, o
//         celular descarta o que tinha e começa do zero.
const DEFAULT_STATE = { etapa: -1, duracaoSeg: 180, iniciadoEm: null, modo: "triagem", sessao: 1 };

export default async (req) => {
  const store = getStore({ name: "votacao-priorizacao-estado", consistency: "strong" });

  if (req.method === "GET") {
    const estado = (await store.get("estado", { type: "json" })) || DEFAULT_STATE;
    return new Response(JSON.stringify(estado), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido." }), { status: 400 });
    }

    const { etapa, duracaoSeg, modo } = body || {};
    if (etapa === undefined) {
      return new Response(JSON.stringify({ error: "Campo 'etapa' ausente." }), { status: 400 });
    }

    const atual = (await store.get("estado", { type: "json" })) || DEFAULT_STATE;
    const novoEstado = {
      sessao: Number(atual.sessao) || 1,
      etapa,
      duracaoSeg: Number(duracaoSeg) || DEFAULT_STATE.duracaoSeg,
      iniciadoEm: Date.now(),
      modo: modo === "triagem" ? "triagem" : "completa",
    };
    await store.setJSON("estado", novoEstado);

    return new Response(JSON.stringify(novoEstado), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
};

export const config = { path: "/api/estado" };
import { getStore } from "@netlify/blobs";

// Catálogo editável das dores. Na primeira vez que alguém abrir o admin ou
// a votação, se ainda não existir nada salvo, este arquivo "semeia" o banco
// com as 32 dores do material original (25 do Quadro de Dores + 7 Dores
// Prioritárias). A partir daí, tudo passa a viver no banco (Netlify Blobs)
// e pode ser editado, adicionado ou removido pelo painel de admin — este

// "processos" é a fonte de verdade para o peso de cada dor (quantos de
// PJ/PF/EF ela atravessa) — classificação extraída da tabela oficial do
// mapeamento (seção 19 "Dores transversais" + badges "Transversal PF+PJ+EF"
// / "Transversal PF+PJ" nas Dores Prioritárias e no Quadro de Dores), não
// presumida. "area" continua sendo só o rótulo de exibição.
const SEED = [
  { id: "dor-26", numero: 1, area: "Transversal", texto: "Governança de papéis indefinida: Gestor do Contrato x Fiscal Técnico, linhas tênues entre Capacitação/CGRO/DSC, e responsável único em Acompanhar Palestra (EF)", processos: ["PJ", "PF", "EF"], selecionada: true },
  { id: "dor-27", numero: 2, area: "Transversal (PF+PJ)", texto: "Sobrecarga de contratos por servidor", processos: ["PJ", "PF"], selecionada: true },
  { id: "dor-01", numero: 3, area: "Transversal", texto: "Transição SEI ↔ Sistema de Gestão: dupla operação gera duplicidade e inconsistência", processos: ["PJ", "PF", "EF"], selecionada: true },
  { id: "dor-02", numero: 4, area: "Transversal", texto: "Planilha Excel paralela ao Sistema de Gestão para controle de solicitações", processos: ["PJ", "PF", "EF"], selecionada: true },
  { id: "dor-03", numero: 5, area: "Transversal", texto: "Etapas que dependem de poucas pessoas: risco se alguém sair ou ficar indisponível", processos: ["PJ", "PF", "EF"], selecionada: true },
  { id: "dor-28", numero: 6, area: "Transversal (PF+PJ)", texto: "Reserva de sala feita incompleta só para garantir a data", processos: ["PJ", "PF"], selecionada: true },
  { id: "dor-09", numero: 7, area: "PJ", texto: "Regras de contratação com o Estado (conta no Banco do Brasil) atrasam a formalização", processos: ["PJ"], selecionada: true },
  { id: "dor-10", numero: 8, area: "PJ", texto: "Dependência de empresas e terceiros externos: pesquisa de preços, certificados e nota fiscal", processos: ["PJ"], selecionada: true },
  { id: "dor-04", numero: 9, area: "Transversal (PF+EF)", texto: "Dificuldades do contratado ao Solicitar: cadastro com erros/demora e assinatura digital", processos: ["PF", "EF"], selecionada: true },
  { id: "dor-20", numero: 10, area: "EF", texto: "Lacuna normativa no gatilho do processo (risco de auditoria já identificado pelo time)", processos: ["EF"], selecionada: true },
  { id: "dor-21", numero: 11, area: "EF", texto: "Turma por estimativa: recurso preso em cancelamentos e inconsistência da proposta", processos: ["EF"], selecionada: true },
  { id: "dor-32", numero: 12, area: "EF", texto: "Sem nenhum prazo de referência definido para Solicitar, Analisar e Formalizar", processos: ["EF"], selecionada: true },
  { id: "dor-29", numero: 13, area: "Transversal (PF+PJ)", texto: "Prazo de contratação: regras empilhadas, solicitações sem tempo hábil e devolução que zera o prazo", processos: ["PJ", "PF"], selecionada: true },
  { id: "dor-19", numero: 14, area: "PF", texto: "Solicitar regularização: documentos de habilitação não conformes", processos: ["PF"], selecionada: true },
  { id: "dor-22", numero: 15, area: "EF", texto: "Dependência de terceiros e sistemas externos: certidões e guia de ISS", processos: ["EF"], selecionada: true },
  { id: "dor-11", numero: 16, area: "PJ", texto: "Processo segue sem assinaturas por pressão de prazo (vale para todas as assinaturas)", processos: ["PJ"], selecionada: true },
  { id: "dor-12", numero: 17, area: "PJ", texto: "Acompanhar realização do empenho", processos: ["PJ"], selecionada: true },
  { id: "dor-05", numero: 18, area: "Transversal (PF+EF)", texto: "Atraso no empenho força decisão de adiar ou prosseguir com o curso/palestra", processos: ["PF", "EF"], selecionada: true },
  { id: "dor-13", numero: 19, area: "PJ", texto: "Vagas solicitadas em número superior aos inscritos (mitigada em parte)", processos: ["PJ"], selecionada: true },
  { id: "dor-14", numero: 20, area: "PJ", texto: "Fechamento das inscrições sob pressão de prazo", processos: ["PJ"], selecionada: true },
  { id: "dor-30", numero: 21, area: "PJ", texto: "Prazo de análise do CGGP e demora no envio de documentos regularizados", processos: ["PJ"], selecionada: true },
  { id: "dor-31", numero: 22, area: "Transversal", texto: "Falta de protocolo de contingência técnica + suporte técnico sobrecarregado durante o curso", processos: ["PJ", "PF", "EF"], selecionada: true },
  { id: "dor-15", numero: 23, area: "PJ", texto: "Vagas ociosas em turmas in company sem ação clara de monitoramento", processos: ["PJ"], selecionada: true },
  { id: "dor-16", numero: 24, area: "PJ", texto: "Planejamento por estimativa não foi executado como previsto (contratos in company)", processos: ["PJ"], selecionada: true },
  { id: "dor-23", numero: 25, area: "EF", texto: "Cobrança de documentos apesar de comprovações consolidadas", processos: ["EF"], selecionada: true },
  { id: "dor-24", numero: 26, area: "EF", texto: "Variação de comportamento entre educadores", processos: ["EF"], selecionada: true },
  { id: "dor-25", numero: 27, area: "EF", texto: "Atraso na cadeia documental de Pagamento: lista de presença → termo provisório → ISS", processos: ["EF"], selecionada: true },
  { id: "dor-08", numero: 28, area: "Transversal (PJ+PF)", texto: "Participante externo, QR code e lista de presença", processos: ["PJ", "PF"], selecionada: true },
  { id: "dor-17", numero: 29, area: "PF", texto: "Elaborar o termo de recebimento provisório: prazo de 2 dias úteis", processos: ["PF"], selecionada: true },
  { id: "dor-18", numero: 30, area: "PF", texto: "Cálculo de IR/INSS no RPA: planilha paralela e retrabalho", processos: ["PF"], selecionada: true },
  { id: "dor-06", numero: 31, area: "Transversal (PF+EF)", texto: "Demora ou não devolução do RPA assinado pelo contratado", processos: ["PF", "EF"], selecionada: true },
  { id: "dor-07", numero: 32, area: "Transversal (PF+EF)", texto: "Risco de CADIN do contratado pessoa física, impactando o pagamento", processos: ["PF", "EF"], selecionada: true },
];

const PROCESSOS_VALIDOS = ["PJ", "PF", "EF"];

// Critérios de avaliação — texto padrão (editável no painel de admin, em
// "Critérios de avaliação"; o que for salvo lá substitui isto).
const CRITERIOS_PADRAO = [
  {
    id: "c1",
    titulo: "Consequência de falha",
    pergunta: "Se essa dor continuar exatamente como está pelo próximo ano, o estrago para o trabalho seria:",
    escala: ["Pequeno", "Incômodo", "Sério", "Grave"],
  },
  {
    id: "c2",
    titulo: "Impacto de retrabalho",
    pergunta: "Considere a frequência com que essa dor ocorre ou o volume de trabalho gerado por ela:",
    escala: ["Pequeno", "Incômodo", "Sério", "Grave"],
  },
  {
    id: "c3",
    titulo: "Potencial de automação",
    pergunta: "O quanto essa dor parece resolvível com tecnologia ou sistema, hoje:",
    escala: ["Muito difícil", "Daria trabalho", "Em parte, sim", "Fácil, é só integrar/automatizar"],
  },
];
const PESOS = { c1: 3, c2: 2, c3: 1 };

// Descobre os processos de uma dor salva ANTES do campo "processos" existir:
// 1º pelo id (tabela oficial acima), 2º pelas siglas escritas no rótulo de área.
const SEED_POR_ID = Object.fromEntries(SEED.map((d) => [d.id, d.processos]));
function processosDe(d) {
  if (Array.isArray(d.processos)) {
    return PROCESSOS_VALIDOS.filter((p) => d.processos.includes(p));
  }
  if (SEED_POR_ID[d.id]) return [...SEED_POR_ID[d.id]];
  const area = String(d.area || "").toUpperCase();
  return PROCESSOS_VALIDOS.filter((p) => new RegExp("\\b" + p + "\\b").test(area));
}

function sanitizar(dores) {
  if (!Array.isArray(dores)) return [];
  // "numero" = número fixo do card (o mesmo da Oficina de priorização) — não muda
  // quando a lista é cortada/reordenada. Dor nova ganha o próximo número livre.
  let proximo = Math.max(0, ...dores.map((d) => Number(d && d.numero) || 0)) + 1;
  return dores
    .filter((d) => d && typeof d === "object")
    .map((d, i) => {
      const processos = processosDe(d);
      const numero = Number(d.numero) > 0 ? Number(d.numero) : proximo++;
      return {
        id: String(d.id || `dor-nova-${Date.now()}-${i}`).slice(0, 60),
        numero,
        area: String(d.area || "").slice(0, 60),
        texto: String(d.texto || "").slice(0, 500),
        processos,
        // mantido por compatibilidade — a fonte de verdade do peso é processos.length
        transversal: processos.length > 1,
        selecionada: d.selecionada !== false,
      };
    })
    .filter((d) => d.texto.trim().length > 0);
}

function sanitizarCriterios(criterios) {
  if (!Array.isArray(criterios)) return null;
  const porId = Object.fromEntries(criterios.filter((c) => c && c.id).map((c) => [c.id, c]));
  return CRITERIOS_PADRAO.map((padrao) => {
    const c = porId[padrao.id] || {};
    const escala = Array.isArray(c.escala) ? c.escala : padrao.escala;
    return {
      id: padrao.id,
      peso: PESOS[padrao.id],
      titulo: String(c.titulo || padrao.titulo).slice(0, 80),
      pergunta: String(c.pergunta || padrao.pergunta).slice(0, 400),
      escala: [0, 1, 2, 3].map((i) => String(escala[i] || padrao.escala[i]).slice(0, 60)),
    };
  });
}

function responder(obj) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export default async (req) => {
  const store = getStore({ name: "votacao-priorizacao-catalogo", consistency: "strong" });

  let catalogo = await store.get("catalogo", { type: "json" });
  let precisaSalvar = false;
  if (!catalogo || !Array.isArray(catalogo.dores) || catalogo.dores.length === 0) {
    catalogo = { dores: SEED, atualizadoEm: Date.now() };
    precisaSalvar = true;
  }
  // migração 1: catálogo salvo ANTES da numeração oficial (card 1 a 32 da Oficina
  // de priorização) → adota a lista oficial (novos títulos, ordem e números).
  // Preserva quais dores estavam "Ativas" e mantém dores adicionadas à mão (no fim).
  if (!catalogo.dores.some((d) => Number(d.numero) > 0)) {
    const antigas = new Map(catalogo.dores.map((d) => [d.id, d]));
    const oficiais = SEED.map((o) => ({
      ...o,
      selecionada: antigas.has(o.id) ? antigas.get(o.id).selecionada !== false : true,
    }));
    const extras = catalogo.dores.filter((d) => !SEED_POR_ID[d.id]);
    catalogo.dores = [...oficiais, ...extras];
    precisaSalvar = true;
  }
  // migração 2: dores salvas antes do campo "processos" ganham a classificação
  if (catalogo.dores.some((d) => !Array.isArray(d.processos))) {
    catalogo.dores = sanitizar(catalogo.dores);
    precisaSalvar = true;
  }
  if (catalogo.dores.some((d) => !(Number(d.numero) > 0))) {
    catalogo.dores = sanitizar(catalogo.dores);
    precisaSalvar = true;
  }
  if (!Array.isArray(catalogo.criterios)) {
    catalogo.criterios = sanitizarCriterios(CRITERIOS_PADRAO);
    precisaSalvar = true;
  }

  if (req.method === "GET") {
    if (precisaSalvar) await store.setJSON("catalogo", catalogo);
    return responder(catalogo);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido." }), { status: 400 });
    }
    // Pode salvar só as dores, só os critérios, ou os dois.
    if (body && Array.isArray(body.dores)) catalogo.dores = sanitizar(body.dores);
    const crit = body && sanitizarCriterios(body.criterios);
    if (crit) catalogo.criterios = crit;
    catalogo.atualizadoEm = Date.now();
    await store.setJSON("catalogo", catalogo);
    return responder(catalogo);
  }

  return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
};

export const config = { path: "/api/catalogo" };
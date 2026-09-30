import { getStore } from "@netlify/blobs";

// Catálogo editável das dores. Na primeira vez que alguém abrir o admin ou
// a votação, se ainda não existir nada salvo, este arquivo "semeia" o banco
// com as 32 dores do material original (25 do Quadro de Dores + 7 Dores
// Prioritárias). A partir daí, tudo passa a viver no banco (Netlify Blobs)
// e pode ser editado, adicionado ou removido pelo painel de admin — este
// SEED só serve de ponto de partida, nunca mais é lido depois da primeira vez.
const SEED = [
  { id: "dor-01", area: "Transversal", texto: "Transição SEI ↔ Sistema de Gestão: dupla operação gera duplicidade e inconsistência", transversal: true, selecionada: true },
  { id: "dor-02", area: "Transversal", texto: "Planilha Excel paralela ao Sistema de Gestão para controle de solicitações", transversal: true, selecionada: true },
  { id: "dor-03", area: "Transversal", texto: "Capacidade da equipe sob pressão: concentração operacional e risco de continuidade", transversal: true, selecionada: true },
  { id: "dor-04", area: "Transversal (PF+EF)", texto: "Dificuldades do contratado ao Solicitar: cadastro com erros/demora e assinatura digital", transversal: true, selecionada: true },
  { id: "dor-05", area: "Transversal (PF+EF)", texto: "Atraso no empenho força decisão de adiar ou prosseguir com o curso/palestra", transversal: true, selecionada: true },
  { id: "dor-06", area: "Transversal (PF+EF)", texto: "Demora ou não devolução do RPA assinado pelo contratado", transversal: true, selecionada: true },
  { id: "dor-07", area: "Transversal (PF+EF)", texto: "Risco de CADIN do contratado pessoa física, impactando o pagamento", transversal: true, selecionada: true },
  { id: "dor-08", area: "Transversal (PJ+PF)", texto: "Participante externo, QR code e lista de presença", transversal: true, selecionada: true },
  { id: "dor-09", area: "PJ", texto: "Regras de contratação com o Estado (conta no Banco do Brasil) atrasam a formalização", transversal: false, selecionada: true },
  { id: "dor-10", area: "PJ", texto: "Dependência de empresas e terceiros externos: pesquisa de preços, certificados e nota fiscal", transversal: false, selecionada: true },
  { id: "dor-11", area: "PJ", texto: "Processo segue sem assinaturas por pressão de prazo (vale para todas as assinaturas)", transversal: false, selecionada: true },
  { id: "dor-12", area: "PJ", texto: "Acompanhar realização do empenho", transversal: false, selecionada: true },
  { id: "dor-13", area: "PJ", texto: "Vagas solicitadas em número superior aos inscritos (mitigada em parte)", transversal: false, selecionada: true },
  { id: "dor-14", area: "PJ", texto: "Fechamento das inscrições sob pressão de prazo", transversal: false, selecionada: true },
  { id: "dor-15", area: "PJ", texto: "Vagas ociosas em turmas in company sem ação clara de monitoramento", transversal: false, selecionada: true },
  { id: "dor-16", area: "PJ", texto: "Planejamento por estimativa não foi executado como previsto (contratos in company)", transversal: false, selecionada: true },
  { id: "dor-17", area: "PF", texto: "Elaborar o termo de recebimento provisório: prazo de 2 dias úteis", transversal: false, selecionada: true },
  { id: "dor-18", area: "PF", texto: "Cálculo de IR/INSS no RPA: planilha paralela e retrabalho", transversal: false, selecionada: true },
  { id: "dor-19", area: "PF", texto: "Solicitar regularização: documentos de habilitação não conformes", transversal: false, selecionada: true },
  { id: "dor-20", area: "EF", texto: "Lacuna normativa no gatilho do processo (risco de auditoria já identificado pelo time)", transversal: false, selecionada: true },
  { id: "dor-21", area: "EF", texto: "Turma por estimativa: recurso preso em cancelamentos e inconsistência da proposta", transversal: false, selecionada: true },
  { id: "dor-22", area: "EF", texto: "Dependência de terceiros e sistemas externos: certidões e guia de ISS", transversal: false, selecionada: true },
  { id: "dor-23", area: "EF", texto: "Cobrança de documentos apesar de comprovações consolidadas", transversal: false, selecionada: true },
  { id: "dor-24", area: "EF", texto: "Variação de comportamento entre educadores", transversal: false, selecionada: true },
  { id: "dor-25", area: "EF", texto: "Atraso na cadeia documental de Pagamento: lista de presença → termo provisório → ISS", transversal: false, selecionada: true },
  { id: "dor-26", area: "Transversal", texto: "Governança de papéis indefinida: Gestor do Contrato x Fiscal Técnico, linhas tênues entre Capacitação/CGRO/DSC, e responsável único em Acompanhar Palestra (EF)", transversal: true, selecionada: true },
  { id: "dor-27", area: "Transversal (PF+PJ)", texto: "Sobrecarga de contratos por servidor", transversal: true, selecionada: true },
  { id: "dor-28", area: "Transversal (PF+PJ)", texto: "Reserva de sala feita incompleta só para garantir a data", transversal: true, selecionada: true },
  { id: "dor-29", area: "Transversal (PF+PJ)", texto: "Prazo de contratação: regras empilhadas, solicitações sem tempo hábil e devolução que zera o prazo", transversal: true, selecionada: true },
  { id: "dor-30", area: "PJ", texto: "Prazo de análise do CGGP e demora no envio de documentos regularizados", transversal: false, selecionada: true },
  { id: "dor-31", area: "Transversal", texto: "Falta de protocolo de contingência técnica + suporte técnico sobrecarregado durante o curso", transversal: true, selecionada: true },
  { id: "dor-32", area: "EF", texto: "Sem nenhum prazo de referência definido para Solicitar/Analisar/Formalizar", transversal: false, selecionada: true },
];

function sanitizar(dores) {
  if (!Array.isArray(dores)) return [];
  return dores
    .filter((d) => d && typeof d === "object")
    .map((d, i) => ({
      id: String(d.id || `dor-nova-${Date.now()}-${i}`).slice(0, 60),
      area: String(d.area || "").slice(0, 60),
      texto: String(d.texto || "").slice(0, 500),
      transversal: !!d.transversal,
      selecionada: d.selecionada !== false,
    }))
    .filter((d) => d.texto.trim().length > 0);
}

export default async (req) => {
  const store = getStore("votacao-priorizacao-catalogo");

  if (req.method === "GET") {
    let catalogo = await store.get("catalogo", { type: "json" });
    if (!catalogo || !Array.isArray(catalogo.dores) || catalogo.dores.length === 0) {
      catalogo = { dores: SEED, atualizadoEm: Date.now() };
      await store.setJSON("catalogo", catalogo);
    }
    return new Response(JSON.stringify(catalogo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido." }), { status: 400 });
    }

    const dores = sanitizar(body && body.dores);
    const catalogo = { dores, atualizadoEm: Date.now() };
    await store.setJSON("catalogo", catalogo);

    return new Response(JSON.stringify(catalogo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405 });
};

export const config = { path: "/api/catalogo" };

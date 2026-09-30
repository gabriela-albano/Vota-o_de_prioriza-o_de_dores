// ============================================================================
// CONFIGURAÇÃO DA VOTAÇÃO — edite este arquivo para ajustar dores/critérios
// ============================================================================
// Lista carregada a partir do "Quadro de Dores" (25 cards consolidados) do
// arquivo Fazesp_OKR_Gestao_de_Processos_10.html que você enviou. Tudo
// abaixo é editável: apague, junte, reescreva ou reordene à vontade.
//
// Campos de cada dor:
//   id           -> identificador curto e único (não aparece para o participante)
//   area         -> texto mostrado como etiqueta (PJ, PF, EF ou Transversal...)
//   texto        -> o texto da dor como aparece na tela de votação
//   transversal  -> true aplica o bônus ×1,3 na fórmula de score (dor presente
//                   em mais de um dos três processos)
//   jaResolvida  -> true TIRA a dor da votação sem precisar apagar o card
//                   (use para excluir uma dor já resolvida/em andamento)
// ============================================================================

const DORES_TODAS = [
  {
    id: "dor-01",
    area: "Transversal",
    texto: "Transição SEI ↔ Sistema de Gestão: dupla operação gera duplicidade e inconsistência",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-02",
    area: "Transversal",
    texto: "Planilha Excel paralela ao Sistema de Gestão para controle de solicitações",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-03",
    area: "Transversal",
    texto: "Capacidade da equipe sob pressão: concentração operacional e risco de continuidade",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-04",
    area: "Transversal (PF+EF)",
    texto: "Dificuldades do contratado ao Solicitar: cadastro com erros/demora e assinatura digital",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-05",
    area: "Transversal (PF+EF)",
    texto: "Atraso no empenho força decisão de adiar ou prosseguir com o curso/palestra",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-06",
    area: "Transversal (PF+EF)",
    texto: "Demora ou não devolução do RPA assinado pelo contratado",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-07",
    area: "Transversal (PF+EF)",
    texto: "Risco de CADIN do contratado pessoa física, impactando o pagamento",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-08",
    area: "Transversal (PJ+PF)",
    texto: "Participante externo, QR code e lista de presença",
    transversal: true,
    jaResolvida: false,
  },
  {
    id: "dor-09",
    area: "PJ",
    texto: "Regras de contratação com o Estado (conta no Banco do Brasil) atrasam a formalização",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-10",
    area: "PJ",
    texto: "Dependência de empresas e terceiros externos: pesquisa de preços, certificados e nota fiscal",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-11",
    area: "PJ",
    texto: "Processo segue sem assinaturas por pressão de prazo (vale para todas as assinaturas)",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-12",
    area: "PJ",
    texto: "Acompanhar realização do empenho",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-13",
    area: "PJ",
    texto: "Vagas solicitadas em número superior aos inscritos (mitigada em parte)",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-14",
    area: "PJ",
    texto: "Fechamento das inscrições sob pressão de prazo",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-15",
    area: "PJ",
    texto: "Vagas ociosas em turmas in company sem ação clara de monitoramento",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-16",
    area: "PJ",
    texto: "Planejamento por estimativa não foi executado como previsto (contratos in company)",
    transversal: false,
    jaResolvida: false,
  },
  {
    // ATENÇÃO — confira antes de publicar: não achei, no "Quadro de Dores",
    // nenhum card com o texto exato "Elaboração de termos de recebimento"
    // (PJ, automação por integração de sistema, já em execução) que você
    // sinalizou como resolvida. O card abaixo é parecido no tema, mas fala
    // do lado PF/EF (prazo de 2 dias úteis para elaborar), não do item de
    // automação em andamento no lado PJ. Ou seja: pelo que vi, a dor já
    // resolvida pode nem estar nesta lista de 25 — confirme comigo ou
    // ajuste aqui. Se este card for, na prática, a mesma coisa, troque
    // jaResolvida para true.
    id: "dor-17",
    area: "PF",
    texto: "Elaborar o termo de recebimento provisório: prazo de 2 dias úteis",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-18",
    area: "PF",
    texto: "Cálculo de IR/INSS no RPA: planilha paralela e retrabalho",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-19",
    area: "PF",
    texto: "Solicitar regularização: documentos de habilitação não conformes",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-20",
    area: "EF",
    texto: "Lacuna normativa no gatilho do processo (risco de auditoria já identificado pelo time)",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-21",
    area: "EF",
    texto: "Turma por estimativa: recurso preso em cancelamentos e inconsistência da proposta",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-22",
    area: "EF",
    texto: "Dependência de terceiros e sistemas externos: certidões e guia de ISS",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-23",
    area: "EF",
    texto: "Cobrança de documentos apesar de comprovações consolidadas",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-24",
    area: "EF",
    texto: "Variação de comportamento entre educadores",
    transversal: false,
    jaResolvida: false,
  },
  {
    id: "dor-25",
    area: "EF",
    texto: "Atraso na cadeia documental de Pagamento: lista de presença → termo provisório → ISS",
    transversal: false,
    jaResolvida: false,
  },
];

// Lista efetiva de votação: tira automaticamente qualquer dor marcada como
// jaResolvida acima, sem precisar apagar o card (fica documentado por quê).
const DORES = DORES_TODAS.filter(d => !d.jaResolvida);

// ============================================================================
// TEXTO DOS 3 CRITÉRIOS (linguagem simples, sem jargão de BPM)
// C1 = consequência de falha (peso ×3 na fórmula da Ferramenta de Priorização)
// C2 = volume de retrabalho (peso ×2)
// C3 = potencial de automação (peso ×1, e é o eixo X do mapa de calor)
// ============================================================================

const CRITERIOS = [
  {
    id: "c1",
    titulo: "Consequência de falha",
    pergunta: "Se essa dor continuar exatamente como está pelo próximo ano, o estrago para o trabalho ou para o contribuinte seria:",
    escala: ["Pequeno", "Incômodo", "Sério", "Grave"],
  },
  {
    id: "c2",
    titulo: "Volume de retrabalho",
    pergunta: "Com que frequência você ou sua equipe esbarram nessa dor, ou precisam refazer algo por causa dela:",
    escala: ["Raramente", "De vez em quando", "Toda semana", "Toda hora"],
  },
  {
    id: "c3",
    titulo: "Potencial de automação",
    pergunta: "O quanto essa dor parece resolvível com tecnologia ou sistema, hoje:",
    escala: ["Muito difícil", "Daria trabalho", "Em parte, sim", "Fácil, é só integrar/automatizar"],
  },
];

// Duração padrão por dor no modo guiado (segundos). Dá para mudar isso na
// hora, no painel de admin, sem precisar editar este arquivo.
const DURACAO_PADRAO_SEG = 120;

// PIN simples para abrir o painel de admin (não é segurança de verdade,
// só evita que alguém abra o link por engano). Troque antes de publicar.
const ADMIN_PIN = "cgpi2026";

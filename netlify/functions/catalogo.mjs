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
  { id: "dor-26", numero: 1, area: "Transversal", texto: "Governança de papéis indefinida: Gestor do Contrato x Fiscal Técnico, linhas tênues entre Capacitação/CGRO/DSC, e responsável único em Acompanhar Palestra (EF)", processos: ["PJ", "PF", "EF"], etapa: "Atravessa o processo todo", contexto: "A separação dos papéis de Gestor do Contrato e Fiscal Técnico em PF e PJ é definida por lei, e cada área já está ciente de que deve se organizar para cumprir a legislação. O time também colocou a necessidade de uniformizar o entendimento dos papéis e responsabilidades entre Capacitação, CGRO e DSC. Em EF, foi levantada a necessidade de deixar mais claras as responsabilidades do Gestor do Contrato, inclusive de como exercê-las, principalmente no acompanhamento da palestra e nos documentos obrigatórios para o pagamento; e não há responsável único explicitado para tratar a variação de comportamento entre educadores.", onde: [["PJ", "Gerenciar Inscrições; Acompanhar Curso/Evento; Encaminhar para Pagamento"], ["PF", "Acompanhar Curso/Evento; Encaminhar para Pagamento"], ["EF", "Acompanhar Palestra"]], selecionada: true },
  { id: "dor-27", numero: 2, area: "Transversal (PF+PJ)", texto: "Sobrecarga de contratos por servidor", processos: ["PJ", "PF"], etapa: "Atravessa o processo todo", contexto: "A dor foi registrada pela própria equipe, com ênfase, na nota do subprocesso Instruir Processo (PJ). Foi tratada como geral aos dois processos: a sobrecarga de contratos por servidor alcança todos os subprocessos e a atividade de PF e PJ, não só a instrução processual.", onde: [["PJ", "Todos os subprocessos (registrada na nota de Instruir Processo)"], ["PF", "Todos os subprocessos e a atividade"]], selecionada: true },
  { id: "dor-01", numero: 3, area: "Transversal", texto: "Transição SEI ↔ Sistema de Gestão: dupla operação gera duplicidade e inconsistência", processos: ["PJ", "PF", "EF"], etapa: "Atravessa o processo todo", contexto: "Enquanto o Sistema de Gestão não cobre todo o trâmite, parte do trabalho acontece no SEI e parte no sistema. Em PJ, a dupla operação aparece em várias atividades de Solicitar e Analisar: abrir processo no SEI, anexar e assinar documentos, cadastrar curso e elaborar documentação. Em PF e EF, aparece ao analisar a solicitação. A implantação do sistema está em andamento.", onde: [["PJ", "Solicitar Contratação; Analisar Solicitação"], ["PF", "Analisar Solicitação (CGRO)"], ["EF", "Analisar Solicitação (CGRO)"]], selecionada: true },
  { id: "dor-02", numero: 4, area: "Transversal", texto: "Planilha Excel paralela ao Sistema de Gestão para controle de solicitações", processos: ["PJ", "PF", "EF"], etapa: "Atravessa o processo todo", contexto: "Os três processos usam uma planilha Excel em paralelo ao Sistema de Gestão para controlar as solicitações. A descontinuação da planilha já está decidida para os três processos (em EF, com data definida).", onde: [["PJ", "Analisar Solicitação (checar documentos obrigatórios)"], ["PF", "Analisar Solicitação (inserir dados na planilha de controle)"], ["EF", "Analisar Solicitação"]], selecionada: true },
  { id: "dor-03", numero: 5, area: "Transversal", texto: "Etapas que dependem de poucas pessoas: risco se alguém sair ou ficar indisponível", processos: ["PJ", "PF", "EF"], etapa: "Atravessa o processo todo", contexto: "Em PJ, a colaboradora responsável pela vinculação do item de serviço (CGRO) está deixando a equipe, sem plano de sucessão registrado. A mesma CGRO atende PF, PJ e EF. Em EF, o time percebe o tempo de vinculação como possível gargalo, e a raia Gestor do Contrato concentra a maior parte das atividades operacionais em três dos quatro subprocessos (Solicitar, Formalizar e Pagamento).", onde: [["PJ", "Solicitar Contratação (vincular item de serviço, CGRO)"], ["EF", "Solicitar Contratação (vincular item de serviço, CGRO); raia Gestor do Contrato em Solicitar, Formalizar e Pagamento"]], selecionada: true },
  { id: "dor-28", numero: 6, area: "Transversal (PF+PJ)", texto: "Reserva de sala feita incompleta só para garantir a data", processos: ["PJ", "PF"], etapa: "Solicitar Contratação", contexto: "O registro está no board de PJ, mas a reserva é obrigatória sempre que a infraestrutura da Sefaz é usada, independentemente do processo; por isso a dor atinge PF e PJ. O tema foi objeto de muitas discussões durante o mapeamento.", onde: [["PJ", "Solicitar Contratação (reservar a sala no sistema de gestão)"], ["PF", "Mesma exigência de reserva (registro no board de PJ)"]], selecionada: true },
  { id: "dor-09", numero: 7, area: "PJ", texto: "Regras de contratação com o Estado (conta no Banco do Brasil) atrasam a formalização", processos: ["PJ"], etapa: "Solicitar Contratação", contexto: "O atendimento das regras para contratar com o Estado tem grande impacto no tempo de contratação. A verificação das regras também é feita quando a solicitação chega à CGRO.", onde: [["PJ", "Solicitar Contratação"]], selecionada: true },
  { id: "dor-10", numero: 8, area: "PJ", texto: "Dependência de empresas e terceiros externos: pesquisa de preços, certificados e nota fiscal", processos: ["PJ"], etapa: "Solicitar Contratação", contexto: "Três registros do time em PJ: as empresas consultadas demoram a responder à pesquisa de preços, ou respondem com informações faltantes ou em desacordo com as regras de contratação; muitas empresas não emitem o certificado logo após o curso, com casos de 15 a 30 dias de atraso; e, ao emitir a nota fiscal, as empresas muitas vezes usam o CNPJ da Sefaz e não o da Fazesp, além de outros erros.", onde: [["PJ", "Solicitar Contratação (pesquisa de preços, proposta comercial); Encaminhar para Pagamento (certificados, nota fiscal)"]], selecionada: true },
  { id: "dor-04", numero: 9, area: "Transversal (PF+EF)", texto: "Dificuldades do contratado ao Solicitar: cadastro com erros/demora e assinatura digital", processos: ["PF", "EF"], etapa: "Solicitar Contratação", contexto: "Em PF, ocorrem devoluções por erros no cadastro e demora no preenchimento pelo instrutor, e alguns instrutores demonstraram dificuldade em assinar digitalmente. Em EF, há muitos erros no cadastro, demora para preencher e enviar os documentos necessários, e alguns educadores demoram a assinar.", onde: [["PF", "Preencher/conferir cadastro (Facilitador); Notificar o instrutor para assinatura"], ["EF", "Preencher/conferir cadastro (Educador); Assinar digitalmente a proposta"]], selecionada: true },
  { id: "dor-20", numero: 10, area: "EF", texto: "Lacuna normativa no gatilho do processo (risco de auditoria já identificado pelo time)", processos: ["EF"], etapa: "Solicitar Contratação", contexto: "Quem cria a demanda é a educação fiscal, por meio de planejamento, e o representante oferece as palestras planejadas. Havia uma resolução do Secretário de planejamento da Educação Fiscal, que não foi mais publicada. O time registrou como risco a confusão de papéis entre representante e educador alinhado ao planejamento, agravada pela falta da resolução, com possível prejuízo à lisura de demanda, representante e educador.", onde: [["EF", "Solicitar Contratação (gatilho do processo)"]], selecionada: true },
  { id: "dor-21", numero: 11, area: "EF", texto: "Turma por estimativa: recurso preso em cancelamentos e inconsistência da proposta", processos: ["EF"], etapa: "Solicitar Contratação", contexto: "A turma aberta no Sistema de Gestão é criada unicamente para prosseguir com a contratação por estimativa; a turma do planejamento real é criada em momento posterior. O cancelamento de uma turma prende o recurso, e, se o gestor não recorre a essa prática, precisa abrir muitas turmas a mais. O texto da proposta tem sido ajustado em muitos pontos, o que pode gerar inconsistência de informações. O termo \"por estimativa\" também aparece em PJ (Acompanhar Curso e Evento), descrevendo outro mecanismo.", onde: [["EF", "Solicitar Contratação (abrir turma no Sistema de Gestão; gerar a proposta de contratação)"]], selecionada: true },
  { id: "dor-32", numero: 12, area: "EF", texto: "Sem nenhum prazo de referência definido para Solicitar, Analisar e Formalizar", processos: ["EF"], etapa: "Solicitar Contratação", contexto: "Confirmado com o dono do processo: Solicitar, Analisar e Formalizar de EF não têm hoje nenhum prazo de referência, nem formal nem combinado informalmente entre as áreas. Em Encaminhar para Pagamento, o próprio subprocesso já pratica 3 prazos de referência combinados informalmente.", onde: [["EF", "Solicitar Contratação; Analisar Solicitação; Formalizar Contratação"]], selecionada: true },
  { id: "dor-29", numero: 13, area: "Transversal (PF+PJ)", texto: "Prazo de contratação: regras empilhadas, solicitações sem tempo hábil e devolução que zera o prazo", processos: ["PJ", "PF"], etapa: "Analisar Solicitação", contexto: "Em PF, a devolução por documentos de kit inicial/planejamento não conformes reinicia os 30 dias corridos do prazo; quando as correções demoram, a CGRO fica sem prazo para concluir o trâmite (mais 30 dias do CGGP acima de R$ 65.400). Em PJ, o grande motivo de devolução é a solicitação chegar sem tempo hábil para o prazo mínimo de 60 dias (90 acima de R$ 65.000). Também registrado: três regras de prazo empilhadas (60/90 + 30 do CGGP + 30 fora de São Paulo), prazo-base de PF menor que o de PJ, e diferença de regra de reinício entre os processos (PJ não reinicia em nenhuma devolução; PF reinicia no kit inicial).", onde: [["PJ", "Analisar Solicitação (CGRO)"], ["PF", "Analisar Solicitação (CGRO)"]], selecionada: true },
  { id: "dor-19", numero: 14, area: "PF", texto: "Solicitar regularização: documentos de habilitação não conformes", processos: ["PF"], etapa: "Analisar Solicitação", contexto: "Devolução por documentos de habilitação não conformes. Diferente da devolução por kit inicial, neste caso o prazo de 30 dias corridos não é reiniciado.", onde: [["PF", "Analisar Solicitação (CGRO)"]], selecionada: true },
  { id: "dor-22", numero: 15, area: "EF", texto: "Dependência de terceiros e sistemas externos: certidões e guia de ISS", processos: ["EF"], etapa: "Analisar Solicitação", contexto: "Na emissão das certidões, às vezes há demora, seja por questões técnicas dos sites ou pelo próprio prazo de emissão. Na guia de ISS, os sistemas das prefeituras sofrem muitas mudanças, o que dificulta a emissão.", onde: [["EF", "Analisar Solicitação (extrair certidões, Responsável Financeiro); Encaminhar para Pagamento (emitir guia de ISS, Fiscal Administrativo)"]], selecionada: true },
  { id: "dor-11", numero: 16, area: "PJ", texto: "Processo segue sem assinaturas por pressão de prazo (vale para todas as assinaturas)", processos: ["PJ"], etapa: "Formalizar Contratação", contexto: "O mesmo registro aparece nas atividades do Gestor do DCG e do Ordenador de Despesa, e o time indicou que vale para todas as assinaturas.", onde: [["PJ", "Formalizar Contratação (assinar ciência da designação, Gestor DCG; assinar despacho de designação, Ordenador de Despesa)"]], selecionada: true },
  { id: "dor-12", numero: 17, area: "PJ", texto: "Acompanhar realização do empenho", processos: ["PJ"], etapa: "Formalizar Contratação", contexto: "Normalmente o prazo é curto e demanda acompanhamento de perto.", onde: [["PJ", "Formalizar Contratação"]], selecionada: true },
  { id: "dor-05", numero: 18, area: "Transversal (PF+EF)", texto: "Atraso no empenho força decisão de adiar ou prosseguir com o curso/palestra", processos: ["PF", "EF"], etapa: "Formalizar Contratação", contexto: "Em PF, o time registra que o empenho raramente falha por completo, mas o prazo fica curto e pode exigir ajuste de data ou decisão sobre prosseguir ou adiar. Em EF, o Gestor CEF decide entre prosseguir ou adiar o curso quando o empenho não é realizado a tempo e informa o Gestor do Contrato para providências; a espera pelo empenho ainda é impactada por outras questões, como o CADIN.", onde: [["PF", "Acompanhar realização do empenho (ponto de atenção)"], ["EF", "Formalizar Contratação"]], selecionada: true },
  { id: "dor-13", numero: 19, area: "PJ", texto: "Vagas solicitadas em número superior aos inscritos (mitigada em parte)", processos: ["PJ"], etapa: "Gerenciar Inscrições", contexto: "Há casos em que a solicitação de vagas pelo demandante fica em número superior ao de inscritos, e isso causa um grande problema, pois o pagamento está atrelado ao número de vagas contratadas e usufruídas. Já foi instituído um termo de responsabilidade para esses casos; tem mitigação, mas ainda acontecem algumas questões.", onde: [["PJ", "Gerenciar Inscrições"]], selecionada: true },
  { id: "dor-14", numero: 20, area: "PJ", texto: "Fechamento das inscrições sob pressão de prazo", processos: ["PJ"], etapa: "Gerenciar Inscrições", contexto: "O tempo para realizar as inscrições é a parte mais crítica do processo: se o empenho demora, sobra pouco tempo para essa etapa, principalmente com muitos participantes. A lista de alunos dá muito trabalho para ser fechada definitivamente e, mesmo assim, há mudanças em cima da hora, o que o time descreveu como atividade extremamente estressante para o Gestor do Contrato/Fiscal Técnico.", onde: [["PJ", "Gerenciar Inscrições (contatar empresa para orientação sobre inscrição; solicitar lista de alunos com dados necessários)"]], selecionada: true },
  { id: "dor-30", numero: 21, area: "PJ", texto: "Prazo de análise do CGGP e demora no envio de documentos regularizados", processos: ["PJ"], etapa: "Instruir Processo", contexto: "Duas questões de prazo se somam: a demora no envio de documentos regularizados e o fato de que as análises do CGGP acontecem a cada 15 dias corridos. O ciclo do CGGP é uma prática externa à escola.", onde: [["PJ", "Instruir Processo (encaminhar documentos solicitados e regularizados; enviar processo para análise do CGGP)"]], selecionada: true },
  { id: "dor-31", numero: 22, area: "Transversal", texto: "Falta de protocolo de contingência técnica + suporte técnico sobrecarregado durante o curso", processos: ["PJ", "PF", "EF"], etapa: "Acompanhar Curso/Evento e Palestra", contexto: "Imprevistos técnicos como falta de luz, queda de internet e problemas de QR code/Teams aparecem nos três processos, e o time aponta a falta de um protocolo de ação para eles. Em PF e PJ, o suporte técnico (DSC) acompanha a aula inteira, mas cobre mais de uma turma ao mesmo tempo quando a equipe está reduzida. A parte da sobrecarga do suporte não foi registrada para EF.", onde: [["PJ", "Acompanhar Curso/Evento"], ["PF", "Acompanhar Curso/Evento"], ["EF", "Acompanhar Palestra"]], selecionada: true },
  { id: "dor-15", numero: 23, area: "PJ", texto: "Vagas ociosas em turmas in company sem ação clara de monitoramento", processos: ["PJ"], etapa: "Acompanhar Curso/Evento e Palestra", contexto: "Cursos com muitas vagas precisam de melhor acompanhamento, pois há ocasiões em que as vagas não são todas preenchidas. O time formulou a questão em aberto sobre o que é feito com essas informações.", onde: [["PJ", "Acompanhar Curso e Evento"]], selecionada: true },
  { id: "dor-16", numero: 24, area: "PJ", texto: "Planejamento por estimativa não foi executado como previsto (contratos in company)", processos: ["PJ"], etapa: "Acompanhar Curso/Evento e Palestra", contexto: "Desvio entre o planejado e o executado nos contratos in company por estimativa em 2026. A causa não está registrada no material.", onde: [["PJ", "Acompanhar Curso e Evento"]], selecionada: true },
  { id: "dor-23", numero: 25, area: "EF", texto: "Cobrança de documentos apesar de comprovações consolidadas", processos: ["EF"], etapa: "Acompanhar Curso/Evento e Palestra", contexto: "Apesar de já ter consolidado as comprovações, muitas vezes é necessária uma cobrança dos documentos.", onde: [["EF", "Acompanhar Palestra"]], selecionada: true },
  { id: "dor-24", numero: 26, area: "EF", texto: "Variação de comportamento entre educadores", processos: ["EF"], etapa: "Acompanhar Curso/Evento e Palestra", contexto: "Cada educador tem uma forma de trabalhar, o que impacta também as avaliações de reação (que acabam não sendo realizadas). Não há fluxo formal de cobrança nem responsável único explicitado para tratar essa variação.", onde: [["EF", "Acompanhar Palestra"]], selecionada: true },
  { id: "dor-25", numero: 27, area: "EF", texto: "Atraso na cadeia documental de Pagamento: lista de presença → termo provisório → ISS", processos: ["EF"], etapa: "Acompanhar Curso/Evento e Palestra", contexto: "O atraso no envio dos documentos e, consequentemente, no termo de recebimento impacta o pagamento, principalmente por causa do ISS e seus prazos (envio até o dia 10 do mês subsequente). O atraso no recebimento da lista de presença e o mesmo atraso no termo provisório impactam muito o pagamento do contrato.", onde: [["EF", "Acompanhar Palestra; Receber a lista de presença (Fiscal Técnico); Elaborar o termo de recebimento provisório"]], selecionada: true },
  { id: "dor-08", numero: 28, area: "Transversal (PJ+PF)", texto: "Participante externo, QR code e lista de presença", processos: ["PJ", "PF"], etapa: "Encaminhar para Pagamento", contexto: "Quando participantes de fora da Sefaz entram no Teams com e-mail não corporativo, o DSC precisa averiguar manualmente quem é a pessoa para incluí-la na lista de presença. Há também resistência e questões técnicas na presença por QR code, online e presencial. Em PF, o time registra que atrasos na lista afetam bastante o fluxo da CGRO, principalmente quando há ISS.", onde: [["PJ", "Encaminhar para Pagamento"], ["PF", "Encaminhar para Pagamento"]], selecionada: true },
  { id: "dor-17", numero: 29, area: "PF", texto: "Elaborar o termo de recebimento provisório: prazo de 2 dias úteis", processos: ["PF"], etapa: "Encaminhar para Pagamento", contexto: "Cumprimento do prazo de 2 dias úteis para emissão do termo de recebimento provisório, citado pelo próprio time como dor. Em PJ, o mesmo prazo aparece apenas como ponto de atenção.", onde: [["PF", "Encaminhar para Pagamento"]], selecionada: true },
  { id: "dor-18", numero: 30, area: "PF", texto: "Cálculo de IR/INSS no RPA: planilha paralela e retrabalho", processos: ["PF"], etapa: "Encaminhar para Pagamento", contexto: "A mudança na legislação do IR (faixa de isenção) dificulta o cálculo do valor do imposto, e a equipe depende de uma planilha Excel e de um simulador próprios, fora do sistema oficial. O cálculo da retenção do INSS gera retrabalho quando a declaração do contratado vem incorreta, principalmente com prazo exíguo para correção.", onde: [["PF", "Encaminhar para Pagamento (produzir o Recibo de Pagamento a Autônomo, RPA)"]], selecionada: true },
  { id: "dor-06", numero: 31, area: "Transversal (PF+EF)", texto: "Demora ou não devolução do RPA assinado pelo contratado", processos: ["PF", "EF"], etapa: "Encaminhar para Pagamento", contexto: "Em PF, quando o contratado não devolve o RPA assinado, o próprio gestor do contrato assina para viabilizar o pagamento e a CGRO regulariza depois; é uma prática de contorno, documentada e não formalizada. Em EF, o time registra demora na devolução.", onde: [["PF", "Devolver RPA assinado"], ["EF", "Devolver RPA assinado (Educador)"]], selecionada: true },
  { id: "dor-07", numero: 32, area: "Transversal (PF+EF)", texto: "Risco de CADIN do contratado pessoa física, impactando o pagamento", processos: ["PF", "EF"], etapa: "Encaminhar para Pagamento", contexto: "O contratado pode entrar em CADIN de um dia para o outro, entre a checagem em Analisar e a checagem no Pagamento. Em EF, a checagem já é antecipada para Analisar. Os times de PF e EF já discutiram o tema e não identificaram mitigação adicional viável hoje.", onde: [["PF", "Encaminhar para Pagamento"], ["EF", "Analisar Solicitação; Encaminhar para Pagamento"]], selecionada: true },
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
        etapa: String(d.etapa || "").slice(0, 120),
        contexto: String(d.contexto || "").slice(0, 2000),
        onde: Array.isArray(d.onde)
          ? d.onde
              .filter((o) => Array.isArray(o) && PROCESSOS_VALIDOS.includes(o[0]))
              .slice(0, 6)
              .map((o) => [o[0], String(o[1] || "").slice(0, 300)])
          : [],
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
  // migração 3: dores salvas antes de existir "etapa/contexto/onde" ganham o texto
  // oficial da Oficina de priorização (sem mexer em título, ativa ou nada editado).
  const semDetalhe = catalogo.dores.filter((d) => d.etapa === undefined && d.contexto === undefined && SEED_POR_ID[d.id]);
  if (semDetalhe.length) {
    const seedPorId = Object.fromEntries(SEED.map((o) => [o.id, o]));
    catalogo.dores = catalogo.dores.map((d) =>
      semDetalhe.includes(d) ? { ...d, etapa: seedPorId[d.id].etapa, contexto: seedPorId[d.id].contexto, onde: seedPorId[d.id].onde } : d
    );
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
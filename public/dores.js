// ============================================================================
// CONFIGURAÇÃO GERAL
// ============================================================================
// A LISTA DE DORES NÃO FICA MAIS AQUI — agora ela mora no "banco de dores"
// (armazenado pelo Netlify) e é editada direto no painel de admin, na seção
// "Gerenciar dores": lá dá para marcar/desmarcar quais participam da rodada
// (com "selecionar todas"), editar o texto de uma dor, ou adicionar novas.
// Este arquivo só guarda o que raramente muda: os critérios, o PIN e o
// tempo padrão por dor.

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

// ----------------------------------------------------------------------------
// MODO TRIAGEM: uma rodada rápida (voto sim/não) usada para ELIMINAR dores
// antes da votação completa de 3 critérios — mitigação para quando o banco
// de dores tem muitos itens (ex.: 32) e a rodada completa ficaria longa
// demais / cansativa. Cada dor aparece por poucos segundos e a pessoa só
// responde "mantém ou descarta". O resultado (% de "sim") fica visível no
// painel de admin para o facilitador decidir quais ficam "selecionada" para
// a rodada completa — o voto de triagem não decide isso sozinho.
const CRITERIO_TRIAGEM = {
  id: "triagem",
  titulo: "Vale priorizar?",
  pergunta: "Essa dor merece entrar na rodada completa de priorização (3 critérios)?",
  escala: ["Não, deixar de fora", "Sim, manter"], // valor 1 = não, valor 2 = sim
};

const DURACAO_TRIAGEM_PADRAO_SEG = 20;

// PIN simples para abrir o painel de admin (não é segurança de verdade,
// só evita que alguém abra o link por engano). Troque antes de publicar.
const ADMIN_PIN = "cgpi2026";

// Logo da CGPI, já embutido como imagem (não precisa de arquivo separado).
const LOGO_CGPI = "data:image/png;base64,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";

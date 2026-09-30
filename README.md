# Votação de Priorização — CGPI

App de votação guiada para a oficina: você controla, dor por dor, qual
aparece na tela de todo mundo e por quanto tempo. Cada participante entra
pelo celular, e a tela muda sozinha quando você avança — ninguém fica preso
numa dor nem sobra tempo perdido. Você acompanha tudo (quem já votou, moda
por critério, score e um preview do mapa de calor) num painel à parte.

Não precisa de conta em Firebase, Supabase ou qualquer serviço externo —
usa o banco de dados embutido do próprio Netlify (Netlify Blobs), dentro da
conta que você já usa.

## O que já vem pronto

- **As 25 dores do "Quadro de Dores"** (arquivo `Fazesp_OKR_Gestao_de_Processos_10.html`
  que você enviou) já estão carregadas em `public/dores.js`, com a área
  (PJ/PF/EF/Transversal) e o sinalizador de transversalidade (bônus ×1,3).
- **A identidade visual do documento do cliente**: mesmas fontes (Fraunces,
  Public Sans, IBM Plex Mono) e mesma paleta de cores (inclusive modo claro/escuro
  automático, conforme o sistema do celular de cada participante).
- **Os 3 critérios em linguagem simples** (sem jargão de BPM), já na ordem e
  nos pesos certos para bater com a Ferramenta de Priorização do app.

## ⚠️ Uma coisa que preciso que você confirme antes de publicar

Ao ler o HTML, não encontrei nenhum card no "Quadro de Dores" com o texto
exato "Elaboração de termos de recebimento" (PJ, automação por integração
de sistema, já em execução) — a dor que você marcou como resolvida e pediu
para excluir. O card mais parecido é o **dor-17** ("Elaborar o termo de
recebimento provisório: prazo de 2 dias úteis"), mas ele está classificado
como PF, não PJ, e fala do prazo de elaboração, não da automação em
andamento — pode ser uma dor diferente, ou o mesmo tema com outra redação.

Abra `public/dores.js`, procure `dor-17` e decida:
- Se for a mesma dor (ou não fizer mais sentido votar nela), troque
  `jaResolvida: false` para `jaResolvida: true` — ela some da votação
  automaticamente, sem precisar apagar o card.
- Se for uma dor diferente, deixe como está.

## O que mais você pode editar em `public/dores.js`

- **Lista `DORES_TODAS`**: adicione, remova, reescreva ou reordene as dores
  à vontade. `transversal: true` aplica o bônus ×1,3 no score.
- **`ADMIN_PIN`**: troque `"cgpi2026"` pelo seu PIN antes de publicar.
- **`DURACAO_PADRAO_SEG`**: tempo padrão (em segundos) por dor no modo
  guiado — hoje 120s (2 min). Dá para mudar isso também na hora, no painel.
- **Texto dos critérios** (`CRITERIOS`): pode ajustar a redação, mas mantenha
  a ordem C1/C2/C3 e os pesos ×3/×2/×1, senão o score não bate com o da
  Ferramenta de Priorização do app.

## Como funciona o modo guiado (passo a passo do dia da oficina)

1. Você (facilitador) abre `<seu-link>/admin`, digita o PIN.
2. Cada participante abre `<seu-link>` no celular, digita o nome, e cai numa
   tela de "aguardando o facilitador iniciar".
3. No painel, você define a duração por dor (padrão 2 min) e clica em
   **"▶ Iniciar (dor 1)"**. Na hora, a primeira dor aparece simultaneamente
   na tela de todos os participantes, com um cronômetro regressivo.
4. Cada participante vota nos 3 critérios daquela dor. Cada clique já salva
   sozinho — não tem botão de "enviar" para esquecer de apertar.
5. Quando o tempo acabar (ou antes, se o grupo terminar rápido), você clica
   em **"⏭ Próxima dor"** — a tela de todo mundo muda automaticamente para a
   dor seguinte, com o cronômetro reiniciado.
6. Se perceber que 2 minutos foi curto para uma dor específica, clique em
   **"+30s"** antes de avançar — soma tempo à etapa atual sem reiniciar do zero.
7. Repita até a última dor. Depois da última, clique em **"■ Encerrar
   votação"** — a tela dos participantes muda para "obrigado, pode voltar
   para o grupo".
8. O painel de resultados (na mesma tela do admin, mais abaixo) já mostra a
   moda por critério, o score calculado e um preview do mapa de calor,
   atualizando sozinho durante toda a votação — pode deixar isso projetado
   junto com a dor atual, ou trocar de aba na hora da discussão.

Se alguém errar o clique numa dor que já passou, sem problema: dá para
voltar manualmente clicando em "▶ Iniciar" de novo (ela reinicia a
contagem na etapa 0) — mas isso reabre a dor 1 para todo mundo, então use
com cuidado durante a sessão ao vivo. Se for só ajustar UM voto específico
de UMA pessoa, mais simples é pedir para ela revotar naquele critério
quando a dor voltar a ficar disponível, ou você mesmo ajustar olhando a
distribuição completa no painel.

## Exportar para documentar (PDF e imagem)

No painel de resultados tem dois botões:

- **"📄 Baixar relatório em PDF"** — abre a caixa de impressão do navegador
  já formatada só com a tabela de resultados e o mapa de calor (esconde os
  controles do modo guiado). Escolha "Salvar como PDF" no destino da
  impressão. Fica com cabeçalho, data de geração e número de participantes.
- **"🖼️ Baixar mapa de calor (PNG)"** — baixa só o mapa de calor como imagem
  (em 2x de resolução, para ficar nítido ao colar no Miro, num documento
  Word ou numa lâmina para o cliente).

Os dois usam os dados que estiverem na tela no momento — gere o PDF/imagem
depois que a votação da oficina terminar (ou a qualquer momento, se quiser
um retrato parcial durante a sessão).

## Sobre o mapa de calor dentro do app

O painel já desenha um mapa de calor (score total no eixo vertical,
potencial de automação — C3 — no eixo horizontal), nos mesmos eixos da
Ferramenta de Priorização do app, útil para apoiar a discussão ao vivo logo
depois da votação. Os cortes dos quadrantes usados aqui são um valor de
referência (meio da escala) — eu não tinha confirmado se são exatamente os
mesmos limiares numéricos que a ferramenta oficial usa internamente para
separar "prioridade máxima" de "mapear primeiro", por exemplo. Por isso,
para o registro oficial e para manter o mesmo padrão de comparação entre
processos ao longo do tempo, alimente também a Ferramenta de Priorização do
app com as mesmas modas que saem daqui — o mapa deste painel é um apoio
para a conversa no momento, não substitui o registro na ferramenta oficial.

## Como publicar no Netlify

Isso precisa ser feito via terminal (não dá para arrastar a pasta na
interface do Netlify, porque as funções dependem de um pacote —
`@netlify/blobs` — que precisa estar instalado antes do deploy).

1. Abra um terminal dentro desta pasta (`votacao-priorizacao-cgpi/`).
2. Instale a dependência:
   ```
   npm install
   ```
3. Se ainda não tem a CLI do Netlify instalada:
   ```
   npm install -g netlify-cli
   netlify login
   ```
4. Publique como um site novo:
   ```
   netlify deploy --prod
   ```
   Escolha "Create & configure a new site" e um nome (ex:
   `votacao-cgpi-set2026`).
5. O terminal mostra o link (ex: `https://votacao-cgpi-set2026.netlify.app`)
   — é esse link que vai para os participantes. O painel fica em
   `<esse link>/admin`.

## Antes do dia da oficina: teste (importante, dado o prazo curto)

1. Abra o link de votação você mesmo (ou peça para 1-2 colegas testarem),
   simulando o modo guiado: clique em "Iniciar" no admin, vote como
   participante, clique em "Próxima dor" e confira se a tela do participante
   muda sozinha.
2. Confira o painel de resultados e o mapa de calor com esses votos de teste.
3. Clique em **"🗑 Zerar TODOS os votos"** no painel antes do dia real —
   isso também reseta o modo guiado para "não iniciado".

## Se algo falhar no dia

Tenha como plano B um Google Forms com as mesmas perguntas (posso montar
esse Forms também, se quiser uma rede de segurança pronta, já que o prazo
está curto para testar este app com bastante folga).

## Limitações conhecidas, por transparência

- O PIN do admin é uma trava simples, não é autenticação de verdade.
- Identificação por nome digitado, sem verificação — suficiente para uma
  sessão única e supervisionada de 10 pessoas, mas não impede alguém de
  votar duas vezes se usar outro dispositivo.
- Em caso de empate na moda de um critério, o painel mostra o menor valor
  entre os empatados e sinaliza com "*"; a distribuição completa fica visível
  para o grupo decidir como tratar o empate na discussão.
- Os cortes do mapa de calor deste painel são uma referência aproximada, não
  confirmada como idêntica aos limiares internos da Ferramenta de
  Priorização oficial do app (ver seção acima).

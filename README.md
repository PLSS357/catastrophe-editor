# Catastrophe — Ateliê de fichas

Editor visual de fichas de Catastrophe inspirado na composição do playtest de Ordem Paranormal II. Mantém os seis personagens, os repertórios e as regras da adaptação v0.2. A aplicação serve exclusivamente à criação e exportação de fichas; a prévia é somente leitura.

Site: https://plss357.github.io/catastrophe-editor/

## Usar

Comece com um dos seis agentes ou use **Começar ficha nova**. Edite os dados em Personagem. Use **Elementos** para inserir componentes nativos, textos, retratos, linhas e formas próprias de fichas. Os painéis podem ser recolhidos na barra inferior.

- **Transformações:** oito alças e alça superior de rotação; Shift mantém proporção ou usa passos de 15°; Alt redimensiona pelo centro e ignora o encaixe ao mover. Campos numéricos complementam as alças. Setas movem 1 px; Shift+setas, 10 px. Áreas fora da página são avisadas e não são exportadas.
- **Guias:** arraste das réguas ou crie pelo painel Guias. Arraste para mover; dois cliques excluem. Há bloqueio, visibilidade, limpeza e configurações de sensibilidade, grade, página e elementos. Guias não são exportadas.
- **Camadas e grupos:** reordene por arraste; renomeie o nome visual por dois cliques. Busque, bloqueie, oculte ou recolha grupos. Ctrl+G agrupa; Ctrl+Shift+G separa um nível. Desagrupar os blocos originais separa título/conteúdo e depois suas linhas. **Separar partes internas** de atributos, perícias, habilidades e rituais cria componentes vinculados aos dados. Isolar é temporário e não modifica a visibilidade salva.
- **Alinhamento:** escolha um elemento ou grupo de referência para alinhar por seis bordas/centros, distribuir espaçamento ou igualar dimensões. A referência permanece parada.
- **Textos:** dois cliques no texto abrem edição direta; Escape cancela, sair confirma. As propriedades incluem famílias de fonte, tamanho, peso, itálico, sublinhado, cor, espaços, margens, alinhamento, contorno e sombra. Títulos têm fonte, tamanho, peso e cor independentes. Formatar trecho aplica estilos estruturados por intervalos; o projeto não armazena HTML arbitrário. Fontes locais WOFF/WOFF2/TTF/OTF são incorporadas; use apenas fontes cuja licença permita esse uso.
- **Imagens:** PNG, JPEG e WebP preservam seu arquivo original. O limite padrão é 24 MB por imagem, configurável em Guias; máximo de 40 megapixels. Zoom e deslocamento são internos à moldura. Recorte numérico não destrutivo, máscaras seguras, esmaecimento, brilho, contraste, saturação, temperatura e tons de cinza permanecem editáveis.
- **Componentes e modelos:** salve uma seleção como componente ou a ficha como modelo. A biblioteca é local, com renomear, duplicar e excluir. Aplicar modelos preserva dados e retrato do personagem de destino; habilidades e rituais são vinculados por identidade semântica; casos sem equivalência única pedem correspondência explícita. Há sete composições iniciais; confira os avisos de texto e ajuste os blocos ao repertório do personagem.
- **Temas:** Clássico, Minimalista e Monocromático, além de estilos salvos. O tema não apaga substituições individuais. Copiar/colar estilo não copia dados de personagem.

## Salvar e recuperar

IndexedDB guarda fichas, versões e biblioteca. Indicadores mostram Salvando, Salvo ou Erro ao salvar. Há cópia de emergência local e versões automáticas, além de versões nomeadas em **Versões**. Restaurar cria uma cópia do estado anterior e pode ser desfeito. A comparação mostra atual e versão lado a lado. Fichas antigas são migradas para `schemaVersion: 2`; o identificador legado `version: 1` continua compatível.

O salvamento é por navegador e origem. O site GitHub e o site anterior não compartilham armazenamento. **Backup JSON** permanece acessível no cabeçalho e inclui os dados, composição, imagens, fontes e formatação da ficha aberta. A biblioteca continua local, mas **Exportar biblioteca / Importar biblioteca** transporta todos os componentes, modelos, estilos, fontes e imagens em um JSON próprio, acrescentando os itens sem substituir os atuais. Limites de armazenamento variam por navegador; em caso de erro, exporte JSON imediatamente. O histórico da sessão tem até 60 entradas e orçamento aproximado de 24 MB.

## Exportar

**Exportar…** permite PNG padrão, alta resolução ou largura personalizada de 320 a 8000 px, sempre proporcional às dimensões atuais da página. PNG e SVG permitem fundo transparente. O SVG incorpora imagens/fontes e preserva transformações, máscaras e opacidade. O PDF direto oferece A4, A3, Letter ou proporção da ficha, orientação e margens: oferece modo vetorial com textos e formas selecionáveis e modo por imagem para preservar a renderização do navegador. JSON é o projeto editável. A conferência opcional aponta elementos externos, imagens ausentes, transbordamento, fontes e referências inválidas, sem bloquear a exportação.

## Atalhos

Ctrl/Command+Z desfaz; Ctrl+Shift+Z ou Ctrl+Y refaz. Ctrl+C/X/V copia, recorta e cola dentro do editor. Ctrl+D duplica; Ctrl+A seleciona elementos visíveis e desbloqueados. Ctrl+G agrupa e Ctrl+Shift+G desagrupa. Delete exclui. Ctrl+S força salvamento; Ctrl+0 ajusta à tela; Ctrl+1 usa 100%. Espaço+arraste navega e Ctrl+roda aplica zoom ao cursor. Atalhos de edição não interceptam campos de texto.

## Desenvolvimento e testes

Sem dependências de execução ou etapa de build. Sirva `dist/` por HTTP; módulos não devem ser abertos por `file://`.

```sh
npm run check
python -m http.server 8771 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8771/tests/ui.html` para executar os fluxos automatizados de interface, em uma origem reservada para testes. O teste cria uma ficha própria e não exclui dados. A suíte Node cobre histórico, armazenamento, migração, seleção, agrupamento, transformações, alinhamento, componentes, modelos, estilos, segurança e geração de arquivos. O workflow GitHub Pages executa os testes antes de publicar `dist/`.

## Arquitetura

`app.js` coordena os painéis de dados e a inicialização. `editor.js` integra ferramentas contextuais; `selection.js`, `transform.js`, `layers.js`, `text-editor.js`, `image-editor.js`, `components.js`, `styles.js`, `history.js`, `storage.js`, `migrations.js`, `export.js` e `shortcuts.js` separam suas responsabilidades. `model.mjs`, `grouping.mjs` e `sheet.mjs` preservam o modelo, agrupamento progressivo e renderização SVG já existentes.

Não é uma ferramenta oficial de Ordem Paranormal. As regras e rituais são as adaptações de Catastrophe desta conversa.

## Biblioteca completa de rituais — 0.3.1

Em **Personagem → Rituais → Adicionar ritual**, consulte as **109 entradas e 274 formas** identificadas nos dez PDFs fornecidos. São 82 descrições do livro básico, 16 de Sobrevivendo ao Horror, seis descrições adicionais de suplementos e cinco entradas disponíveis apenas em fichas de ameaças. Referências repetidas ficam reunidas; variantes de nome e divergências de círculo são identificadas. A biblioteca oferece busca sem acentos e filtros de elemento, círculo, fonte e forma, com página do PDF e cobertura das fontes. Não inclui enredo, fichas de NPCs ou rituais narrativos sem entrada mecânica.

As formas Básica, Discente e Verdadeiro aparecem apenas quando documentadas. **Amaldiçoar Arma** permite selecionar os quatro elementos originais. Custos e requisitos de Ordem são referências, não alterações nas regras de Catastrophe. As onze conversões já existentes mantêm os textos e custos anteriores. Os demais rituais podem ser adicionados como **resumo de referência em PE**. A opção **proposta de custo em PD** fornece apenas um ponto de partida: não converte nem balanceia automaticamente os efeitos. Todos os textos permanecem editáveis; nada é acrescentado automaticamente aos personagens.

O arquivo `dist/rituals.json` contém somente metadados, resumos e referências. PDFs originais, texto integral dos livros e dados de marca d'água não são distribuídos. A página indica quando uma fonte não fornece uma descrição própria de ritual. **Capturar Momento**, **Descansar** e **Esconder os Olhos** conservam avisos sobre inconsistências encontradas nos documentos.

## Correções de reutilização e exportação — 0.3.2

- **Correspondências:** componentes salvos armazenam descritores de habilidade/ritual, forma e elemento. Nunca associam repertórios pelo índice da lista. Identidades ambíguas, conteúdos conflitantes e modelos antigos que só possuem índices abrem uma escolha de equivalência. Se deixados sem correspondência, os componentes permanecem visivelmente marcados, inclusive na exportação, e são listados na conferência.
- **Composição:** fontes não são reduzidas para caber. O editor mede textos e oferece expansão de blocos/página ou redistribuição em colunas. Rituais são distribuídos em cartões vinculados. Modelos personalizados têm opção de expandir conteúdo ou manter posições com avisos. A página pode atingir 20000 px de altura; blocos acima de 4000 px precisam ser divididos, e documentos além desse limite devem ser separados. Alterações de altura são salvas, exportadas e reversíveis pelo histórico.
- **PDF vetorial:** textos e formas comuns permanecem vetoriais e selecionáveis. Retratos, textura e blocos com fontes/efeitos não suportados são preservados como imagens. Fontes padrão usam correspondentes Times/Helvetica/Courier, portanto podem ter pequenas diferenças métricas; fontes TTF compatíveis podem ser incorporadas. O modo PDF por imagem continua disponível para fidelidade à renderização do navegador. PDF não equivale a um arquivo de projeto com todas as propriedades editáveis; para continuar a composição, use JSON ou SVG.
- **Preferências:** resolução, largura personalizada, transparência, papel, orientação, margens e modo PDF são guardados localmente ao alterar os controles, mesmo sem exportar, e restaurados ao reabrir ou recarregar.
- **Biblioteca portátil:** o JSON `catastrophe-library`, versão 1, inclui componentes, modelos e estilos, com fontes e imagens incorporadas. A importação é validada e adicionada em uma transação; não substitui itens existentes. Limites: 100 itens e 80 MB. Isso permite transporte manual entre dispositivos; não oferece sincronização automática.

O PDF vetorial usa jsPDF 4.2.1 e svg2pdf.js 2.9.0 em um bundle local de aproximadamente 500 KB, carregado apenas ao usar esse formato. Licenças estão em `dist/vendor`. `npm install && npm run vendor:pdf` reconstrói o bundle com esbuild; a correção linear da expressão de Data URI evita estouro de pilha com imagens grandes. Nenhuma imagem ou ficha é enviada a um serviço externo para exportar.

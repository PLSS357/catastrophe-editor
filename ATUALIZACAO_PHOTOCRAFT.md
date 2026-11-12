# Catastrophe Editor — Interface PhotoCraft (atualização aplicada)

Esta atualização reestrutura a área de trabalho sem substituir o modelo de fichas, o salvamento, as ferramentas de seleção ou a exportação já existentes.

## Implementado
- Menu superior: Arquivo, Editar, Inserir, Camadas, Exibir, Janela e Ajuda.
- Barra de ferramentas compacta para seleção, zoom, inserir blocos, inserir dados vinculados e guias.
- Navegação de personagem, fichas, layout e elementos na lateral esquerda.
- Barra de contexto com posição X/Y e dimensões L/A editáveis, que respeitam bloqueio de elementos e histórico.
- Painel de camadas acoplado na lateral direita, separado das propriedades, com miniaturas, ordenação, visibilidade, bloqueio, grupos e pesquisa (recursos existentes reaproveitados).
- Lateral direita redimensionável e possibilidade de recolher os painéis esquerdo/direito e as camadas.
- Preferências de interface guardadas localmente, sem modificar os dados da ficha.
- Tema de interface cinza-escuro com acentos quentes; organização próxima de um editor gráfico.
- Réguas alternáveis, ajuste de página, largura, seleção e modo de foco via menu.

## O que continua inalterado
- Fichas, atributos, habilidades, rituais e vínculos com personagens.
- Formato dos documentos, importação/exportação, histórico e modelos.
- Ferramentas de edição e seleção existentes.

## Limites
- As ferramentas de texto, imagem e forma abrem a caixa de inserção existente: ainda não são ferramentas de desenho com clique direto na página.
- Não foram implementados pincéis raster, importação PSD ou painéis flutuantes livremente acopláveis.
- As alterações foram verificadas com análise sintática e 79 testes automatizados; não há validação manual completa da interface em navegador neste pacote.

## Como abrir
Sirva a pasta `dist` com um servidor HTTP local (por exemplo, `python -m http.server 8000 --directory dist`) e abra `http://localhost:8000`. O projeto usa ES Modules e leitura de JSON, por isso abrir `index.html` por `file://` pode não funcionar.

# Alterações — 0.3.1

- Biblioteca de 109 entradas e 274 formas de rituais, extraídas das entradas mecânicas dos dez PDFs fornecidos, com resumos e referências de página.
- Busca por nome ou efeito e filtros por elemento, círculo, fonte e forma; seleção de elemento em rituais multielemento.
- Preservadas as onze conversões já usadas nos modelos. Novas entradas distinguem referência em PE de proposta de custo em PD, sem alegar conversão balanceada.
- Dados de origem e forma acompanham a ficha no JSON, com desfazer/refazer da inclusão e edição normal.
- Sem publicação de PDFs, enredo ou marcas d'água. Fontes incompletas e divergentes ficam identificadas.
- Nove testes adicionais de catálogo e dois fluxos de interface para busca, seleção de forma, inclusão e preservação dos custos existentes.

# Alterações — 0.3.0

## Etapa 1 — Fundação técnica

- Extraídos histórico, persistência, seleção e migrações; histórico lógico por campo/operação e restauração da seleção.
- IndexedDB atualizado sem remover fichas antigas; recuperação válida, cópias periódicas e mensagens de erro.
- Regressões iniciais: 19 testes aprovados; cobertura ampliada no arquivo editor.test.mjs.

## Etapa 2 — Ferramentas profissionais

- Oito alças, rotação individual e de grupos, transformações numéricas, movimento fora da página, guias e réguas, encaixe configurável, navegação e camadas com arraste.
- Alinhamento por referência preservado; igualdade de dimensões, grupos aninhados, bloqueio e isolamento.
- Verificados redimensionamento como operação única e restauração da seleção pelo histórico.

## Etapa 3 — Edição de conteúdo

- Edição direta, tipografia, intervalos de formatação estruturada, fontes locais e avisos de transbordamento.
- Enquadramento interno, recorte não destrutivo, máscaras SVG predeterminadas seguras e ajustes reversíveis de imagens.
- Conferidos texto acentuado, persistência, máscara elíptica e zoom interno no navegador.

## Etapa 4 — Componentes

- Biblioteca nativa com inserção por clique/arraste, componentes locais e vínculos com os dados de destino.
- Partes internas de atributos, perícias, habilidades e rituais; recursos com representações apenas visuais.
- Testes verificam que a inserção não altera dados do personagem.

## Etapa 5 — Estilos e modelos

- Temas, substituições individuais, copiar/colar aparência e biblioteca de estilos.
- Modelos personalizados, remoção opcional de textos pessoais e sete composições iniciais.
- Testes de preservação dos dados dos seis agentes ao aplicar composições e modelos.

## Etapa 6 — Finalização

- Visualizar passou a prévia somente leitura; retirados controles de recursos durante sessões.
- PNG configurável, SVG independente, JSON versionado e PDF direto, com conferência opcional.
- Histórico nomeado, restauração reversível, duplicação e comparação visual.
- Movimento/rotação atualizam os grupos SVG incrementalmente; validações e limites protegem o armazenamento e as importações.
- 39 testes Node e 10 fluxos de interface aprovados. PDF gerado pelo navegador analisado com pypdf e renderizado com Poppler para verificação visual.

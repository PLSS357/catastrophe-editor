# Alterações — 0.3.2

## 0.4.0 — Ateliê, páginas e exportação de grupo

- Ações de arquivo reunidas no cabeçalho, ferramentas de composição próximas à ficha, modo de foco e enquadramentos de página/largura/seleção.
- Propriedades em Conteúdo, Posição, Aparência e Avançado; formulário recolhível, filtros de perícias, contraste maior, rótulos em português e salvamento com horário.
- Camadas com clique simples exclusivo e Shift aditivo, miniaturas, hierarquia e renomeação por duplo clique.
- Menu contextual por tipo, edição visual de imagem, máscaras, espelhamento, estilos, alinhamento e operações de seleção múltipla.
- Até 20 páginas compartilhando os dados do personagem e o tema; troca, reordenação, renomeação e transferência de blocos, com histórico e backup completo.
- Texto pode expandir, reduzir com fonte mínima ou continuar em novas páginas; fluxo opcional desloca conteúdo abaixo. Avisos de transbordamento ficam visíveis.
- Biblioteca de habilidades, rituais, armas e equipamentos reutilizáveis, integrada ao backup da biblioteca.
- Dados vinculados podem ser inseridos em qualquer página. Modelos distinguem layout de conteúdo e têm prévia; aparência pode ser copiada entre fichas.
- Temas e versões com miniaturas; conferência organizada em conteúdo, regras e diagramação.
- Exportação de todas as páginas e de grupos: PDF conjunto ou ZIP com imagens/SVG individuais. Predefinições de compartilhamento, A4 e JSON, além de impressão econômica com prévia.
- Validação: 67 testes de domínio/armazenamento/exportação, 26 fluxos de interface e PDF de duas páginas com texto extraível.


- Substituídos vínculos por posição por descritores semânticos, incluindo catálogo, forma e elemento; correspondência explícita para ambiguidades e modelos legados.
- Templates avisam sobre partes sem equivalência e preservam os dados do destino.
- Composições medem o conteúdo e oferecem expansão/redistribuição sem redução de fontes; altura de página acompanha prévia, histórico e exportações.
- Exportação vetorial PDF com textos e formas selecionáveis, imagens rasterizadas individualmente e modo por imagem preservado.
- Preferências completas da exportação persistem ao fechar/reabrir e recarregar.
- Importação/exportação da biblioteca completa, com imagens/fontes, validação e acréscimo atômico sem substituição.
- Nove testes adicionais e dois fluxos de interface específicos, além da verificação do PDF com extração de texto acentuado e renderização visual.

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

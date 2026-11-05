# Catastrophe — Ateliê de fichas

Editor estático de fichas de RPG, inspirado no layout do playtest de Ordem Paranormal II e preenchido com a adaptação caseira de Catastrophe v0.2.

## Funcionalidades

- Seis modelos iniciais e criação de agentes em branco.
- Atributos, perícias e suas especialidades, PV/PD, habilidades, rituais e inventário.
- Blocos arrastáveis e redimensionáveis, camadas, alinhamento, cores, texto, imagens e marcadores.
- Seleção múltipla por Shift/Ctrl/clique, botões de seleção nas camadas ou área de seleção no fundo.
- Alinhamento por seis bordas/centros com um bloco de referência fixo, movimentação e redimensionamento em conjunto e distribuição de espaços para três ou mais blocos.
- Modelos de composição; blocos livres são preservados ao trocar o modelo.
- Ordem e visibilidade de linhas de perícia personalizáveis.
- Desfazer/refazer, travas de posição, modo de visualização e acompanhamento de recursos.
- Salvamento local em IndexedDB, com fallback para localStorage.
- Exportação de PNG 3840 × 2862, SVG, JSON portátil com imagens e impressão.

## Desenvolvimento

Sem dependências ou build. Sirva a pasta `dist/` com um servidor HTTP estático. Não abra diretamente por `file://`, pois os módulos e os modelos são carregados por HTTP.

Execute `npm run check` para conferir a sintaxe e os testes do modelo. `tests/model.test.mjs` usa o test runner nativo do Node.

## Dados e privacidade

As fichas alteradas ficam no navegador usado, sem sincronização entre dispositivos. O arquivo JSON exportado serve como backup e transporte. O site é publicado com acesso privado do proprietário. Os retratos fornecidos pelo usuário são incluídos como modelos iniciais.

## Referências

O tema visual reproduz a composição geral, cores por perfil, molduras e dados geométricos dos exemplos fornecidos. As regras são as adaptações caseiras desta conversa e não uma ferramenta oficial de Ordem Paranormal. Os textos de rituais contêm as versões reduzidas, não os valores originais do livro.

# Aniimo · Guia de Campo

Guia pessoal de Aniimo publicado no GitHub Pages: eventos da semana com times por boss, meta de endgame, Aniidex completo e sistemas do jogo.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início: Holo-Battle da semana, Prismana da semana, eventos ativos e próximos |
| `eventos.html` | Holo-Battle Interlink (todos os Alphas da rotação), Egg Heist, Holo-Battle Sim, calendário, fontes |
| `meta.html` | Princípios, formato Twine, supports universais, times por elemento, tier list, build por papel |
| `aniidex.html` | Todos os Aniimo com filtros e ficha detalhada |
| `sistemas.html` | Tabela de tipos, papéis, BREAK, Potential, personalidade, Prismana, evoluções |
| `data/*.json` | **Toda a informação do site.** As páginas só leem estes arquivos |

## Como atualizar

Quase toda atualização é só editar JSON em `data/`:

- **Nova semana do Holo-Battle:** em `data/eventos.json` → `holo.alphas`, marque `"ativo": true` nos Alphas da rotação atual. As fraquezas são calculadas automaticamente pela tabela de tipos; `cores` aponta para os times em `data/meta.json`.
- **Evento novo:** adicione um item em `data/eventos.json` → `calendario` (datas em `AAAA-MM-DD`). O início mostra sozinho o que está ativo e o que começa nos próximos 14 dias.
- **Modo novo:** crie um bloco novo em `data/eventos.json` e uma seção em `eventos.html`.
- **Aniimo novo ou balanceamento:** `data/aniimo.json`. `stats` segue a ordem HP, ATK, P.DEF, REGEN, M.DEF, BREAK (`null` = não publicado).
- **Times:** `data/meta.json` → `cores`.
- Sempre atualize o campo `atualizado` e registre a mudança em `data/eventos.json` → `changelog`.
- Ao mudar JSON, troque o `V` em `assets/app.js` (e o `?v=` dos HTML) para furar o cache.

## Regra de elementos

A fonte do Holo-Battle lista cada Alpha como "counters X". X são os elementos **super efetivos contra** o Alpha (confirmado pela tabela de tipos em 9 de 9 casos): leve X.

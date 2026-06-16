# A Gazeta Radioativa

Blog nerd estático preparado para GitHub Pages.

## Estrutura

```text
index.html
style.css
posts/
assets/img/
data/posts.json
scripts/new-post.js
README.md
```

## Criar novos posts

Use o gerador para criar o HTML do post e atualizar o indice da capa:

```bash
npm run new-post -- "Titulo do novo post"
```

Opcoes uteis:

```bash
npm run new-post -- "Titulo do novo post" --section="Arquivo Mutante" --excerpt="Resumo curto" --date=2026-06-16
```

O comando cria um arquivo em `posts/` e adiciona a entrada correspondente em
`data/posts.json`. A capa (`index.html`) le esse JSON para montar a lista de
posts automaticamente.

Para testar localmente, rode um servidor estatico na raiz do projeto. Abrir o
`index.html` direto pelo navegador pode bloquear a leitura do JSON.

## Conceito

A Gazeta Radioativa é um blog em formato de jornal fictício do multiverso nerd,
com estética de jornal antigo, quadrinhos e elementos radioativos.

Editorias iniciais:

- Manchete Radioativa
- Arquivo Mutante
- Classificados do Multiverso
- Coluna do Sobrevivente
- Dossiê Secreto
- Radar Geek
- Laboratório Nerd

## Publicação no GitHub Pages

1. Envie estes arquivos para um repositório no GitHub.
2. Acesse `Settings > Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Selecione a branch principal e a pasta `/root`.
5. Salve e aguarde o link publicado.

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const postsFile = path.join(rootDir, "data", "posts.json");
const postsDir = path.join(rootDir, "posts");

const args = process.argv.slice(2);
const title = args.find((arg) => !arg.startsWith("--"));

if (!title) {
  console.error('Uso: npm run new-post -- "Titulo do post"');
  console.error('Opcional: --section="Arquivo Mutante" --excerpt="Resumo curto" --date=2026-06-16');
  process.exit(1);
}

const options = parseOptions(args);
const date = options.date || currentDate();
const section = options.section || "Manchete Radioativa";
const excerpt = options.excerpt || "Resumo curto do post para aparecer na capa e nas previas de compartilhamento.";
const category = options.category || "Cultura pop";
const author = options.author || "Redacao Radioativa";
const slug = options.slug || slugify(title);
const fileName = `${slug}.html`;
const postPath = path.join(postsDir, fileName);

if (fs.existsSync(postPath)) {
  console.error(`Ja existe um post em posts/${fileName}`);
  process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(postsFile, "utf8"));

if (posts.some((post) => post.url === `posts/${fileName}`)) {
  console.error(`O post posts/${fileName} ja esta cadastrado em data/posts.json`);
  process.exit(1);
}

fs.writeFileSync(postPath, buildPostHtml({ title, section, date, excerpt, category, author, slug }), "utf8");

posts.forEach((post) => {
  delete post.card;
});

posts.unshift({
  title,
  section,
  date,
  excerpt,
  url: `posts/${fileName}`,
  card: "featured",
});

fs.writeFileSync(postsFile, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

console.log(`Post criado: posts/${fileName}`);
console.log("Indice atualizado: data/posts.json");

function parseOptions(values) {
  return values.reduce((acc, value) => {
    if (!value.startsWith("--")) return acc;

    const eqIndex = value.indexOf("=");
    if (eqIndex === -1) {
      acc[value.slice(2)] = true;
      return acc;
    }

    acc[value.slice(2, eqIndex)] = value.slice(eqIndex + 1);
    return acc;
  }, {});
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function currentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateLong(value) {
  const [year, month, day] = value.split("-");
  const months = [
    "janeiro",
    "fevereiro",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
}

function buildPostHtml(post) {
  const safeTitle = escapeHtml(post.title);
  const safeSection = escapeHtml(post.section);
  const safeExcerpt = escapeHtml(post.excerpt);
  const safeCategory = escapeHtml(post.category);
  const safeAuthor = escapeHtml(post.author);
  const safeDate = escapeHtml(post.date);
  const readableDate = escapeHtml(formatDateLong(post.date));
  const canonical = `https://rafium-ms.github.io/blog-nerd/posts/${post.slug}.html`;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${safeExcerpt}">
    <title>${safeTitle} | A Gazeta Radioativa</title>
    <link rel="canonical" href="${canonical}">

    <meta property="og:type" content="article">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="A Gazeta Radioativa">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeExcerpt}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://rafium-ms.github.io/blog-nerd/assets/img/header.webp">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600;700&family=Libre+Baskerville:wght@400;700&display=swap"
      rel="stylesheet"
    >
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon-32.png">
    <link rel="icon" type="image/png" sizes="180x180" href="../assets/favicon.png">
    <link rel="apple-touch-icon" href="../assets/favicon.png">
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <header class="nav-bar" aria-label="Navegacao principal">
      <a class="brand" href="../index.html">A Gazeta Radioativa</a>
      <div class="nav-links">
        <a href="../index.html">Capa</a>
        <a href="../sobre.html">Sobre</a>
        <a href="../index.html#editorias">Editorias</a>
        <a href="../index.html#manchetes">Manchetes</a>
      </div>
    </header>

    <main class="post-page">
      <article class="headline-card post-article">
        <p class="section-label">${safeSection}</p>

        <h1>${safeTitle}</h1>

        <p class="post-meta">
          Publicado em <time datetime="${safeDate}">${readableDate}</time>
          &middot; Por ${safeAuthor}
          &middot; Categoria: ${safeCategory}
        </p>

        <p class="lead">
          ${safeExcerpt}
        </p>

        <hr class="post-divider">

        <h2>Subtitulo da primeira secao</h2>
        <p>
          Desenvolva o primeiro bloco da materia aqui.
        </p>

        <h2>O que esta em jogo?</h2>
        <p>
          Explique o impacto cultural, a nostalgia, a teoria, o jogo, o filme, a serie ou o projeto analisado.
        </p>

        <blockquote>
          "Use uma frase marcante para quebrar o texto e dar cara de jornal."
        </blockquote>

        <h2>Veredito da redacao</h2>
        <p>
          Feche com sua opiniao, conclusao ou gancho para o proximo post.
        </p>

        <aside class="post-box">
          <h3>Ficha radioativa</h3>
          <ul>
            <li><strong>Tema:</strong> Filme, serie, game, HQ ou projeto</li>
            <li><strong>Editoria:</strong> ${safeSection}</li>
            <li><strong>Nivel de radiacao:</strong> Medio</li>
            <li><strong>Recomendado para:</strong> fas de cultura pop, nostalgia e teorias</li>
          </ul>
        </aside>

        <p>
          <a href="../index.html">&larr; Voltar para a capa</a>
        </p>
      </article>
    </main>

    <footer class="site-footer">
      <p>A Gazeta Radioativa &copy; 2026</p>
      <p><a href="../index.html">Voltar para a capa</a></p>
    </footer>

    <script src="../main.js" defer></script>
  </body>
</html>
`;
}

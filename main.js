(function () {
  "use strict";

  var postsContainer = document.querySelector("[data-post-list]");

  if (postsContainer) {
    renderPosts().then(setupCards);
  } else {
    setupCards();
  }

  function renderPosts() {
    return fetch("data/posts.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Nao foi possivel carregar data/posts.json");
        }

        return response.json();
      })
      .then(function (posts) {
        if (!Array.isArray(posts) || posts.length === 0) return;

        var featuredIndex = posts.findIndex(function (post) {
          return post.card === "featured";
        });

        if (featuredIndex === -1) {
          featuredIndex = 0;
        }

        postsContainer.innerHTML = "";
        posts.forEach(function (post, index) {
          postsContainer.appendChild(createPostCard(post, index === featuredIndex));
        });
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  function createPostCard(post, isFeatured) {
    var article = document.createElement("article");
    article.className = isFeatured
      ? "headline-card featured-post"
      : "news-card post-card";

    if (post.tone) {
      article.className += " " + post.tone;
    }

    var meta = document.createElement("div");
    meta.className = "post-card-meta";

    var section = document.createElement("span");
    section.textContent = post.section || "Gazeta Radioativa";

    var time = document.createElement("time");
    if (post.date) {
      time.dateTime = post.date;
      time.textContent = formatDate(post.date);
    }

    meta.appendChild(section);
    meta.appendChild(time);
    article.appendChild(meta);

    var title = document.createElement(isFeatured ? "h2" : "h3");
    if (isFeatured) {
      title.id = "titulo-manchetes";
    }
    title.textContent = post.title || "Post sem titulo";
    article.appendChild(title);

    var excerpt = document.createElement("p");
    excerpt.textContent = post.excerpt || "";
    article.appendChild(excerpt);

    var link = document.createElement("a");
    link.className = "read-more";
    link.href = post.url || "#";
    link.textContent = "Ler materia";
    article.appendChild(link);

    return article;
  }

  function formatDate(value) {
    var parts = value.split("-");
    if (parts.length !== 3) return value;

    var months = [
      "jan.",
      "fev.",
      "mar.",
      "abr.",
      "mai.",
      "jun.",
      "jul.",
      "ago.",
      "set.",
      "out.",
      "nov.",
      "dez.",
    ];

    return Number(parts[2]) + " " + months[Number(parts[1]) - 1] + " " + parts[0];
  }

  function setupCards() {
    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var cards = document.querySelectorAll(
      ".headline-card, .news-card, .section-grid article"
    );

    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              entry.target.style.transitionDelay = i * 60 + "ms";
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      cards.forEach(function (card) {
        card.classList.add("reveal");
        observer.observe(card);
      });
    }

    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;

    if (finePointer && !reduceMotion) {
      cards.forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
          var rect = card.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;
          var max = 6;
          card.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
          card.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
          card.classList.add("is-tilting");
        });

        card.addEventListener("mouseleave", function () {
          card.style.removeProperty("--rx");
          card.style.removeProperty("--ry");
          card.classList.remove("is-tilting");
        });
      });
    }

    var clickableCards = document.querySelectorAll("[data-href]");

    clickableCards.forEach(function (card) {
      var href = card.getAttribute("data-href");
      if (!href) return;

      card.classList.add("is-clickable");

      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
      if (!card.hasAttribute("role")) card.setAttribute("role", "link");

      function go(newTab) {
        if (newTab) {
          window.open(href, "_blank", "noopener");
        } else {
          window.location.href = href;
        }
      }

      card.addEventListener("click", function (e) {
        if (e.target.closest("a, button")) return;

        var sel = window.getSelection();
        if (sel && sel.toString().length > 0) return;

        go(e.metaKey || e.ctrlKey);
      });

      card.addEventListener("keydown", function (e) {
        if (e.target !== card) return;

        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          go(false);
        }
      });
    });
  }
})();

// A Gazeta Radioativa — interações dos cards
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var cards = document.querySelectorAll(
    ".headline-card, .news-card, .section-grid article"
  );

  // 1) Revelar os cards conforme entram na tela
  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // pequeno escalonamento entre os cards visíveis ao mesmo tempo
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

  // 2) Tilt 3D sutil ao mover o mouse (apenas ponteiro fino)
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    .matches;

  if (finePointer && !reduceMotion) {
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var max = 6; // graus
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

  // 3) Card inteiro clicável (mantendo os links internos funcionando)
  var clickableCards = document.querySelectorAll("[data-href]");

  clickableCards.forEach(function (card) {
    var href = card.getAttribute("data-href");
    if (!href) return;

    card.classList.add("is-clickable");

    // Acessibilidade: comporta-se como um link
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
      // Se clicou em um link/botão de verdade dentro do card, respeita ele
      if (e.target.closest("a, button")) return;
      // Permite seleção de texto sem disparar navegação
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
})();

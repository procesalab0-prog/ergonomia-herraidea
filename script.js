(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number.parseInt(entry.target.dataset.delay || "0", 10);
          window.setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((element) => revealObserver.observe(element));
  }

  document.querySelectorAll("[style-hover]").forEach((element) => {
    const hoverStyles = element.getAttribute("style-hover")
      .split(";")
      .map((rule) => rule.trim())
      .filter(Boolean)
      .map((rule) => {
        const separator = rule.indexOf(":");
        return [rule.slice(0, separator).trim(), rule.slice(separator + 1).trim()];
      });
    const originalStyles = new Map(hoverStyles.map(([property]) => [property, element.style.getPropertyValue(property)]));

    const applyHover = () => hoverStyles.forEach(([property, value]) => element.style.setProperty(property, value));
    const removeHover = () => originalStyles.forEach((value, property) => element.style.setProperty(property, value));

    element.addEventListener("mouseenter", applyHover);
    element.addEventListener("mouseleave", removeHover);
    element.addEventListener("focus", applyHover);
    element.addEventListener("blur", removeHover);
  });

  const nav = document.getElementById("hd-nav");
  const progress = document.getElementById("hd-progress");
  const heroBackground = document.getElementById("hd-hero-bg");
  const imageBand = document.getElementById("hd-band-1");
  let ticking = false;

  const updateScrollEffects = () => {
    const scrollY = window.scrollY || 0;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) progress.style.width = `${scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0}%`;
    if (nav) {
      const compact = scrollY > 80;
      nav.style.background = compact ? "rgba(16,18,21,.86)" : "rgba(16,18,21,0)";
      nav.style.backdropFilter = compact ? "blur(14px)" : "blur(0px)";
      nav.style.borderBottomColor = compact ? "rgba(250,251,253,.12)" : "rgba(250,251,253,0)";
      nav.style.paddingTop = compact ? "12px" : "20px";
      nav.style.paddingBottom = compact ? "12px" : "20px";
    }

    if (!reducedMotion) {
      if (heroBackground && scrollY < window.innerHeight * 1.2) {
        heroBackground.style.transform = `translateY(${scrollY * 0.22}px) scale(1.04)`;
      }
      if (imageBand) {
        const bounds = imageBand.parentElement.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          imageBand.style.transform = `translateY(${(bounds.top - window.innerHeight / 2) * -0.09}px)`;
        }
      }
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollEffects);
    },
    { passive: true },
  );
  updateScrollEffects();

  const comparisonToggle = document.getElementById("hd-ab-toggle");
  comparisonToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ab]");
    if (!button) return;
    const mode = button.dataset.ab;

    comparisonToggle.querySelectorAll("[data-ab]").forEach((item) => {
      const active = item === button;
      item.style.background = active ? "#AA0003" : "transparent";
      item.style.borderColor = active ? "#AA0003" : "#3A3E44";
      item.style.color = active ? "#FAFBFD" : "#C3C7CC";
      item.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("#propuestas [data-side]").forEach((item) => {
      const dimmed = mode !== "ambos" && item.dataset.side !== mode;
      item.style.opacity = dimmed ? "0.22" : "1";
      item.style.filter = dimmed ? "grayscale(1)" : "none";
    });
  });

  comparisonToggle?.querySelectorAll("[data-ab]").forEach((button, index) => {
    button.setAttribute("aria-pressed", String(index === 0));
  });
})();

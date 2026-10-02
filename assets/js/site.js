(() => {
  const KEY = "rottor-theme";

  const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

  const readTheme = () => {
    try {
      return localStorage.getItem(KEY) || "system";
    } catch (e) {
      return "system";
    }
  };

  const applyTheme = (theme) => {
    const dark = theme === "dark" || (theme !== "light" && systemDark());
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", dark);
    document.querySelectorAll("[data-theme-set]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeSet === theme));
    });
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    applyTheme(theme);
  };

  applyTheme(readTheme());

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (readTheme() === "system") applyTheme("system");
  });

  const revealTheme = (origin, theme) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduce || typeof document.startViewTransition !== "function") {
      saveTheme(theme);
      return;
    }

    const transition = document.startViewTransition(() => saveTheme(theme));
    transition.ready.then(() => {
      const { top, left, width, height } = origin.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;
      const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }).catch(() => {});
  };

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", (event) => {
    const current = readTheme();
    const dark = current === "dark" || (current !== "light" && systemDark());
    revealTheme(event.currentTarget, dark ? "light" : "dark");
  });

  document.querySelectorAll("[data-theme-set]").forEach((button) => {
    button.addEventListener("click", (event) => revealTheme(event.currentTarget, button.dataset.themeSet));
  });

  const header = document.querySelector("[data-header]");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 50);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const fitPreviews = () => {
    document.querySelectorAll("[data-preview]").forEach((host) => {
      const stage = host.querySelector(".preview-stage");
      if (!stage) return;
      const scale = Math.min(host.clientWidth / 360, host.clientHeight / 760);
      stage.style.transform = `translateX(-50%) scale(${scale || 1})`;
    });
  };

  const ro = new ResizeObserver(fitPreviews);
  document.querySelectorAll("[data-preview]").forEach((host) => ro.observe(host));
  fitPreviews();

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-track]");
    const prev = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    if (!track || !prev || !next) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };

    const step = () => {
      const slide = track.querySelector(".tour-slide");
      if (!slide) return track.clientWidth * 0.8;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      return slide.getBoundingClientRect().width + gap;
    };

    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();

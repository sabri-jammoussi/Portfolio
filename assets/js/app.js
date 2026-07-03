/* ==========================================================================
   Sabri Jammoussi — Portfolio 2026 — app.js
   Vanilla ES6+, modular. No framework, no dependencies.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const preloader = () => {
    const el = $("#preloader");
    if (!el) return;
    window.addEventListener("load", () => setTimeout(() => el.classList.add("done"), 300));
    // safety fallback
    setTimeout(() => el.classList.add("done"), 2500);
  };

  /* ---------- Theme toggle (persisted) ---------- */
  const theme = () => {
    const btn = $("#theme-btn");
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const initial = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    apply(initial);

    function apply(mode) {
      root.setAttribute("data-theme", mode);
      if (btn) btn.querySelector("i").className = mode === "light" ? "bi bi-moon-stars" : "bi bi-sun";
    }
    btn?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      apply(next);
    });
  };

  /* ---------- Navbar: scrolled state + scroll progress + active link ---------- */
  const nav = () => {
    const navEl = $(".nav");
    const progress = $("#progress");
    const sections = $$("section[id]");
    const links = $$(".nav-links a");

    const onScroll = () => {
      const y = window.scrollY;
      navEl?.classList.toggle("scrolled", y > 30);

      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

      // active section
      let current = "";
      const mid = y + window.innerHeight * 0.32;
      sections.forEach((s) => { if (mid >= s.offsetTop) current = s.id; });
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  /* ---------- Mobile menu ---------- */
  const mobileMenu = () => {
    const toggle = $(".nav-toggle");
    const menu = $(".mobile-menu");
    const close = $(".mobile-close");
    if (!toggle || !menu) return;
    const open = () => { menu.classList.add("open"); document.body.style.overflow = "hidden"; };
    const shut = () => { menu.classList.remove("open"); document.body.style.overflow = ""; };
    toggle.addEventListener("click", open);
    close?.addEventListener("click", shut);
    $$("a", menu).forEach((a) => a.addEventListener("click", shut));
  };

  /* ---------- Scroll reveal ---------- */
  const reveal = () => {
    const items = $$("[data-reveal]");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((i) => io.observe(i));
  };

  /* ---------- Count-up stats ---------- */
  const counters = () => {
    const els = $$("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      if (prefersReduced) { el.textContent = target + suffix; return; }
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  };

  /* ---------- Typing effect ---------- */
  const typed = () => {
    const el = $(".typed");
    if (!el) return;
    const words = (el.dataset.words || "").split("|").filter(Boolean);
    if (!words.length) return;
    if (prefersReduced) { el.textContent = words[0]; return; }
    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      el.textContent = word.substring(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(tick, 90); }
      else if (!deleting && c === word.length) { deleting = true; setTimeout(tick, 1600); }
      else if (deleting && c > 0) { c--; setTimeout(tick, 45); }
      else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
    };
    tick();
  };

  /* ---------- Project filters ---------- */
  const filters = () => {
    const btns = $$(".filters button");
    const projects = $$(".project");
    if (!btns.length) return;
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const f = b.dataset.filter;
      projects.forEach((p) => {
        const show = f === "*" || (p.dataset.cat || "").split(" ").includes(f);
        p.classList.toggle("hide", !show);
      });
    }));
  };

  /* ---------- Cursor glow + hero parallax ---------- */
  const pointerFx = () => {
    if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;
    const glow = $("#cursor-glow");
    const chips = $$(".hero-visual .chip");
    let raf;
    window.addEventListener("pointermove", (e) => {
      if (glow) { glow.style.opacity = "1"; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (glow) { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }
        const cx = (e.clientX / window.innerWidth - 0.5);
        const cy = (e.clientY / window.innerHeight - 0.5);
        chips.forEach((chip, i) => {
          const d = (i + 1) * 8;
          chip.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
        });
      });
    });
  };

  /* ---------- Contact form (client-side validation) ---------- */
  const contactForm = () => {
    const form = $(".contact-form");
    if (!form) return;
    const success = $(".form-success", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((field) => {
        const input = $("input, textarea", field);
        if (!input) return;
        let valid = input.value.trim() !== "";
        if (input.type === "email") valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim());
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      // No backend wired — surface success and open mail client as graceful fallback.
      success?.classList.add("show");
      const name = $("#cf-name")?.value || "";
      const msg = $("#cf-message")?.value || "";
      const subject = encodeURIComponent($("#cf-subject")?.value || "Contact portfolio");
      const body = encodeURIComponent(`${msg}\n\n— ${name}`);
      setTimeout(() => { window.location.href = `mailto:sabrijm123@gmail.com?subject=${subject}&body=${body}`; }, 600);
      form.reset();
      setTimeout(() => success?.classList.remove("show"), 6000);
    });
    // clear invalid on input
    $$(".field input, .field textarea", form).forEach((i) =>
      i.addEventListener("input", () => i.closest(".field").classList.remove("invalid")));
  };

  /* ---------- Scroll-to-top ---------- */
  const scrollTop = () => {
    const btn = $("#scroll-top");
    if (!btn) return;
    window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));
  };

  /* ---------- Year ---------- */
  const year = () => { const el = $("#year"); if (el) el.textContent = new Date().getFullYear(); };

  /* ---------- Init ---------- */
  const init = () => {
    preloader(); theme(); nav(); mobileMenu(); reveal(); counters();
    typed(); filters(); pointerFx(); contactForm(); scrollTop(); year();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();

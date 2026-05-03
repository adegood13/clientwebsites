/* Amanda Rachael Photography — main page interactions */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const nav = $("#nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const burger = $(".nav__burger");
  const mobile = $("#nav__mobile");
  if (burger && mobile) {
    burger.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      mobile.hidden = !open;
    });
    $$("#nav__mobile a").forEach(a => a.addEventListener("click", () => {
      mobile.classList.remove("is-open");
      mobile.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  // portfolio tabs
  const ptabs = $$(".ptab");
  const ppanels = $$(".ppanel");
  ptabs.forEach(t => {
    t.addEventListener("click", () => {
      const target = t.dataset.ptab;
      ptabs.forEach(x => {
        const active = x === t;
        x.classList.toggle("is-active", active);
        x.setAttribute("aria-selected", active ? "true" : "false");
      });
      ppanels.forEach(p => p.classList.toggle("is-active", p.dataset.ppanel === target));
    });
  });
})();

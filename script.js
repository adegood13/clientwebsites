/* Amor Nails & Spa — main page interactions */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // year
  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  // sticky nav shadow
  const nav = $("#nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // mobile burger
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

  // service tabs
  const tabs = $$(".tab");
  const panels = $$(".panel");
  tabs.forEach(t => {
    t.addEventListener("click", () => {
      const target = t.dataset.tab;
      tabs.forEach(x => {
        const active = x === t;
        x.classList.toggle("is-active", active);
        x.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === target));
    });
  });

  // dynamic "open today" status — based on actual hours
  const openStatus = $("#open-status");
  if (openStatus) {
    const now = new Date();
    const day = now.getDay(); // 0 Sun ... 6 Sat
    const minutes = now.getHours() * 60 + now.getMinutes();
    let open, close;
    if (day === 0) { open = 11 * 60; close = 17 * 60; }
    else { open = 9 * 60 + 30; close = 19 * 60 + 30; }

    if (minutes < open) openStatus.textContent = "Opens at " + (day === 0 ? "11:00am" : "9:30am");
    else if (minutes >= close) openStatus.textContent = "Closed · opens tomorrow";
    else openStatus.textContent = (day === 0 ? "11:00am" : "9:30am") + " – " + (day === 0 ? "5:00pm" : "7:30pm");
  }
})();

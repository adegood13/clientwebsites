/* Albuquerque Ink Tattoo — main page interactions */
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

  // style cards link to booking with style preselected
  $$(".style-card").forEach(c => {
    c.addEventListener("click", () => {
      const map = { fine:"Fine line", bg:"Black & grey", color:"Color", trad:"Traditional", port:"Portrait", lett:"Lettering", cover:"Cover-up", "3d":"3D / illusion" };
      const s = map[c.dataset.style] || "";
      window.location.href = "booking.html?style=" + encodeURIComponent(s);
    });
  });
})();

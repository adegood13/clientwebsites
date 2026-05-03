/* Golden Auto Detailing — main page interactions */
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

  // open status — 9am–7pm daily
  const openStatus = $("#open-status");
  if (openStatus) {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const open = 9 * 60, close = 19 * 60;
    if (minutes < open) openStatus.textContent = "Opens 9:00am";
    else if (minutes >= close) openStatus.textContent = "Closed · opens 9am tomorrow";
    else openStatus.textContent = "9:00am – 7:00pm";
  }
})();

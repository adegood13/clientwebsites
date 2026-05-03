/* Amor Nails & Spa — booking flow (simulated, no backend) */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const state = {
    step: 1,
    service: null, // {name, price, time}
    tech: null,
    date: null,    // ISO date string
    time: null,    // "10:30am"
    deposit: false,
  };

  /* ---------- step navigation ---------- */
  const stepEls = $$(".book__step");
  const stepPills = $$("#steps .step");
  const next = $("#next");
  const prev = $("#prev");

  function show() {
    stepEls.forEach(s => s.hidden = +s.dataset.step !== state.step);
    stepPills.forEach(p => {
      const n = +p.dataset.step;
      p.classList.toggle("is-active", n === state.step);
      p.classList.toggle("is-done", n < state.step);
    });
    prev.style.visibility = state.step === 1 ? "hidden" : "visible";
    next.textContent = state.step === 5 ? "Reserve →" : "Continue →";
    next.disabled = !canAdvance();
    if (state.step === 3) renderDateTime();
    if (state.step === 5) renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function canAdvance() {
    switch (state.step) {
      case 1: return !!state.service;
      case 2: return !!state.tech;
      case 3: return !!state.date && !!state.time;
      case 4: {
        const fn = $("#firstName").value.trim();
        const ln = $("#lastName").value.trim();
        const ph = $("#phone").value.trim();
        return fn && ln && ph.replace(/\D/g, "").length >= 10;
      }
      case 5: return true;
    }
  }

  next.addEventListener("click", () => {
    if (!canAdvance()) return;
    if (state.step === 5) return reserve();
    state.step++;
    show();
  });
  prev.addEventListener("click", () => {
    if (state.step === 1) return;
    state.step--;
    show();
  });

  /* ---------- step 1: services ---------- */
  $$("#services .opt").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#services .opt").forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      state.service = {
        name: btn.dataset.svc,
        price: +btn.dataset.price,
        time: +btn.dataset.time,
      };
      next.disabled = !canAdvance();
    });
  });

  /* ---------- step 2: techs ---------- */
  $$("#techs .opt").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#techs .opt").forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      state.tech = btn.dataset.tech;
      next.disabled = !canAdvance();
    });
  });

  /* ---------- step 3: date & time ---------- */
  function renderDateTime() {
    const dates = $("#dates");
    if (dates.children.length) return; // build once
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dow = d.toLocaleString("en-US", { weekday: "short" });
      const day = d.getDate();
      const mon = d.toLocaleString("en-US", { month: "short" });
      const iso = d.toISOString().slice(0, 10);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "date";
      btn.dataset.iso = iso;
      btn.dataset.dow = d.getDay();
      btn.innerHTML = `<span class="date__dow">${dow}${i===0?" · today":""}</span><span class="date__day">${day}</span><span class="date__mon">${mon}</span>`;
      btn.addEventListener("click", () => {
        $$(".date").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        state.date = iso;
        state.time = null;
        renderTimes(+btn.dataset.dow);
        next.disabled = !canAdvance();
      });
      dates.appendChild(btn);
    }
    // pre-select first non-Sunday-too-late date
    dates.firstChild.click();
  }

  function renderTimes(dow) {
    const times = $("#times");
    times.innerHTML = "";
    const slots = dow === 0
      ? ["11:00am","11:30am","12:00pm","12:30pm","1:00pm","1:30pm","2:00pm","2:30pm","3:00pm","3:30pm","4:00pm","4:30pm"]
      : ["9:30am","10:00am","10:30am","11:00am","11:30am","12:00pm","12:30pm","1:00pm","1:30pm","2:00pm","2:30pm","3:00pm","3:30pm","4:00pm","4:30pm","5:00pm","5:30pm","6:00pm","6:30pm","7:00pm"];
    // randomly disable a few to feel real
    const taken = new Set();
    const seed = state.date.split("-").reduce((a, b) => a + +b, 0);
    for (let i = 0; i < 3 + (seed % 3); i++) taken.add(slots[(seed * (i + 7)) % slots.length]);

    slots.forEach(s => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "time";
      b.textContent = s;
      if (taken.has(s)) b.disabled = true;
      b.addEventListener("click", () => {
        $$(".time").forEach(x => x.classList.remove("is-selected"));
        b.classList.add("is-selected");
        state.time = s;
        next.disabled = !canAdvance();
      });
      times.appendChild(b);
    });
  }

  /* ---------- step 4: info validation ---------- */
  ["#firstName","#lastName","#phone","#email"].forEach(sel => {
    const el = $(sel);
    if (el) el.addEventListener("input", () => { next.disabled = !canAdvance(); });
  });

  // phone formatting (light)
  const phoneEl = $("#phone");
  if (phoneEl) {
    phoneEl.addEventListener("input", () => {
      const d = phoneEl.value.replace(/\D/g, "").slice(0, 10);
      if (d.length === 0) return phoneEl.value = "";
      if (d.length < 4) phoneEl.value = "(" + d;
      else if (d.length < 7) phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3);
      else phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
    });
  }

  /* ---------- step 5: summary ---------- */
  $("#deposit").addEventListener("change", e => { state.deposit = e.target.checked; renderSummary(); });

  function fmtDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  function renderSummary() {
    const s = state;
    const sub = s.service ? s.service.price : 0;
    const dep = s.deposit ? 15 : 0;
    const due = s.deposit ? 15 : 0;
    const balance = sub - dep;
    const html = `
      <h3>Booking summary</h3>
      <dl>
        <div><dt>Service</dt><dd>${s.service ? s.service.name : "—"}</dd></div>
        <div><dt>Length</dt><dd>${s.service ? s.service.time + " min" : "—"}</dd></div>
        <div><dt>Technician</dt><dd>${s.tech || "—"}</dd></div>
        <div><dt>Date</dt><dd>${s.date ? fmtDate(s.date) : "—"}</dd></div>
        <div><dt>Time</dt><dd>${s.time || "—"}</dd></div>
        <div><dt>Service total</dt><dd>$${sub}</dd></div>
        ${s.deposit ? `<div><dt>Deposit (today)</dt><dd>−$${dep}</dd></div><div><dt>Balance at chair</dt><dd>$${balance}</dd></div>` : ""}
        <div class="summary__total"><dt>${s.deposit ? "Charged today" : "Due at chair"}</dt><dd>$${s.deposit ? due : sub}</dd></div>
      </dl>
    `;
    $("#summary").innerHTML = html;
  }

  /* ---------- reserve ---------- */
  function reserve() {
    const s = state;
    const payload = {
      service: s.service,
      tech: s.tech,
      date: s.date,
      time: s.time,
      deposit: s.deposit,
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      phone: $("#phone").value.trim(),
      email: $("#email").value.trim(),
      notes: $("#notes").value.trim(),
    };
    sessionStorage.setItem("amor_booking", JSON.stringify(payload));
    if (s.deposit) {
      window.location.href = "checkout.html";
    } else {
      window.location.href = "confirmation.html";
    }
  }

  /* init */
  show();
})();

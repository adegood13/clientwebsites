/* Purrfect Cleaning Co — booking flow with instant quote calculator */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const state = {
    step: 1,
    service: null,        // {name, base, mult}
    beds: "", baths: "", sqft: "", condition: 1.0,
    addons: [],
    frequency: null,      // {name, disc}
    date: null, time: null,
    quote: 0,
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get("svc")) {
    setTimeout(() => {
      const target = params.get("svc").replace(/\+/g," ").toLowerCase();
      const map = { "move in out": "move-in / move-out", "move-in / move-out": "move-in / move-out" };
      const lookup = map[target] || target;
      const btn = $$("#services .opt").find(b => b.dataset.svc.toLowerCase() === lookup);
      if (btn) btn.click();
    }, 0);
  }

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
    next.textContent = state.step === 6 ? "Confirm booking →" : "Continue →";
    next.disabled = !canAdvance();
    if (state.step === 4) renderDateTime();
    if (state.step === 6) renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function canAdvance() {
    switch (state.step) {
      case 1: return !!state.service;
      case 2: return !!state.beds && !!state.baths && !!state.sqft;
      case 3: return !!state.frequency;
      case 4: return !!state.date && !!state.time;
      case 5: {
        const fn = $("#firstName").value.trim();
        const ln = $("#lastName").value.trim();
        const ph = $("#phone").value.trim();
        const em = $("#email").value.trim();
        const ad = $("#address").value.trim();
        const en = $("#entry").value;
        return fn && ln && ph.replace(/\D/g,"").length >= 10 && /\S+@\S+\.\S+/.test(em) && ad && en;
      }
      case 6: return true;
    }
  }

  next.addEventListener("click", () => {
    if (!canAdvance()) return;
    if (state.step === 6) return reserve();
    state.step++;
    show();
  });
  prev.addEventListener("click", () => { if (state.step > 1) { state.step--; show(); } });

  $$("#services .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#services .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.service = { name: btn.dataset.svc, base: +btn.dataset.base, mult: +btn.dataset.mult };
    next.disabled = !canAdvance();
    updateQuote();
  }));

  // Home inputs
  ["#beds","#baths","#sqft"].forEach(sel => {
    const el = $(sel); if (!el) return;
    el.addEventListener("change", () => {
      state.beds = $("#beds").value;
      state.baths = $("#baths").value;
      state.sqft = $("#sqft").value;
      next.disabled = !canAdvance();
      updateQuote();
    });
  });
  $("#condition").addEventListener("change", e => {
    state.condition = +e.target.value;
    updateQuote();
  });
  $$('input[data-add]').forEach(cb => cb.addEventListener("change", () => {
    state.addons = $$('input[data-add]:checked').map(x => ({ name: x.dataset.add, price: +x.dataset.up }));
    updateQuote();
  }));

  function bedsBath() {
    const bedNum = state.beds === "Studio" ? 0.5 : (state.beds === "6+" ? 6 : +state.beds || 0);
    const bathNum = state.baths === "4+" ? 4 : +state.baths || 0;
    return { bedNum, bathNum };
  }
  function sqftMult() {
    const map = {
      "Under 1,000": 0.85,
      "1,000–1,500": 1.0,
      "1,500–2,000": 1.15,
      "2,000–3,000": 1.35,
      "3,000–4,000": 1.6,
      "Over 4,000": 1.85,
    };
    return map[state.sqft] || 1.0;
  }
  function updateQuote() {
    if (!state.service || !state.beds || !state.baths || !state.sqft) {
      $("#quoteCard").style.display = "none";
      return;
    }
    const { bedNum, bathNum } = bedsBath();
    const base = state.service.base;
    const sf = sqftMult();
    // base + per-bed/bath beyond 2/1, scaled by sqft + condition
    const bedAdj = Math.max(0, bedNum - 2) * 18;
    const bathAdj = Math.max(0, bathNum - 1) * 14;
    const core = (base + bedAdj + bathAdj) * sf * state.condition;
    const addonTotal = state.addons.reduce((a,b) => a + b.price, 0);
    const quote = Math.round((core + addonTotal) / 5) * 5; // round to nearest $5
    state.quote = quote;
    $("#quoteCard").style.display = "block";
    $("#quoteNum").textContent = quote;
  }

  // step 3
  $$("#frequencies .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#frequencies .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.frequency = { name: btn.dataset.freq, disc: +btn.dataset.disc };
    next.disabled = !canAdvance();
  }));

  // step 4
  function renderDateTime() {
    const dates = $("#dates");
    if (dates.children.length) return;
    const today = new Date();
    let added = 0; let i = 1; // start tomorrow for next-day booking
    while (added < 14 && i < 60) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      i++;
      // skip Sundays
      if (d.getDay() === 0) continue;
      const dow = d.toLocaleString("en-US", { weekday: "short" });
      const day = d.getDate();
      const mon = d.toLocaleString("en-US", { month: "short" });
      const iso = d.toISOString().slice(0, 10);
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "date"; btn.dataset.iso = iso;
      btn.innerHTML = `<span class="date__dow">${dow}</span><span class="date__day">${day}</span><span class="date__mon">${mon}</span>`;
      btn.addEventListener("click", () => {
        $$(".date").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        state.date = iso; state.time = null;
        renderTimes();
        next.disabled = !canAdvance();
      });
      dates.appendChild(btn);
      added++;
    }
    if (dates.firstChild) dates.firstChild.click();
  }
  function renderTimes() {
    const times = $("#times"); times.innerHTML = "";
    const slots = ["8am – 10am","9am – 11am","10am – 12pm","12pm – 2pm","1pm – 3pm","2pm – 4pm"];
    const seed = state.date.split("-").reduce((a,b)=>a+ +b,0);
    const taken = new Set();
    for (let j=0;j<2+(seed%2);j++) taken.add(slots[(seed*(j+5))%slots.length]);
    slots.forEach(s => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "time"; b.textContent = s;
      if (taken.has(s)) b.disabled = true;
      b.addEventListener("click", () => {
        $$(".time").forEach(x=>x.classList.remove("is-selected"));
        b.classList.add("is-selected");
        state.time = s;
        next.disabled = !canAdvance();
      });
      times.appendChild(b);
    });
  }

  // step 5 validation
  ["#firstName","#lastName","#phone","#email","#address"].forEach(sel => {
    const el = $(sel); if (el) el.addEventListener("input", () => { next.disabled = !canAdvance(); });
  });
  $("#entry").addEventListener("change", () => { next.disabled = !canAdvance(); });
  const phoneEl = $("#phone");
  phoneEl.addEventListener("input", () => {
    const d = phoneEl.value.replace(/\D/g,"").slice(0,10);
    if (d.length === 0) return phoneEl.value = "";
    if (d.length < 4) phoneEl.value = "(" + d;
    else if (d.length < 7) phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3);
    else phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
  });

  // step 6
  function fmtDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  function renderSummary() {
    const s = state;
    const perVisit = Math.round(s.quote * (s.frequency?.disc || 1) / 5) * 5;
    const savings = s.quote - perVisit;
    const addonRows = s.addons.map(a => `<div><dt>+ ${a.name}</dt><dd>$${a.price}</dd></div>`).join("");
    $("#summary").innerHTML = `
      <h3>Booking summary</h3>
      <dl>
        <div><dt>Service</dt><dd>${s.service?.name || "—"}</dd></div>
        <div><dt>Home</dt><dd>${s.beds} bd · ${s.baths} ba · ${s.sqft} sqft</dd></div>
        ${addonRows}
        <div><dt>Frequency</dt><dd>${s.frequency?.name || "—"}</dd></div>
        <div><dt>First visit</dt><dd>${s.date ? fmtDate(s.date) : "—"}</dd></div>
        <div><dt>Arrival</dt><dd>${s.time || "—"}</dd></div>
        <div><dt>Address</dt><dd style="text-align:right;max-width:60%">${$("#address").value || "—"}</dd></div>
        ${savings ? `<div><dt>Base quote</dt><dd>$${s.quote}</dd></div><div><dt>${s.frequency.name} discount</dt><dd>−$${savings}</dd></div>` : ""}
        <div class="summary__total"><dt>Per-visit total</dt><dd>$${perVisit}</dd></div>
      </dl>
    `;
  }

  function reserve() {
    const s = state;
    const perVisit = Math.round(s.quote * (s.frequency?.disc || 1) / 5) * 5;
    const payload = {
      ...s,
      perVisit,
      address: $("#address").value.trim(),
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      phone: $("#phone").value.trim(),
      email: $("#email").value.trim(),
      entry: $("#entry").value,
      notes: $("#notes").value.trim(),
    };
    sessionStorage.setItem("purrfect_booking", JSON.stringify(payload));
    window.location.href = "checkout.html";
  }

  show();
})();

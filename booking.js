/* Wicked Ink — booking flow (simulated) */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const state = {
    step: 1,
    service: null,
    style: null,
    artist: null,
    size: "",
    placement: "",
    desc: "",
    budget: "",
    date: null,
    time: null,
    age: "",
    waiver: false,
    deposit: true,
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get("artist")) {
    setTimeout(() => {
      const target = params.get("artist").toLowerCase();
      const btn = $$("#artists .opt").find(b => b.dataset.artist.toLowerCase() === target);
      if (btn) btn.click();
    }, 0);
  }
  if (params.get("style")) {
    setTimeout(() => {
      const target = params.get("style").toLowerCase();
      // piercing param shortcut
      if (target === "piercing") {
        const svc = $$("#services .opt").find(b => b.dataset.svc.toLowerCase() === "body piercing");
        if (svc) svc.click();
        return;
      }
      const btn = $$("#styles .opt").find(b => b.dataset.style.toLowerCase() === target);
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
    next.textContent = state.step === 7 ? "Reserve →" : "Continue →";
    next.disabled = !canAdvance();
    if (state.step === 5) renderDateTime();
    if (state.step === 7) renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function canAdvance() {
    switch (state.step) {
      case 1: return !!state.service;
      case 2: return !!state.style;
      case 3: return !!state.artist;
      case 4: return !!$("#size").value && !!$("#placement").value.trim() && !!$("#desc").value.trim();
      case 5: return !!state.date && !!state.time;
      case 6: {
        const fn = $("#firstName").value.trim();
        const ln = $("#lastName").value.trim();
        const ph = $("#phone").value.trim();
        const em = $("#email").value.trim();
        const age = $("#age").value;
        return fn && ln && ph.replace(/\D/g,"").length >= 10 && /\S+@\S+\.\S+/.test(em) && (age === "yes" || age === "minor");
      }
      case 7: return state.waiver;
    }
  }

  next.addEventListener("click", () => {
    if (!canAdvance()) return;
    if (state.step === 7) return reserve();
    state.step++;
    show();
  });
  prev.addEventListener("click", () => { if (state.step > 1) { state.step--; show(); } });

  $$("#services .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#services .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.service = btn.dataset.svc;
    next.disabled = !canAdvance();
  }));
  $$("#styles .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#styles .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.style = btn.dataset.style;
    next.disabled = !canAdvance();
  }));
  $$("#artists .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#artists .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.artist = btn.dataset.artist;
    next.disabled = !canAdvance();
  }));

  ["#size","#placement","#desc","#budget"].forEach(sel => {
    const el = $(sel); if (el) {
      el.addEventListener("input", () => { next.disabled = !canAdvance(); });
      el.addEventListener("change", () => { next.disabled = !canAdvance(); });
    }
  });

  function renderDateTime() {
    const dates = $("#dates");
    if (dates.children.length) return;
    const today = new Date();
    let added = 0; let i = 0;
    while (added < 14 && i < 60) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      i++;
      // closed Sun (0) and Mon (1)
      if (d.getDay() === 0 || d.getDay() === 1) continue;
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
    const slots = ["12:00pm","1:00pm","2:00pm","3:00pm","4:00pm","5:00pm","6:00pm","7:00pm","8:00pm"];
    const seed = state.date.split("-").reduce((a,b)=>a+ +b,0);
    const taken = new Set();
    for (let j=0;j<2+(seed%3);j++) taken.add(slots[(seed*(j+5))%slots.length]);
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

  ["#firstName","#lastName","#phone","#email","#age"].forEach(sel => {
    const el = $(sel); if (el) {
      el.addEventListener("input", () => { next.disabled = !canAdvance(); });
      el.addEventListener("change", () => { next.disabled = !canAdvance(); });
    }
  });
  const phoneEl = $("#phone");
  phoneEl.addEventListener("input", () => {
    const d = phoneEl.value.replace(/\D/g,"").slice(0,10);
    if (d.length === 0) return phoneEl.value = "";
    if (d.length < 4) phoneEl.value = "(" + d;
    else if (d.length < 7) phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3);
    else phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
  });

  $("#waiverAck").addEventListener("change", e => { state.waiver = e.target.checked; next.disabled = !canAdvance(); });
  $("#deposit").addEventListener("change", e => { state.deposit = e.target.checked; renderSummary(); });

  function fmtDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  function renderSummary() {
    state.size = $("#size").value;
    state.placement = $("#placement").value.trim();
    state.desc = $("#desc").value.trim();
    state.budget = $("#budget").value;
    const s = state;
    $("#summary").innerHTML = `
      <h3>Consult booking</h3>
      <dl>
        <div><dt>Service</dt><dd>${s.service || "—"}</dd></div>
        <div><dt>Style</dt><dd>${s.style || "—"}</dd></div>
        <div><dt>Artist</dt><dd>${s.artist || "—"}</dd></div>
        <div><dt>Size</dt><dd>${s.size || "—"}</dd></div>
        <div><dt>Placement</dt><dd style="text-align:right;max-width:60%">${s.placement || "—"}</dd></div>
        <div><dt>Budget</dt><dd>${s.budget || "—"}</dd></div>
        <div><dt>Consult date</dt><dd>${s.date ? fmtDate(s.date) : "—"}</dd></div>
        <div><dt>Time</dt><dd>${s.time || "—"}</dd></div>
        <div class="summary__total"><dt>${s.deposit ? "Deposit today" : "Due at consult"}</dt><dd>$${s.deposit ? 50 : 0}</dd></div>
      </dl>
    `;
  }

  function reserve() {
    state.size = $("#size").value;
    state.placement = $("#placement").value.trim();
    state.desc = $("#desc").value.trim();
    state.budget = $("#budget").value;
    const payload = {
      ...state,
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      phone: $("#phone").value.trim(),
      email: $("#email").value.trim(),
      age: $("#age").value,
    };
    sessionStorage.setItem("wicked_booking", JSON.stringify(payload));
    window.location.href = state.deposit ? "checkout.html" : "confirmation.html";
  }

  show();
})();

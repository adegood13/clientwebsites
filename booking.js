/* Mobile Detail AZ — booking flow (simulated) */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const state = {
    step: 1,
    service: null,
    vehicle: null,
    vehicleUp: 0,
    vehicleDesc: "",
    addons: [],
    date: null,
    time: null,
    deposit: true,
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get("pkg")) {
    setTimeout(() => {
      const target = params.get("pkg").replace(/\+/g, " ").toLowerCase();
      const btn = $$("#services .opt").find(b => b.dataset.svc.toLowerCase() === target);
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
    next.textContent = state.step === 5 ? "Reserve →" : "Continue →";
    next.disabled = !canAdvance();
    if (state.step === 3) renderDateTime();
    if (state.step === 5) renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function canAdvance() {
    switch (state.step) {
      case 1: return !!state.service;
      case 2: return !!state.vehicle;
      case 3: return !!state.date && !!state.time;
      case 4: {
        const fn = $("#firstName").value.trim();
        const ln = $("#lastName").value.trim();
        const ph = $("#phone").value.trim();
        const em = $("#email").value.trim();
        const ad = $("#address").value.trim();
        return fn && ln && ph.replace(/\D/g,"").length >= 10 && /\S+@\S+\.\S+/.test(em) && ad;
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
  prev.addEventListener("click", () => { if (state.step > 1) { state.step--; show(); } });

  $$("#services .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#services .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.service = { name: btn.dataset.svc, price: +btn.dataset.price, time: +btn.dataset.time };
    next.disabled = !canAdvance();
  }));

  $$("#vehicles .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#vehicles .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.vehicle = btn.dataset.veh;
    state.vehicleUp = +btn.dataset.up;
    next.disabled = !canAdvance();
  }));
  $("#vmake").addEventListener("input", e => state.vehicleDesc = e.target.value.trim());

  $$('input[data-add]').forEach(cb => cb.addEventListener("change", () => {
    state.addons = $$('input[data-add]:checked').map(x => ({ name: x.dataset.add, price: +x.dataset.up }));
  }));

  function renderDateTime() {
    const dates = $("#dates");
    if (dates.children.length) return;
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dow = d.toLocaleString("en-US", { weekday: "short" });
      const day = d.getDate();
      const mon = d.toLocaleString("en-US", { month: "short" });
      const iso = d.toISOString().slice(0, 10);
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "date"; btn.dataset.iso = iso;
      btn.innerHTML = `<span class="date__dow">${dow}${i===0?" · today":""}</span><span class="date__day">${day}</span><span class="date__mon">${mon}</span>`;
      btn.addEventListener("click", () => {
        $$(".date").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        state.date = iso; state.time = null;
        renderTimes();
        next.disabled = !canAdvance();
      });
      dates.appendChild(btn);
    }
    dates.firstChild.click();
  }
  function renderTimes() {
    const times = $("#times"); times.innerHTML = "";
    const slots = ["7:00am","8:00am","9:00am","10:00am","11:00am","12:00pm","1:00pm","2:00pm","3:00pm"];
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

  ["#firstName","#lastName","#phone","#email","#address","#zip"].forEach(sel => {
    const el = $(sel); if (el) el.addEventListener("input", () => { next.disabled = !canAdvance(); });
  });
  const phoneEl = $("#phone");
  phoneEl.addEventListener("input", () => {
    const d = phoneEl.value.replace(/\D/g,"").slice(0,10);
    if (d.length === 0) return phoneEl.value = "";
    if (d.length < 4) phoneEl.value = "(" + d;
    else if (d.length < 7) phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3);
    else phoneEl.value = "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
  });

  $("#deposit").addEventListener("change", e => { state.deposit = e.target.checked; renderSummary(); });

  function fmtDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  function renderSummary() {
    const s = state;
    const addonTotal = s.addons.reduce((a,b) => a + b.price, 0);
    const sub = (s.service?.price || 0) + s.vehicleUp + addonTotal;
    const dep = s.deposit ? 25 : 0;
    let addonRows = s.addons.map(a => `<div><dt>+ ${a.name}</dt><dd>$${a.price}</dd></div>`).join("");
    $("#summary").innerHTML = `
      <h3>Booking summary</h3>
      <dl>
        <div><dt>Package</dt><dd>${s.service?.name || "—"}</dd></div>
        <div><dt>Vehicle</dt><dd>${s.vehicle}${s.vehicleUp ? " (+$"+s.vehicleUp+")" : ""}${s.vehicleDesc ? " — "+s.vehicleDesc : ""}</dd></div>
        ${addonRows}
        <div><dt>Date</dt><dd>${s.date ? fmtDate(s.date) : "—"}</dd></div>
        <div><dt>Time</dt><dd>${s.time || "—"}</dd></div>
        <div><dt>Address</dt><dd style="text-align:right;max-width:60%">${$("#address").value || "—"}</dd></div>
        <div><dt>Service total</dt><dd>$${sub}</dd></div>
        ${s.deposit ? `<div><dt>Deposit (today)</dt><dd>−$${dep}</dd></div><div><dt>Balance on completion</dt><dd>$${sub - dep}</dd></div>` : ""}
        <div class="summary__total"><dt>${s.deposit ? "Charged today" : "Due on completion"}</dt><dd>$${s.deposit ? dep : sub}</dd></div>
      </dl>
    `;
  }

  function reserve() {
    const s = state;
    const addonTotal = s.addons.reduce((a,b) => a + b.price, 0);
    const total = (s.service?.price || 0) + s.vehicleUp + addonTotal;
    const payload = {
      ...s, total,
      address: $("#address").value.trim(),
      zip: $("#zip").value.trim(),
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      phone: $("#phone").value.trim(),
      email: $("#email").value.trim(),
      notes: $("#notes").value.trim(),
      vehicleDesc: state.vehicleDesc,
    };
    sessionStorage.setItem("mdaz_booking", JSON.stringify(payload));
    window.location.href = s.deposit ? "checkout.html" : "confirmation.html";
  }

  show();
})();

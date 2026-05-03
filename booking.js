/* Daphne's Pet Grooming — booking flow (simulated) */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const state = {
    step: 1,
    service: null,
    pet: { name: "", type: "", breed: "", size: 0, age: "", coat: 0, anxious: "" },
    date: null, time: null,
    deposit: true,
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get("svc")) {
    setTimeout(() => {
      const target = params.get("svc").replace(/\+/g," ").toLowerCase();
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
      case 2: {
        const name = $("#petName").value.trim();
        const type = $("#petType").value;
        const breed = $("#petBreed").value.trim();
        const size = $("#petSize").value;
        return name && type && breed && size !== "";
      }
      case 3: return !!state.date && !!state.time;
      case 4: {
        const fn = $("#firstName").value.trim();
        const ln = $("#lastName").value.trim();
        const ph = $("#phone").value.trim();
        const em = $("#email").value.trim();
        const vc = $("#vacc").value;
        return fn && ln && ph.replace(/\D/g,"").length >= 10 && /\S+@\S+\.\S+/.test(em) && vc;
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
    state.service = { name: btn.dataset.svc, base: +btn.dataset.base, time: +btn.dataset.time };
    next.disabled = !canAdvance();
  }));

  // step 2 inputs
  ["#petName","#petType","#petBreed","#petSize","#petAge","#coat","#anxious"].forEach(sel => {
    const el = $(sel); if (!el) return;
    el.addEventListener("input", () => { next.disabled = !canAdvance(); });
    el.addEventListener("change", () => { next.disabled = !canAdvance(); });
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
      if (d.getDay() === 0) continue; // closed Sunday for drop-off
      const dow = d.toLocaleString("en-US", { weekday: "short" });
      const day = d.getDate();
      const mon = d.toLocaleString("en-US", { month: "short" });
      const iso = d.toISOString().slice(0, 10);
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "date"; btn.dataset.iso = iso; btn.dataset.dow = d.getDay();
      btn.innerHTML = `<span class="date__dow">${dow}${i===1?" · today":""}</span><span class="date__day">${day}</span><span class="date__mon">${mon}</span>`;
      btn.addEventListener("click", () => {
        $$(".date").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        state.date = iso; state.time = null;
        renderTimes(+btn.dataset.dow);
        next.disabled = !canAdvance();
      });
      dates.appendChild(btn);
      added++;
    }
    if (dates.firstChild) dates.firstChild.click();
  }
  function renderTimes(dow) {
    const times = $("#times"); times.innerHTML = "";
    const slots = dow === 6
      ? ["8:00am","9:00am","10:00am","11:00am","12:00pm","1:00pm","2:00pm"]
      : ["7:30am","8:30am","9:30am","10:30am","11:30am","12:30pm","1:30pm","2:30pm","3:30pm"];
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

  ["#firstName","#lastName","#phone","#email"].forEach(sel => {
    const el = $(sel); if (el) el.addEventListener("input", () => { next.disabled = !canAdvance(); });
  });
  $("#vacc").addEventListener("change", () => { next.disabled = !canAdvance(); });
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
  function calcEstimate() {
    if (!state.service) return 0;
    const isBoarding = state.service.name === "Boarding";
    if (isBoarding) return state.service.base; // per night, baseline
    state.pet.size = +($("#petSize").value || 0);
    state.pet.coat = +($("#coat").value || 0);
    return state.service.base + state.pet.size + state.pet.coat;
  }
  function renderSummary() {
    state.pet = {
      name: $("#petName").value.trim(),
      type: $("#petType").value,
      breed: $("#petBreed").value.trim(),
      size: +($("#petSize").value || 0),
      age: $("#petAge").value,
      coat: +($("#coat").value || 0),
      anxious: $("#anxious").value.trim(),
    };
    const isBoarding = state.service?.name === "Boarding";
    const estimate = calcEstimate();
    const dep = state.deposit ? (isBoarding ? 25 : 15) : 0;
    $("#summary").innerHTML = `
      <h3>Booking summary</h3>
      <dl>
        <div><dt>Service</dt><dd>${state.service?.name || "—"}</dd></div>
        <div><dt>Pet</dt><dd>${state.pet.name} · ${state.pet.type} · ${state.pet.breed}</dd></div>
        <div><dt>Drop-off</dt><dd>${state.date ? fmtDate(state.date) : "—"}, ${state.time || "—"}</dd></div>
        <div><dt>Estimate</dt><dd>${isBoarding ? "$" + estimate + "/night" : "$" + estimate}</dd></div>
        ${state.deposit ? `<div><dt>Deposit (today)</dt><dd>$${dep}</dd></div>` : ""}
        <div class="summary__total"><dt>${state.deposit ? "Charged today" : "Due at pickup"}</dt><dd>$${state.deposit ? dep : estimate}${isBoarding && !state.deposit ? "/night" : ""}</dd></div>
      </dl>
      <p style="color:var(--ink-2);font-size:.85rem;margin-top:.8rem">Final price confirmed at drop-off after a quick coat assessment.</p>
    `;
  }

  function reserve() {
    state.pet = {
      name: $("#petName").value.trim(),
      type: $("#petType").value,
      breed: $("#petBreed").value.trim(),
      size: +($("#petSize").value || 0),
      age: $("#petAge").value,
      coat: +($("#coat").value || 0),
      anxious: $("#anxious").value.trim(),
    };
    const estimate = calcEstimate();
    const payload = {
      ...state,
      estimate,
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      phone: $("#phone").value.trim(),
      email: $("#email").value.trim(),
      vacc: $("#vacc").value,
      notes: $("#notes").value.trim(),
    };
    sessionStorage.setItem("daphnes_booking", JSON.stringify(payload));
    window.location.href = state.deposit ? "checkout.html" : "confirmation.html";
  }

  show();
})();

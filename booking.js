/* Amanda Rachael Photography — booking flow (simulated) */
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  const state = {
    step: 1,
    service: null,
    date: null,
    time: null,
  };

  // pre-select package from URL
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get("pkg");
  if (wanted) {
    setTimeout(() => {
      const btn = $$("#services .opt").find(b => b.dataset.svc.toLowerCase().replace(/\s+/g, "+") === wanted.toLowerCase());
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
    next.textContent = state.step === 4 ? "Pay retainer →" : "Continue →";
    next.disabled = !canAdvance();
    if (state.step === 2) renderDateTime();
    if (state.step === 4) renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function canAdvance() {
    switch (state.step) {
      case 1: return !!state.service;
      case 2: return !!state.date && !!state.time;
      case 3: {
        const fn = $("#firstName").value.trim();
        const ln = $("#lastName").value.trim();
        const ph = $("#phone").value.trim();
        const em = $("#email").value.trim();
        return fn && ln && ph.replace(/\D/g,"").length >= 10 && /\S+@\S+\.\S+/.test(em);
      }
      case 4: return true;
    }
  }

  next.addEventListener("click", () => {
    if (!canAdvance()) return;
    if (state.step === 4) return reserve();
    state.step++;
    show();
  });
  prev.addEventListener("click", () => { if (state.step > 1) { state.step--; show(); } });

  // step 1
  $$("#services .opt").forEach(btn => btn.addEventListener("click", () => {
    $$("#services .opt").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    state.service = {
      name: btn.dataset.svc,
      price: +btn.dataset.price,
      deposit: +btn.dataset.dep,
      time: +btn.dataset.time,
    };
    next.disabled = !canAdvance();
  }));

  // step 2
  function renderDateTime() {
    const dates = $("#dates");
    if (dates.children.length) return;
    const today = new Date();
    let added = 0; let i = 0;
    while (added < 14 && i < 60) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      i++;
      // skip Sunday (0) and Monday (1) — closed
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
    const slots = ["10:00am","11:00am","12:00pm","1:00pm","2:00pm","3:00pm"];
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

  // step 3
  ["#firstName","#lastName","#phone","#email"].forEach(sel => {
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

  // step 4
  function fmtDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  function renderSummary() {
    const s = state;
    const total = s.service?.price || 0;
    const dep = s.service?.deposit || 0;
    const balance = total - dep;
    $("#summary").innerHTML = `
      <h3>Session summary</h3>
      <dl>
        <div><dt>Session</dt><dd>${s.service?.name || "—"}</dd></div>
        <div><dt>Date</dt><dd>${s.date ? fmtDate(s.date) : "—"}</dd></div>
        <div><dt>Time</dt><dd>${s.time || "—"}</dd></div>
        <div><dt>Where</dt><dd>1913 Huguenot Rd, Suite 100<br>North Chesterfield, VA</dd></div>
        <div><dt>Session total</dt><dd>$${total}</dd></div>
        <div><dt>Retainer (today)</dt><dd>−$${dep}</dd></div>
        <div><dt>Balance day-of</dt><dd>$${balance}</dd></div>
        <div class="summary__total"><dt>Charged today</dt><dd>$${dep}</dd></div>
      </dl>
    `;
  }

  function reserve() {
    const s = state;
    const payload = {
      ...s,
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      phone: $("#phone").value.trim(),
      email: $("#email").value.trim(),
      due: $("#due").value.trim(),
      notes: $("#notes").value.trim(),
    };
    sessionStorage.setItem("amanda_booking", JSON.stringify(payload));
    window.location.href = "checkout.html";
  }

  show();
})();

function renderLeyes() {
  const root = document.getElementById("ledger-leyes");
  root.innerHTML = LEYES_UX.map(entryLeyHTML).join("");
  attachImageFallbacks(root);
  updateCount("leyes", LEYES_UX.filter(e => e.estado !== "pendiente").length, LEYES_UX.length);
  updateSummary();
}

function entryLeyHTML(item) {
  const estadoClass = `entry--${item.estado}`;
  const stampText = { cumple: "Cumple", rompe: "Rompe", pendiente: "Pendiente" }[item.estado];
  const val = item.explicacion?.trim() ? escapeHTML(item.explicacion) : "";
  const ph = item.explicacion?.trim() ? "" : "Escribí tu evaluación acá...";

  return `
    <article id="entry-${item.id}" class="entry ${estadoClass}" data-estado="${item.estado}">
      <div class="entry__left">
        <span class="entry__index">LEY ${String(item.numero).padStart(2, "0")} / 14</span>
        <h3 class="entry__name">${escapeHTML(item.nombre)}</h3>
        <p class="entry__def">${escapeHTML(item.definicion)}</p>
        <p class="entry__question">${escapeHTML(item.preguntaGuia)}</p>
        <span class="stamp">${stampText}</span>
      </div>
      <div class="entry__right">
        <div class="entry__right__body">
          ${shotHTML(item)}
          ${explanationWithLabel(item, val, ph)}
        </div>
      </div>
    </article>
  `;
}

function renderHeuristicas() {
  const root = document.getElementById("ledger-heuristicas");
  root.innerHTML = HEURISTICAS_NIELSEN.map(entryHeuristicaHTML).join("");
  attachImageFallbacks(root);
  updateCount("heuristicas", HEURISTICAS_NIELSEN.filter(e => e.severidad !== null).length, HEURISTICAS_NIELSEN.length);
  updateSummary("heuristicas");
}

function severityClass(sev) {
  if (sev === null || sev === undefined) return "entry--sev-null";
  if (sev <= 1) return "entry--sev-low";
  if (sev === 2) return "entry--sev-mid";
  return "entry--sev-high";
}

const SEVERITY_LABELS = ["No es un problema", "Cosmético", "Menor", "Mayor", "Catástrofe"];

function heuristicaEstado(item) {
  if (item.severidad === null || item.severidad === undefined) return "pendiente";
  if (item.severidad <= 1) return "cumple";
  if (item.severidad >= 3) return "rompe";
  return "pendiente";
}

function entryHeuristicaHTML(item) {
  const sev = item.severidad;
  const sevClass = severityClass(sev);
  const stampText = sev === null || sev === undefined ? "Sin evaluar" : `SEV ${sev}`;
  const label = sev === null || sev === undefined ? "Pendiente de evaluación" : SEVERITY_LABELS[sev];
  const val = item.explicacion?.trim() ? escapeHTML(item.explicacion) : "";
  const ph = item.explicacion?.trim() ? "" : "Escribí tu evaluación acá...";
  const estado = heuristicaEstado(item);

  const dial = `
    <div class="severity-dial">
      ${[0, 1, 2, 3, 4].map(n => {
        const isActive = n === sev;
        let chipStyle = "";
        if (isActive) {
          const sevColors = ["var(--calm)", "var(--calm)", "var(--warn)", "var(--alarm)", "var(--alarm)"];
          const c = sevColors[sev];
          chipStyle = `background:${c};border-color:${c};color:#fff;`;
        }
        return `<span class="severity-dial__chip ${isActive ? "is-active" : ""}" style="${chipStyle}">${n}</span>`;
      }).join("")}
      <span class="severity-dial__label">${label}</span>
    </div>
  `;

  return `
    <article id="entry-${item.id}" class="entry ${sevClass}" data-estado="${estado}">
      <div class="entry__left">
        <span class="entry__index">HEURÍSTICA ${String(item.numero).padStart(2, "0")} / 10</span>
        <h3 class="entry__name">${escapeHTML(item.nombre)}</h3>
        <p class="entry__def">${escapeHTML(item.definicion)}</p>
        ${dial}
      </div>
      <div class="entry__right">
        <span class="stamp">${stampText}</span>
        <div class="entry__right__body">          ${shotHTML(item)}
          ${explanationWithLabel(item, val, ph)}
        </div>
      </div>
    </article>
  `;
}
function screenName(imagen) {
  return imagen.replace(/^screenshots\//i, "").replace(/\.png$/i, "").replace(/\.jpg$/i, "");
}

function shotHTML(item) {
  return `
    <div class="entry__shot" data-fallback-id="${item.id}">
      <img src="${item.imagen}" alt="Captura de evidencia — ${escapeHTML(item.nombre)}" loading="lazy">
      <div class="entry__shot-placeholder" hidden>
        <strong>Falta la captura</strong>
        Guardá el screenshot como<br><code>${item.imagen}</code>
      </div>
    </div>
  `;
}

function explanationWithLabel(item, val, ph) {
  const label = screenName(item.imagen);
  return `
        <div class="entry__explanation-wrap">
          <span class="entry__shot-label">${escapeHTML(label)}</span>
          <textarea class="entry__explanation" placeholder="${ph}">${val}</textarea>
        </div>
  `;
}

function attachImageFallbacks(root) {
  root.querySelectorAll(".entry__shot").forEach(shot => {
    const img = shot.querySelector("img");
    const placeholder = shot.querySelector(".entry__shot-placeholder");
    img.addEventListener("error", () => {
      img.hidden = true;
      placeholder.hidden = false;
    });
  });
}

function updateCount(tab, done, total) {
  const el = document.getElementById(`count-${tab}`);
  if (el) el.textContent = `${done}/${total}`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

let currentTab = "leyes";

function setupTabs() {
  const buttons = document.querySelectorAll(".tabs__btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      currentTab = target;
      buttons.forEach(b => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll(".panel").forEach(p => {
        p.classList.toggle("is-active", p.id === `panel-${target}`);
      });
      const summaryBar = document.getElementById("summary-leyes");
      summaryBar.classList.toggle("is-visible", target === "leyes");
      if (target === "leyes") {
        updateSummary();
        resetFilter();
      }
    });
  });
}

function updateSummary() {
  let cumple = 0, rompe = 0;
  LEYES_UX.forEach(item => {
    if (item.estado === "cumple") cumple++;
    else if (item.estado === "rompe") rompe++;
  });
  document.getElementById("sum-cumple").textContent = cumple;
  document.getElementById("sum-rompe").textContent = rompe;
}

function setupSummaryFilters() {
  const btns = document.querySelectorAll(".summary__btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter();
    });
  });
}

function resetFilter() {
  document.querySelectorAll(".summary__btn").forEach(b => b.classList.remove("is-active"));
  document.querySelector(".summary__btn--all").classList.add("is-active");
  applyFilter();
}

function applyFilter() {
  const activeBtn = document.querySelector(".summary__btn.is-active");
  const filter = activeBtn ? activeBtn.dataset.filter : "todos";
  const panel = document.getElementById("panel-leyes");
  if (!panel) return;

  panel.querySelectorAll(".entry").forEach(entry => {
    if (filter === "todos") {
      entry.style.display = "";
    } else {
      entry.style.display = entry.dataset.estado === filter ? "" : "none";
    }
  });
}

function renderIndex(navId, data) {
  const nav = document.getElementById(navId);
  nav.innerHTML = data.map(item => {
    const label = item.numero + ". " + item.nombre;
    return `<a class="index__link" data-target="entry-${item.id}">${escapeHTML(label)}</a>`;
  }).join("");

  nav.querySelectorAll(".index__link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.classList.add("entry--flash");
        target.addEventListener("animationend", () => target.classList.remove("entry--flash"), { once: true });
      }
    });
  });
}

function setupIndexScroll(navId, ledgerId) {
  const nav = document.getElementById(navId);
  const links = nav.querySelectorAll(".index__link");
  const entries = document.querySelectorAll(`#${ledgerId} .entry`);

  const observer = new IntersectionObserver((observed) => {
    observed.forEach(o => {
      if (o.isIntersecting) {
        links.forEach(l => l.classList.remove("is-active"));
        const id = o.target.id;
        const activeLink = nav.querySelector(`[data-target="${id}"]`);
        if (activeLink) activeLink.classList.add("is-active");
      }
    });
  }, { rootMargin: "-20% 0px -60% 0px" });

  entries.forEach(entry => observer.observe(entry));
}

function autoResizeTextareas() {
  document.querySelectorAll(".entry__explanation").forEach(ta => {
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + 12 + "px";
    ta.addEventListener("input", () => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + 12 + "px";
    });
  });
}

renderLeyes();
renderHeuristicas();
setupTabs();
setupSummaryFilters();
autoResizeTextareas();
document.getElementById("summary-leyes").classList.add("is-visible");
renderIndex("index-leyes", LEYES_UX);
renderIndex("index-heuristicas", HEURISTICAS_NIELSEN);
setupIndexScroll("index-leyes", "ledger-leyes");
setupIndexScroll("index-heuristicas", "ledger-heuristicas");

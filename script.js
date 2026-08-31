// ============================================================
// RENDER — Tablero 1: Leyes UX
// ============================================================
function renderLeyes() {
  const root = document.getElementById("ledger-leyes");
  root.innerHTML = LEYES_UX.map(entryLeyHTML).join("");
  attachImageFallbacks(root);
  updateCount("leyes", LEYES_UX.filter(e => e.estado !== "pendiente").length, LEYES_UX.length);
}

function entryLeyHTML(item) {
  const estadoClass = `entry--${item.estado}`;
  const stampText = { cumple: "Cumple", rompe: "Rompe", pendiente: "Pendiente" }[item.estado];
  const explanation = item.explicacion?.trim()
    ? `<p class="entry__explanation">${escapeHTML(item.explicacion)}</p>`
    : `<p class="entry__explanation is-empty">Todavía sin análisis — completá el campo "explicacion" en data.js.</p>`;

  return `
    <article class="entry ${estadoClass}">
      <div class="entry__left">
        <span class="entry__index">LEY ${String(item.numero).padStart(2, "0")} / 14</span>
        <h3 class="entry__name">${escapeHTML(item.nombre)}</h3>
        <p class="entry__def">${escapeHTML(item.definicion)}</p>
        <p class="entry__question">${escapeHTML(item.preguntaGuia)}</p>
      </div>
      <div class="entry__right">
        <span class="stamp">${stampText}</span>
        ${shotHTML(item)}
        ${explanation}
      </div>
    </article>
  `;
}

// ============================================================
// RENDER — Tablero 2: Heurísticas de Nielsen
// ============================================================
function renderHeuristicas() {
  const root = document.getElementById("ledger-heuristicas");
  root.innerHTML = HEURISTICAS_NIELSEN.map(entryHeuristicaHTML).join("");
  attachImageFallbacks(root);
  updateCount("heuristicas", HEURISTICAS_NIELSEN.filter(e => e.severidad !== null).length, HEURISTICAS_NIELSEN.length);
}

function severityClass(sev) {
  if (sev === null || sev === undefined) return "entry--sev-null";
  if (sev <= 1) return "entry--sev-low";
  if (sev === 2) return "entry--sev-mid";
  return "entry--sev-high";
}

const SEVERITY_LABELS = ["No es un problema", "Cosmético", "Menor", "Mayor", "Catástrofe"];

function entryHeuristicaHTML(item) {
  const sev = item.severidad;
  const sevClass = severityClass(sev);
  const stampText = sev === null || sev === undefined ? "Sin evaluar" : `SEV ${sev}`;
  const label = sev === null || sev === undefined ? "Pendiente de evaluación" : SEVERITY_LABELS[sev];
  const explanation = item.explicacion?.trim()
    ? `<p class="entry__explanation">${escapeHTML(item.explicacion)}</p>`
    : `<p class="entry__explanation is-empty">Todavía sin análisis — completá el campo "explicacion" en data.js.</p>`;

  const dial = `
    <div class="severity-dial">
      ${[0, 1, 2, 3, 4].map(n => `<span class="severity-dial__chip ${n === sev ? "is-active" : ""}" style="${n === sev ? `background:currentColor;border-color:currentColor;` : ""}">${n}</span>`).join("")}
      <span class="severity-dial__label">${label}</span>
    </div>
  `;

  return `
    <article class="entry ${sevClass}">
      <div class="entry__left">
        <span class="entry__index">HEURÍSTICA ${String(item.numero).padStart(2, "0")} / 10</span>
        <h3 class="entry__name">${escapeHTML(item.nombre)}</h3>
        <p class="entry__def">${escapeHTML(item.definicion)}</p>
        ${dial}
      </div>
      <div class="entry__right">
        <span class="stamp">${stampText}</span>
        ${shotHTML(item)}
        ${explanation}
      </div>
    </article>
  `;
}

// ============================================================
// SHARED HELPERS
// ============================================================
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

// ============================================================
// TABS
// ============================================================
function setupTabs() {
  const buttons = document.querySelectorAll(".tabs__btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll(".panel").forEach(p => {
        p.classList.toggle("is-active", p.id === `panel-${target}`);
      });
    });
  });
}

// ============================================================
// INIT
// ============================================================
renderLeyes();
renderHeuristicas();
setupTabs();

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

/* ---- Download PDF ---- */
function buildPDFContent() {
  // Read live data from the original DOM
  const allEntries = LEYES_UX.concat(HEURISTICAS_NIELSEN);
  const entriesByID = {};
  allEntries.forEach(e => entriesByID[e.id] = e);

  // Read current textarea values from the live DOM
  document.querySelectorAll(".entry__explanation").forEach(ta => {
    const id = ta.closest(".entry")?.id?.replace("entry-", "");
    if (id && entriesByID[id]) {
      entriesByID[id]._liveText = ta.value;
    }
  });

  let html = `<div style="font-family:'IBM Plex Sans',sans-serif;color:#201E1A;max-width:900px;margin:0 auto;padding:20px;">
    <div style="border-bottom:3px solid #201E1A;padding-bottom:16px;margin-bottom:24px;">
      <span style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B564D;border:1px solid #B9B2A0;padding:3px 8px;border-radius:3px;">EXPEDIENTE DE EVALUACIÓN</span>
      <h1 style="font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:32px;line-height:0.92;margin:8px 0 0;text-transform:uppercase;">Auditoría UX — Mi Argentina</h1>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#5B564D;margin-top:8px;">Producto evaluado: App "Mi Argentina" (iOS / Android) &nbsp;|&nbsp; Método: Checklist de 14 leyes UX + heurísticas de Nielsen</div>
    </div>`;

  // ---- Board 1: Leyes UX ----
  html += `<h2 style="font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:22px;text-transform:uppercase;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid #B23E28;">Tablero 1 — Leyes UX</h2>`;

  LEYES_UX.forEach(item => {
    const stampColor = item.estado === "cumple" ? "#2F6F5E" : item.estado === "rompe" ? "#B23E28" : "#8B8578";
    const stampText = { cumple: "Cumple", rompe: "Rompe", pendiente: "Pendiente" }[item.estado];
    const explanation = entriesByID[item.id]?._liveText || item.explicacion || "";
    const imgSrc = item.imagen;

    html += `
      <div style="border:1px solid #D6D0C1;border-radius:3px;padding:16px;margin-bottom:12px;background:#F8F6F1;page-break-inside:avoid;">
        <span style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#5B564D;">LEY ${String(item.numero).padStart(2, "0")} / 14</span>
        <h3 style="font-family:'Big Shoulders Display',sans-serif;font-weight:700;font-size:20px;margin:4px 0 6px;text-transform:uppercase;">${escapeHTML(item.nombre)}</h3>
        <p style="font-size:13px;color:#5B564D;margin:0 0 6px;">${escapeHTML(item.definicion)}</p>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#201E1A;background:#F8F6F1;border:1px dashed #B9B2A0;padding:6px 10px;border-radius:3px;margin:0 0 10px;">PREGUNTA GUÍA — ${escapeHTML(item.preguntaGuia)}</div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="flex:0 0 200px;">
            <div style="border:1px solid #B9B2A0;border-radius:3px;overflow:hidden;min-height:120px;background:#F8F6F1;">
              <img src="${imgSrc}" style="width:100%;height:auto;display:block;" alt="Captura">
            </div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#5B564D;border:1px solid #B9B2A0;padding:2px 6px;border-radius:3px;margin-top:4px;display:inline-block;">${escapeHTML(screenName(item.imagen))}</div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:14px;line-height:1.6;padding:8px 12px;border-left:3.5px solid #B9B2A0;background:#F8F6F1;border-radius:3px;white-space:pre-wrap;">${escapeHTML(explanation)}</div>
          </div>
        </div>
        <div style="text-align:center;font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:16px;letter-spacing:0.08em;text-transform:uppercase;padding:6px 14px;border:2.5px solid ${stampColor};border-radius:3px;color:${stampColor};margin-top:10px;display:inline-block;">${stampText}</div>
      </div>`;
  });

  // ---- Board 2: Heurísticas de Nielsen ----
  html += `<div style="page-break-before:always;"></div>`;
  html += `<h2 style="font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:22px;text-transform:uppercase;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid #B5822A;">Tablero 2 — Heurísticas de Nielsen</h2>`;

  HEURISTICAS_NIELSEN.forEach(item => {
    const sev = item.severidad;
    const sevColor = sev === null ? "#8B8578" : sev <= 1 ? "#2F6F5E" : sev === 2 ? "#B5822A" : "#B23E28";
    const sevText = sev === null ? "Sin evaluar" : `SEV ${sev}`;
    const sevLabel = sev === null ? "Pendiente" : ["No es un problema","Cosmético","Menor","Mayor","Catástrofe"][sev];
    const explanation = entriesByID[item.id]?._liveText || item.explicacion || "";
    const imgSrc = item.imagen;

    html += `
      <div style="border:1px solid #D6D0C1;border-radius:3px;padding:16px;margin-bottom:12px;background:#F8F6F1;page-break-inside:avoid;">
        <span style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#5B564D;">HEURÍSTICA ${String(item.numero).padStart(2, "0")} / 10</span>
        <h3 style="font-family:'Big Shoulders Display',sans-serif;font-weight:700;font-size:20px;margin:4px 0 6px;text-transform:uppercase;">${escapeHTML(item.nombre)}</h3>
        <p style="font-size:13px;color:#5B564D;margin:0 0 8px;">${escapeHTML(item.definicion)}</p>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;margin:0 0 10px;display:flex;align-items:center;gap:6px;">
          ${[0,1,2,3,4].map(n => {
            const isActive = n === sev;
            const bg = isActive ? sevColor : "#F8F6F1";
            const bc = isActive ? sevColor : "#B9B2A0";
            const tc = isActive ? "#fff" : "#5B564D";
            return `<span style="width:24px;height:24px;border-radius:50%;border:1.5px solid ${bc};background:${bg};color:${tc};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;">${n}</span>`;
          }).join("")}
          <span style="margin-left:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#5B564D;">${sevLabel}</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="flex:0 0 200px;">
            <div style="border:1px solid #B9B2A0;border-radius:3px;overflow:hidden;min-height:120px;background:#F8F6F1;">
              <img src="${imgSrc}" style="width:100%;height:auto;display:block;" alt="Captura">
            </div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#5B564D;border:1px solid #B9B2A0;padding:2px 6px;border-radius:3px;margin-top:4px;display:inline-block;">${escapeHTML(screenName(item.imagen))}</div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="text-align:center;font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;padding:4px 12px;border:2px solid ${sevColor};border-radius:3px;color:${sevColor};margin-bottom:8px;display:inline-block;">${sevText}</div>
            <div style="font-size:14px;line-height:1.6;padding:8px 12px;border-left:3.5px solid #B9B2A0;background:#F8F6F1;border-radius:3px;white-space:pre-wrap;">${escapeHTML(explanation)}</div>
          </div>
        </div>
      </div>`;
  });

  html += `</div>`;
  return html;
}

function descargarPDF() {
  const btn = document.querySelector(".download-pdf");
  btn.disabled = true;
  btn.textContent = "Generando PDF...";

  const content = buildPDFContent();

  const printCSS = `
    @page { margin: 12mm; size: A4; }
    @media print {
      body { margin: 0; padding: 0; background: #fff; }
      img { page-break-inside: avoid; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'IBM Plex Sans', Arial, Helvetica, sans-serif; background: #fff; }
  `;

  const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Auditoria UX - Mi Argentina</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>${printCSS}</style>
</head>
<body>
  ${content}
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;border:none;";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(fullHTML);
  doc.close();

  // Wait for fonts and images to load, then print
  function waitForLoad() {
    const images = Array.from(doc.querySelectorAll("img"));
    const allLoaded = images.every(img => img.complete);
    const fontsReady = iframe.contentDocument.fonts ? iframe.contentDocument.fonts.ready : Promise.resolve();

    Promise.all([fontsReady, ...images.map(img => new Promise(resolve => {
      if (img.complete) return resolve();
      img.onload = resolve;
      img.onerror = resolve;
    }))]).then(() => {
      setTimeout(() => {
        try {
          iframe.contentWindow.print();
        } catch(e) {
          console.error("Print error:", e);
        }
        btn.disabled = false;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Descargar PDF`;
        setTimeout(() => iframe.remove(), 2000);
      }, 800);
    });
  }

  // Start loading check after a short delay to let the iframe render
  setTimeout(waitForLoad, 300);
}

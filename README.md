# Auditoría UX — Mi Argentina

Mini-web estática con dos tableros navegables:

- **Tablero 1 — Leyes UX**: checklist de las 14 leyes, cobertura mínima sugerida 8/14.
- **Tablero 2 — Heurísticas de Nielsen**: las 10 heurísticas completas, con severidad 0-4.

No tiene backend ni build step: es HTML + CSS + JS plano, así que se puede abrir directo en el navegador o subir a Vercel sin configuración.

## Estructura

```
index.html      → estructura de las dos pantallas (tabs + secciones)
styles.css      → estilos
script.js       → arma las tarjetas a partir de data.js, maneja los tabs
data.js         → ACÁ VA TODO EL CONTENIDO REAL (esto es lo único que tienen que tocar la mayoría de las veces)
screenshots/    → poné acá las capturas, con el nombre de archivo que ya está referenciado en data.js
```

## Cómo completar el análisis

1. Abrí `data.js`. Hay dos arrays: `LEYES_UX` (14 objetos) y `HEURISTICAS_NIELSEN` (10 objetos).
2. Por cada ley que analicen:
   - Cambien `estado` a `"cumple"` o `"rompe"` (si no la van a analizar, déjenla en `"pendiente"` — no hace falta llegar a las 14).
   - Guarden la captura en `/screenshots` con el nombre que dice el campo `imagen` (o cambien el nombre del archivo en `data.js` para que matchee).
   - Escriban 1-2 frases en `explicacion` respondiendo la pregunta guía.
3. Por cada una de las 10 heurísticas (van **todas**, sin excepción):
   - Cambien `severidad` a un número de `0` a `4` (0 = no es un problema, 4 = catástrofe).
   - Guarden la captura y completen `explicacion` con qué pasa, por qué, y qué impacto tiene en la persona usuaria.
4. Guardan el archivo y refrescan `index.html` en el navegador — no hay que compilar nada.

Mientras una fila no tenga captura subida, el tablero muestra automáticamente un aviso ("Falta la captura") en vez de romperse, así pueden ir viendo el tablero completo desde el día uno e ir llenándolo de a poco.

## Ver el tablero en local

Como es HTML/CSS/JS plano, alcanza con abrir `index.html` con doble clic, o con una extensión tipo "Live Server". No hace falta Node ni instalar nada.

## Deploy en Vercel

1. Subí esta carpeta a un repo de GitHub (público o compartido con la comisión).
2. En Vercel: **Add New → Project → Import Git Repository**, elegí el repo.
3. Framework preset: **Other** (o "Static"). No hace falta configurar build command ni output directory — Vercel sirve los archivos tal cual.
4. Deploy. El link que te da Vercel es el que van a entregar.

## Documento de prompts

Recuerden completar también `prompts_leyes_heuristicas` en el Drive del equipo con la herramienta de IA usada, el objetivo de cada prompt, el prompt completo y qué tuvieron que ajustar del resultado — no es parte de este repo.

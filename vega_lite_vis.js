// vega_lite_vis.js
// FIT2179 Data Visualisation 2 — The Olympic Legacy
// Sandy | Monash University, Semester 1, 2026
//
// Each Vega-Lite spec lives in its own .vg.json file inside js/.
// This file stores the path to each spec in a variable, then calls
// vegaEmbed() to embed each chart into its matching <div> in index.html.
// This script is loaded at the bottom of <body> so all <div> elements
// already exist in the DOM when vegaEmbed() runs.
//
// The proportional symbol map and bubble chart have toggle buttons that
// filter the data by season or continent. Because the specs load their
// data from external CSV files (via "url"), filtering is done by adding
// a Vega-Lite transform filter to a fetched copy of the spec, then
// re-embedding into the same <div> each time a button is clicked.

// ── Spec file paths ──────────────────────────────────────────────
var vis1  = "js/choropleth_map.vg.json";
var vis2  = "js/proportional_symbol_map.vg.json";
var vis3  = "js/heatmap.vg.json";
var vis4  = "js/growth_line.vg.json";
var vis5  = "js/stacked_bar.vg.json";
var vis6  = "js/dumbbell_chart.vg.json";
var vis7  = "js/bubble_chart.vg.json";
var vis8  = "js/aus_area.vg.json";
var vis9  = "js/aus_rank.vg.json";
var vis10 = "js/diverging_bar.vg.json";
var vis11 = "js/lollipop_chart.vg.json";
var vis12 = "js/donut_chart.vg.json";

// ── Embed options ────────────────────────────────────────────────
var embedOpt = { "actions": false };

// ── View references for the two interactive charts ───────────────
// These are set when the charts first render and are used to
// cleanly destroy the old chart before re-rendering on toggle.
var hostMapView = null;
var bubbleView  = null;

// ── VIS 1 — Choropleth World Map ─────────────────────────────────
// Data: medals_data.csv | Idiom: Choropleth (geoshape, log colour)
vegaEmbed("#vis-choropleth", vis1, embedOpt).catch(console.warn);

// ── VIS 2 — Proportional Symbol Map ──────────────────────────────
// Data: host_data.csv | Idiom: Proportional symbol map (circle marks)
// Initial render shows all games (no season filter).
// The view is stored in hostMapView so filterHostMap() can finalize it.
vegaEmbed("#vis-host-map", vis2, embedOpt)
  .then(function(result) { hostMapView = result.view; })
  .catch(console.warn);

// ── VIS 3 — Heatmap ──────────────────────────────────────────────
// Data: host_data.csv | Idiom: Heatmap (rect marks, continent × decade)
vegaEmbed("#vis-heatmap", vis3, embedOpt).catch(console.warn);

// ── VIS 4 — Growth Line Chart (dual-axis, custom-built) ──────────
// Data: history_data.csv | Idiom: Dual-axis line + area
vegaEmbed("#vis-growth", vis4, embedOpt).catch(console.warn);

// ── VIS 5 — Stacked Bar Chart ────────────────────────────────────
// Data: medals_data.csv | Idiom: Stacked bar (gold/silver/bronze)
vegaEmbed("#vis-stacked", vis5, embedOpt).catch(console.warn);

// ── VIS 6 — Dumbbell Chart (custom-built) ────────────────────────
// Data: medals_data.csv | Idiom: Dumbbell (rule + 2× point layers)
vegaEmbed("#vis-dumbbell", vis6, embedOpt).catch(console.warn);

// ── VIS 7 — Bubble Chart ─────────────────────────────────────────
// Data: medals_data.csv | Idiom: Bubble (circle, 4 channels: x/y/size/hue)
// Initial render shows all continents (no continent filter).
// The view is stored in bubbleView so filterBubble() can finalize it.
vegaEmbed("#vis-bubble", vis7, embedOpt)
  .then(function(result) { bubbleView = result.view; })
  .catch(console.warn);

// ── VIS 8 — Australia Stacked Area ───────────────────────────────
// Data: aus_perf.csv | Idiom: Stacked area (medal type colour)
vegaEmbed("#vis-aus-area", vis8, embedOpt).catch(console.warn);

// ── VIS 9 — Australia Rank + Medals (custom-built dual axis) ─────
// Data: aus_perf.csv | Idiom: Dual-axis line (medals left, rank right)
vegaEmbed("#vis-aus-rank", vis9, embedOpt).catch(console.warn);

// ── VIS 10 — Diverging Bar Chart (custom-built) ───────────────────
// Data: aus_perf.csv | Idiom: Diverging bar (joinaggregate transform)
vegaEmbed("#vis-diverging", vis10, embedOpt).catch(console.warn);

// ── VIS 11 — Lollipop Chart (custom-built) ───────────────────────
// Data: aus_sport.csv | Idiom: Lollipop (rule + large dot + gold dot)
vegaEmbed("#vis-lollipop", vis11, embedOpt).catch(console.warn);

// ── VIS 12 — Donut Chart ─────────────────────────────────────────
// Data: aus_sport.csv | Idiom: Donut (arc marks, theta = medal count)
vegaEmbed("#vis-donut", vis12, embedOpt).catch(console.warn);


// ════════════════════════════════════════════════════════════════
// TOGGLE FUNCTIONS
// ════════════════════════════════════════════════════════════════

// ── filterHostMap ─────────────────────────────────────────────────
// Called by the All Games / Summer Only / Winter Only buttons above
// the proportional symbol map.
//
// Because the spec loads its data from an external CSV via a "url",
// we fetch the spec JSON, inject a Vega-Lite filter transform into
// the circle layer (layer[1]) when a specific season is selected,
// finalize the existing view, then re-embed.
//
// When season === 'all' no filter transform is added, so all rows
// in host_data.csv are shown exactly as in the original spec.

function filterHostMap(season) {

  // ── 1. Update active button styling ──────────────────────────
  document.getElementById('btn-all').classList.remove('active');
  document.getElementById('btn-summer').classList.remove('active');
  document.getElementById('btn-winter').classList.remove('active');
  if (season === 'all')        { document.getElementById('btn-all').classList.add('active'); }
  else if (season === 'Summer'){ document.getElementById('btn-summer').classList.add('active'); }
  else                         { document.getElementById('btn-winter').classList.add('active'); }

  // ── 2. Fetch the spec JSON, modify it, then re-embed ─────────
  fetch(vis2)
    .then(function(response) { return response.json(); })
    .then(function(spec) {

      // If a specific season is selected, prepend a filter transform
      // to layer[1] (the circle layer that plots the host cities).
      // layer[0] is the world base map — it must not be touched.
      if (season !== 'all') {
        var existingTransforms = spec.layer[1].transform || [];
        spec.layer[1].transform = [
          { "filter": "datum.season === '" + season + "'" }
        ].concat(existingTransforms);
      }
      // If season === 'all', use the spec unchanged so all rows appear.

      // ── 3. Finalize existing view, then re-embed ──────────────
      if (hostMapView) { hostMapView.finalize(); }
      vegaEmbed('#vis-host-map', spec, embedOpt)
        .then(function(result) { hostMapView = result.view; })
        .catch(console.warn);
    })
    .catch(console.warn);
}


// ── filterBubble ──────────────────────────────────────────────────
// Called by the All Continents / Europe / Americas / Asia /
// Oceania / Africa buttons above the bubble chart.
//
// Same approach as filterHostMap: fetch the spec JSON, inject a
// filter transform when a specific continent is selected, finalize
// the existing view, then re-embed.
//
// When continent === 'all' no filter is added, so all rows in
// medals_data.csv are shown exactly as in the original spec.

function filterBubble(continent) {

  // ── 1. Update active button styling ──────────────────────────
  // The bubble chart toggle buttons do not have individual IDs, so
  // we select all toggle-btn elements inside the bubble card and
  // mark only the one that was clicked as active.
  var bubbleCard = document.getElementById('vis-bubble').closest('.vis-card');
  bubbleCard.querySelectorAll('.toggle-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  if (event && event.target) { event.target.classList.add('active'); }

  // ── 2. Fetch the spec JSON, modify it, then re-embed ─────────
  fetch(vis7)
    .then(function(response) { return response.json(); })
    .then(function(spec) {

      // If a specific continent is selected, prepend a filter
      // transform to the top-level transform array.
      if (continent !== 'all') {
        var existingTransforms = spec.transform || [];
        spec.transform = [
          { "filter": "datum.continent === '" + continent + "'" }
        ].concat(existingTransforms);
      }
      // If continent === 'all', use the spec unchanged.

      // ── 3. Finalize existing view, then re-embed ──────────────
      if (bubbleView) { bubbleView.finalize(); }
      vegaEmbed('#vis-bubble', spec, embedOpt)
        .then(function(result) { bubbleView = result.view; })
        .catch(console.warn);
    })
    .catch(console.warn);
}

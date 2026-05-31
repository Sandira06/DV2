# The World Olympics Legacy

A FIT2179 Data Visualisation 2 project exploring everything there is to know about world olympics from 1896 to 2024.

Author: Sandira Polketiyage
Date: 31 May 2026  
Unit: FIT2179 Data Visualisation 2, Monash University

## Overview

This single-page scrolling website presents 12 Vega-Lite visualisations and KPI summary cards:

1. Who owns the podium? - All-time medal leaders since 1896
2. Where the world gathers - Every olympic host city since 1896
3. Bigger, Bolder, Further - The growth of the summer olympic games
4. Australia's olympic journey - From federation to Paris - A nation that rises to the occasion

## Data Sources

- International Olympic Committee (IOC)
- Wikipedia-All-Time Medal Table

All data is real, publicly available, and has not been fabricated or estimated. Also all the 5 csv files can be accessed in `js/` folder.

## Technology

- Vega-Lite for all maps and charts
- HTML, CSS and JavaScript
- Each Vega-Lite chart is stored as a separate readable `.vg.json` file in `js/`
- Relative paths are used so the website can run on GitHub Pages

## Project Structure

```text
index.html                                Main webpage
style.css                                 Stylesheet
vega_lite_vis.js                          Vega-Lite embedding code
js/                                       12 Vega-Lite .vg.json specification files
js/                                       CSVs
DV2 Sketch                                Assignment Sketch
Domain, what, why, who, how explanation   Written form of max. 500 words
```

## Viewing

Serve the folder with a static web server and open `index.html`. A local server is recommended because some browsers block `file://` data loading.

## AI Acknowledgement

All grammar checking and Vega-Lite visualisations were developed with generative AI assistance. All data, design decisions, narrative and idioms creation are the author's own original work.

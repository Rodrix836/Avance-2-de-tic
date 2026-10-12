# Interactive Porter Five Forces Dashboard

A professional, reusable competitive analysis template. Customize one client file, open the dashboard and deliver the source. The included **NOVA DIGITAL / Digital Services** case is an illustrative demo.

**HTML · CSS · Vanilla JavaScript · No dependencies · Responsive · Offline compatible**

## Features

- Company cover with name, sector, country, date, optional logo and an Explore Analysis button.
- Interactive Five Forces map with intensity, description, Key Drivers and Strategic Impact.
- Executive Summary: overall pressure, strongest force, main risk, opportunity and strategic priority.
- Three to five concise Strategic Recommendations.
- System Dynamics: preserved interactive SVG feedback loops **R1 Innovation**, **B1 Capacity**, **B2 Competition**, with signs, delays, assumptions and connections to Porter.
- Export / Print Report: includes all five force details and all three cycles, regardless of the selected screen.
- Native keyboard controls, visible focus, selection states, live detail announcements and reduced-motion support.
- No backend, accounts, API keys, external fonts, packages or build step.

## Run locally

Download the repository using **Code → Download ZIP** and extract it. Open **`index.html`**, or open **`dist/index.html`** directly in a current browser. Both work through `file://`; no server, Node or npm is required.

The app makes no external runtime requests by default. Source links need internet when opened. For completely offline client deliveries, keep logos in `dist/assets/` instead of using remote image URLs.

## Quick Customization

```text
1. Open dist/config.js
2. Change company information
3. Update the Five Forces content
4. Change branding colors
5. Open index.html
```

Save a copy of the project per client. Edit only **`dist/config.js`** for normal personalization:

| Configuration | What to change |
| --- | --- |
| `company` | Name, industry, country, date, description and logo path |
| `branding` | Primary, secondary, background, surface, text and muted colors |
| `forces` | Titles, levels, short card text, descriptions, drivers and strategic impact |
| `executiveSummary` | Overall pressure, strongest force, main risk, opportunity and priority |
| `recommendations` | 3–5 objects with `title` and `description` |
| `dynamics` | Intro, intervention and each cycle's content and assumptions |
| `methodology` | Scope, client-specific caveats and source links |

Use plain text, not HTML. Keep JavaScript quotes and commas intact. Prefer short card titles and examples; put longer explanations in `description` and `drivers`. Intensity labels and the executive summary are editorial assessments, **not calculated scores**: update both when the case changes. The demo explicitly acknowledges a tie between rivalry and buyer power.

### Change colors

Use six-digit hex values in `branding`, for example:

```js
primaryColor: '#ee572b',
secondaryColor: '#176c59',
backgroundColor: '#f5f7f8',
surfaceColor: '#ffffff',
textColor: '#202428',
mutedColor: '#626970',
```

The app updates CSS variables and derives related tints. Text on the solid primary fill automatically switches between light and dark. Check contrast after changing other foreground/background combinations. Layout and generic interface labels live in `dist/styles.css` and `dist/index.html`; normal client data does not require edits there.

### Modify the Five Forces

Keep these keys unchanged; they connect map positions and related cycles:

| Key | Force |
| --- | --- |
| `rivalidad` | Competitive Rivalry |
| `entrantes` | Threat of New Entrants |
| `proveedores` | Supplier Power |
| `clientes` | Buyer Power |
| `sustitutos` | Threat of Substitutes |

Edit `level`, `description`, `drivers` and `impact`. `subtitle` and `example` are short map labels. `loop` points to `r1`, `b1` or `b2`; `connection` labels that button. `mechanism` and `relationship` populate the Porter-to-system table. All five forces remain available in the printed report.

### Add a logo

Place the image in `dist/assets/`, then set:

```js
logo: 'assets/client-logo.svg',
```

PNG and JPG work too. Paths are relative to `dist/index.html`. Leave `logo: ''` for company initials. A missing image also falls back to initials. The supplied `dist/favicon.svg` is a generic Porter icon; replace it only if a custom browser icon is part of the delivery.

### Customize System Dynamics

Keep `r1`, `b1` and `b2`. Each cycle supports 4 or 5 nodes; each node has exactly two short text lines. `signs[i]` describes the arrow from node `i` to the next node (wrapping at the end). Use `+` or the minus character `−`. `delays` contains zero-based edge indices. Update the `steps` text to match the diagram after editing a cycle.

- **R1 / reinforcing:** an even number of negative links (zero in the demo).
- **B1 and B2 / balancing:** an odd number of negative links (one in each demo cycle).
- `+` means same-direction change and `−` means opposite-direction change, all else equal. They do not mean good or bad. `∥` indicates delay.
- Loop polarity alone does not guarantee growth or stability. These are conceptual hypotheses, not a calibrated simulation.

The app validates the required force keys, basic cycle structure, polarity and recommendation count. It shows a configuration message when these checks fail. Syntax errors in `config.js` must be corrected in that file.

### Print or save as PDF

Click **Export / Print Report**, or use the browser's Print command. Choose **Save as PDF**, A4 and 100% scale. Disable browser-added headers and footers for a clean result; enable background graphics to retain the brand tints.

Navigation and interaction controls are hidden. Company information, executive summary, recommendations, methodology, relationship table, all five force analyses and all three SVG cycles remain. Printing does not change the selected force or cycle. Pagination can differ between browsers and with longer client content; review the preview before delivering.

## Project structure

```text
index.html                 Entry point / redirect
README.md                  Setup and customization guide
.gitignore                 Local/runtime exclusions
dist/
  index.html               Accessible interface and generic labels
  config.js                All client content and branding
  app.js                   Rendering, validation, navigation and SVG geometry
  styles.css               Tokens, responsive layouts and print styles
  favicon.svg              Generic Porter icon
  assets/                  Local client logos
```

## Client delivery checklist

1. Replace demo content and verify the company scope and sources.
2. Check each force, its intensity and its linked loop; check all three cycles.
3. Keep summary and recommendations consistent with the analysis.
4. Test the logo offline, keyboard navigation, desktop and a 390px mobile viewport.
5. Review Print Preview and save a PDF if included in the package.
6. Deliver the root `index.html`, `dist/` folder and README together, or zip them. No installation files are needed.

## Fiverr packaging

Suggested service: **I will create an interactive Porter Five Forces analysis for your business**.

- **Basic (~US$5):** one company, five forces, name, colors, responsive source code and browser printing. Keep scope clear: client-supplied information, concise customization and a limited revision scope.
- **Standard:** more detailed drivers, a tailored executive summary, 3–5 recommendations, logo and a reviewed PDF deliverable.
- **Premium:** customized System Dynamics (R1/B1/B2), causal assumptions, Porter-to-system mapping and deeper evidence-based research.

All three cycles are retained in this template. Packages describe service scope; the code has no paywall or feature locks.

## Validation

Checked in headless Microsoft Edge using direct local files: all force selections and related-loop links, three SVG cycles, keyboard activation, hash navigation/history, root redirect, print trigger, complete print content, unique SVG IDs, and no JavaScript exceptions or external runtime requests. All views were checked at 390, 768, 1280 and 1440px without page-level horizontal overflow. On mobile, diagrams and the relationship table have their own keyboard-focusable scrolling regions, with a text sequence for every loop.

A separate client fixture verified config-only replacement, a local logo, missing-logo fallback, five recommendations, escaped text and alternate branding. Recheck layout and contrast for each client's content; these checks are not a formal accessibility certification.

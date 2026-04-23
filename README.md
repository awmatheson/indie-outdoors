# Indie Outdoors

A directory, ownership map, and editorial publication tracking independent outdoor brands — who owns them, where they're made, and what drives the people behind them.

**Live site:** [awmatheson.github.io/indie-outdoors](https://awmatheson.github.io/indie-outdoors/)

---

## What it is

- **Directory** — 290+ outdoor companies with ownership status, manufacturing location, sustainability certifications, and B-Corp flags
- **Ownership Map** — D3 circle-pack visualization of who owns what across conglomerates, PE firms, co-ops, and independents
- **Stories** — Editorial pulled from Substack via RSS
- **Open data** — All company data lives in a plain CSV anyone can edit

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| UI | MUI v6 with a custom theme |
| Visualization | D3 v7 |
| Routing | React Router v6 (hash-free, SPA redirect via `public/404.html`) |
| Blog | Substack RSS via corsproxy.io + browser DOMParser |
| Hosting | GitHub Pages (deployed on push to `main`) |

---

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173/indie-outdoors/`.

```bash
npm run build   # type-check + production build → dist/
npm run preview # serve the dist/ build locally
```

---

## Project structure

```
src/
  components/      # Page components (Homepage, Directory, OwnershipMap, …)
  data/            # ownershipData.ts — conglomerate / PE / independent groups
  utils/
    companiesUtils.ts  # CSV fetch + deduplication
    substackUtils.ts   # RSS feed parsing
  theme.ts         # MUI theme, color palette, fonts

public/
  companies.csv    # The main dataset — edit this to add/update companies
  favicon.ico      # Light favicon
  favicon-dark.ico # Dark favicon (used in nav)
  404.html         # GitHub Pages SPA routing redirect

agents/
  research_agent.py   # Claude-powered company research script
  to_research.txt     # Batch input list
  README.md           # Agent usage docs
```

---

## Company data

All company data is in `public/companies.csv`. It's a plain CSV — no database, no API. The site fetches and parses it at runtime.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or update companies.

---

## Environment variables

Set these in a `.env.local` file for local development, or as GitHub Actions variables for production builds.

| Variable | Description |
|---|---|
| `VITE_SUBSTACK_PUBLICATION` | Substack subdomain (default: `indieoutdoors`) |
| `VITE_SUBSTACK_CUSTOM_DOMAIN` | Custom domain if not on substack.com |

---

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via `.github/workflows/deploy.yml`. The build runs `tsc -b && vite build` and uploads `dist/` as a Pages artifact.

---

## Research agent

`agents/research_agent.py` uses Claude to research companies and output rows in the `companies.csv` schema.

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# Research a single company
python agents/research_agent.py "Hyperlite Mountain Gear"

# Batch research
python agents/research_agent.py --batch agents/to_research.txt

# Clean up existing rows
python agents/research_agent.py --clean public/companies.csv
```

See `agents/README.md` for full documentation.

# Contributing to Indie Outdoors

Thanks for helping keep the directory accurate. The most valuable contributions are adding missing companies, correcting ownership data, and flagging acquisitions.

---

## Adding or editing a company

All company data lives in [`public/companies.csv`](public/companies.csv). It's a plain CSV file — no database, no special tools required.

### Option 1: Edit directly on GitHub (easiest)

1. Open [`public/companies.csv`](https://github.com/awmatheson/indie-outdoors/blob/main/public/companies.csv) on GitHub
2. Click the pencil icon (Edit this file)
3. Add a new row or edit an existing one
4. Click **Commit changes** → **Create a new branch** → **Open a pull request**
5. Add a short note about what you changed and why (include a source link if you have one)

### Option 2: Clone and edit locally

```bash
git clone https://github.com/awmatheson/indie-outdoors.git
cd indie-outdoors

# Edit the CSV
open public/companies.csv   # or use any editor / Excel / Numbers / Google Sheets

git checkout -b my-company-addition
git add public/companies.csv
git commit -m "Add Hyperlite Mountain Gear"
git push origin my-company-addition
# Then open a PR on GitHub
```

### Option 3: Use the research agent

If you have an `ANTHROPIC_API_KEY`, the research agent can draft a CSV row for you:

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
python agents/research_agent.py "Company Name"
```

It prints a formatted summary and a CSV line ready to paste. Always review the output before committing — the agent is accurate but not infallible.

---

## CSV field reference

| Field | Required | Description |
|---|---|---|
| `Company` | Yes | Official company name |
| `Business Category` | Yes | `Apparel` / `Equipment` / `Footwear` / `Accessories` / `Retailer` |
| `Main Sport Focus` | Yes | Comma-separated sports (e.g. `Hiking, Camping, Climbing`) |
| `Year Founded` | Yes | 4-digit year |
| `Financials` | — | Revenue if publicly known, otherwise `Not publicly disclosed` |
| `Ownership Status` | Yes | See values below |
| `Ownership Details` | — | Investor names, stake size, acquisition date |
| `Parent Company` | Yes | Parent name, or `Independent` if none |
| `Headquarters` | Yes | `City, State, Country` |
| `Main Manufacturing` | — | Where products are physically made |
| `Environmental & Sustainability Policies` | — | Certifications (B-Corp, 1% for Planet, bluesign, Climate Neutral) and concrete commitments |
| `Acquisition History` | — | Key ownership changes with years |

### Ownership Status values

Use one of these standard values:

- `Independent - Family Owned`
- `Independent - Founder Owned`
- `Independent - Employee Owned`
- `Private - Family Owned`
- `Private Equity Owned`
- `Public Company`
- `Subsidiary`
- `B-Corp Certified`
- `Co-op / Member Owned`

---

## Guidelines

- **Be factual.** Only include information you're confident about. Use sources: press releases, SEC filings, reputable business journalism.
- **Be concise.** One to three sentences per field.
- **No marketing language.** "Committed to the planet" is not a sustainability policy. B-Corp certification or 1% for Planet membership is.
- **Prefer verified over complete.** Leave a field blank rather than guessing.
- **Include sources in your PR description** — not in the CSV itself, but in the PR body so reviewers can check.

---

## Ownership map data

The ownership map uses a separate data file at `src/data/ownershipData.ts`. This is curated manually to highlight recognizable brands that tell the consolidation story clearly. If you want to add a brand to the map, edit that file directly — the structure is straightforward TypeScript.

---

## Code contributions

Standard GitHub flow:

1. Fork the repo
2. `npm install && npm run dev`
3. Make your changes
4. `npm run build` to confirm no TypeScript errors
5. Open a PR against `main`

The site is React 19 + TypeScript + Vite + MUI. See `README.md` for the full stack overview.

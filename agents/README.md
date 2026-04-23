# Indie Outdoors Research Agent

A Claude-powered script that researches outdoor companies and outputs data in the `companies.csv` schema.

## Setup

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

### Research a single company
```bash
python agents/research_agent.py "Hyperlite Mountain Gear"
```
Prints a formatted summary and a CSV line ready to paste into `public/companies.csv`.

### Batch research from a list
```bash
python agents/research_agent.py --batch agents/to_research.txt
# Output lands in agents/researched_companies.csv by default
python agents/research_agent.py --batch agents/to_research.txt --output agents/new_brands.csv
```
Edit `agents/to_research.txt` to add company names (one per line, `#` for comments).

### Clean up existing CSV
```bash
python agents/research_agent.py --clean public/companies.csv
# Writes public/companies_cleaned.csv — review before replacing the original
```
The cleaner will:
- Fill missing / "Not Available" fields
- Standardise Ownership Status values
- Remove Wikipedia citation artifacts (e.g. `​en.wikipedia.org` appended inline)
- Preserve intentional markdown links like `([source.com](https://...))`

## Output schema

All output matches the `companies.csv` column structure:

| Column | Description |
|---|---|
| Company | Official company name |
| Business Category | Apparel / Equipment / Footwear / Accessories / Retailer |
| Main Sport Focus | Comma-separated sports |
| Year Founded | 4-digit year |
| Financials | Revenue if known, else "Not publicly disclosed" |
| Ownership Status | Standardised ownership type |
| Ownership Details | Investor names, stake, acquisition date |
| Parent Company | Parent name, or "Independent" |
| Headquarters | City, State/Province, Country |
| Main Manufacturing | Where products are made |
| Environmental & Sustainability Policies | Certifications and commitments |
| Acquisition History | Key ownership changes with years |

## Notes

- Uses `claude-opus-4-7` for best research quality
- Adds a 0.5–1s pause between rows to avoid rate limits
- The cleaner writes a `_cleaned.csv` file — always review before replacing the original
- For new entries, paste the CSV line into `public/companies.csv` and verify it looks right

#!/usr/bin/env python3
"""
Indie Outdoors Research Agent
==============================
Uses Claude to research outdoor companies and output rows in the companies.csv schema.
Can research a single company, a batch from a text file, or clean up existing CSV entries.

Usage:
  python agents/research_agent.py "Hyperlite Mountain Gear"
  python agents/research_agent.py --batch agents/to_research.txt
  python agents/research_agent.py --clean public/companies.csv

Requirements:
  pip install anthropic
  export ANTHROPIC_API_KEY=...
"""

import anthropic
import csv
import json
import sys
import os
import argparse
import time
from io import StringIO

# ── Schema ──────────────────────────────────────────────────────────────────

CSV_COLUMNS = [
    "Company",
    "Business Category",
    "Main Sport Focus",
    "Year Founded",
    "Financials",
    "Ownership Status",
    "Ownership Details",
    "Parent Company",
    "Headquarters",
    "Main Manufacturing",
    "Environmental & Sustainability Policies",
    "Acquisition History",
]

OWNERSHIP_STATUS_VALUES = [
    "Independent - Family Owned",
    "Independent - Founder Owned",
    "Independent - Employee Owned",
    "Founder-Led - Venture Backed",   # founder still runs it; VC/growth equity investors hold minority stake
    "Private - Family Owned",
    "Private Equity Owned",
    "Public Company",
    "Subsidiary",
    "B-Corp Certified",
    "Co-op / Member Owned",
]

SYSTEM_PROMPT = """You are a research assistant for Indie Outdoors, a publication and directory that
tracks outdoor gear companies. Your job is to research companies and return accurate,
structured data that fits a specific CSV schema.

Guidelines:
- Be factual. Only include information you are confident about.
- Use "Not publicly disclosed" for revenue/financials when unknown.
- For Ownership Status, use one of the standard values when possible.
- For Parent Company, use "Independent" if the company has no corporate parent.
- For Headquarters, use "City, State/Province, Country" format.
- For Main Manufacturing, describe where products are physically made.
- For Environmental & Sustainability Policies, focus on certifications (B-Corp, 1% for Planet,
  Climate Neutral, bluesign) and concrete commitments, not marketing language.
- For Acquisition History, list key ownership changes with years.
- Keep text fields concise — one to three sentences max per field.
- Do not hallucinate. If you don't know something, say "Not available" or leave it minimal.
"""

RESEARCH_PROMPT = """Research the outdoor company "{company}" and return a JSON object with these exact fields:

{{
  "Company": "Official company name",
  "Business Category": "Primary type: Apparel / Equipment / Footwear / Accessories / Retailer",
  "Main Sport Focus": "Primary sports, comma-separated (e.g. Hiking, Camping)",
  "Year Founded": "4-digit year only",
  "Financials": "Known revenue figure, or 'Not publicly disclosed'",
  "Ownership Status": "One of: {ownership_values}",
  "Ownership Details": "Brief detail: investor names, when acquired, stake size, etc.",
  "Parent Company": "Parent company name, or 'Independent' if none",
  "Headquarters": "City, State/Province, Country",
  "Main Manufacturing": "Where products are physically manufactured",
  "Environmental & Sustainability Policies": "Key certifications and sustainability commitments",
  "Acquisition History": "Key ownership changes with years, or 'No major acquisitions' if none"
}}

Company to research: {company}

Return ONLY valid JSON. No markdown, no explanation, no code blocks."""


# ── Claude client ─────────────────────────────────────────────────────────────

def get_client() -> anthropic.Anthropic:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("Error: ANTHROPIC_API_KEY environment variable not set.")
    return anthropic.Anthropic(api_key=api_key)


# ── Research a single company ────────────────────────────────────────────────

def research_company(client: anthropic.Anthropic, company_name: str) -> dict:
    """Call Claude to research a company. Returns a dict matching CSV_COLUMNS."""
    prompt = RESEARCH_PROMPT.format(
        company=company_name,
        ownership_values=", ".join(OWNERSHIP_STATUS_VALUES),
    )

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])

    data = json.loads(raw)

    # Ensure all columns are present
    for col in CSV_COLUMNS:
        if col not in data:
            data[col] = ""

    return {col: data.get(col, "") for col in CSV_COLUMNS}


# ── Clean up an existing row ─────────────────────────────────────────────────

CLEAN_PROMPT = """The following is an existing data row for the outdoor company "{company}".
Some fields may be missing, inconsistent, or contain markdown links mixed with raw text.

Current data:
{current_data}

Tasks:
1. Fill in any empty or "Not Available" fields if you know the information.
2. Standardise Ownership Status to one of: {ownership_values}
3. Ensure Parent Company is set to "Independent" if the company has no corporate parent.
4. Remove any Wikipedia-style citation markers (e.g. "​en.wikipedia.org" appended to text).
5. Keep markdown links like ([source.com](https://...)) — these are intentional.
6. Keep all text concise (1-3 sentences per field).

Return the full updated JSON object with all fields from the original. Return ONLY valid JSON."""


def clean_row(client: anthropic.Anthropic, row: dict) -> dict:
    """Ask Claude to clean and fill gaps in an existing row."""
    current = json.dumps({k: v for k, v in row.items() if v}, indent=2)
    prompt = CLEAN_PROMPT.format(
        company=row.get("Company", "unknown"),
        current_data=current,
        ownership_values=", ".join(OWNERSHIP_STATUS_VALUES),
    )

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])

    data = json.loads(raw)
    return {col: data.get(col, row.get(col, "")) for col in CSV_COLUMNS}


# ── Output helpers ───────────────────────────────────────────────────────────

def row_to_csv_line(row: dict) -> str:
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_COLUMNS, extrasaction="ignore")
    writer.writerow(row)
    return output.getvalue().strip()


def print_row(row: dict) -> None:
    print("\n" + "─" * 60)
    for col in CSV_COLUMNS:
        val = row.get(col, "")
        if val:
            print(f"  {col:<40} {val[:80]}")
    print("─" * 60)


# ── Modes ────────────────────────────────────────────────────────────────────

def mode_single(client: anthropic.Anthropic, company_name: str) -> None:
    print(f"Researching: {company_name} …")
    row = research_company(client, company_name)
    print_row(row)
    print("\nCSV line (paste into companies.csv):")
    print(row_to_csv_line(row))


def mode_batch(client: anthropic.Anthropic, file_path: str, output_path: str) -> None:
    with open(file_path) as f:
        companies = [line.strip() for line in f if line.strip() and not line.startswith("#")]

    print(f"Batch: {len(companies)} companies → {output_path}")

    with open(output_path, "w", newline="", encoding="utf-8") as out:
        writer = csv.DictWriter(out, fieldnames=CSV_COLUMNS)
        writer.writeheader()

        for i, name in enumerate(companies, 1):
            print(f"  [{i}/{len(companies)}] {name} …", end=" ", flush=True)
            try:
                row = research_company(client, name)
                writer.writerow(row)
                out.flush()
                print("✓")
            except Exception as e:
                print(f"✗ {e}")

            # Rate limit courtesy pause
            if i < len(companies):
                time.sleep(1)

    print(f"\nDone. Output: {output_path}")


def mode_clean(client: anthropic.Anthropic, csv_path: str) -> None:
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Cleaning {len(rows)} rows from {csv_path} …")

    output_path = csv_path.replace(".csv", "_cleaned.csv")
    cleaned = []

    for i, row in enumerate(rows, 1):
        name = row.get("Company", "")
        if not name:
            continue
        print(f"  [{i}/{len(rows)}] {name} …", end=" ", flush=True)
        try:
            clean = clean_row(client, row)
            cleaned.append(clean)
            print("✓")
        except Exception as e:
            print(f"✗ {e} (keeping original)")
            cleaned.append({col: row.get(col, "") for col in CSV_COLUMNS})

        if i < len(rows):
            time.sleep(0.5)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(cleaned)

    print(f"\nDone. Cleaned file: {output_path}")
    print("Review the output before replacing the original.")


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Indie Outdoors Research Agent — research and clean outdoor company data."
    )
    parser.add_argument("company", nargs="?", help="Company name to research")
    parser.add_argument("--batch", metavar="FILE", help="Text file with one company name per line")
    parser.add_argument("--clean", metavar="CSV", help="Clean up an existing companies.csv")
    parser.add_argument("--output", metavar="FILE", default="agents/researched_companies.csv",
                        help="Output CSV path for --batch mode (default: agents/researched_companies.csv)")

    args = parser.parse_args()

    if not any([args.company, args.batch, args.clean]):
        parser.print_help()
        sys.exit(1)

    client = get_client()

    if args.company:
        mode_single(client, args.company)
    elif args.batch:
        mode_batch(client, args.batch, args.output)
    elif args.clean:
        mode_clean(client, args.clean)


if __name__ == "__main__":
    main()

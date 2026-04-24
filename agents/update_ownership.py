#!/usr/bin/env python3
"""
Apply verified ownership research updates to companies.csv.
Research performed April 2026 via web search.
"""

import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "companies.csv")

UPDATES = {
    "Cotopaxi": {
        "Ownership Status": "Founder-Led - Venture Backed",
        "Ownership Details": "Bain Capital Double Impact holds minority stake (2021); founder Davis Smith on 3-year leave as of 2024, CEO role passed to Lindsay Shumlas.",
        "Parent Company": "Independent",
    },
    "Mervin Manufacturing (Lib Tech & GNU)": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Acquired by Spring Capital Group (Eugene, OR) in April 2024; previously owned by Altamont Capital Partners (2013–2024, ~$51M acquisition from Quiksilver).",
        "Parent Company": "Spring Capital Group",
        "Acquisition History": "Acquired by Altamont Capital Partners (2013) for ~$51M out of Quiksilver; sold to Spring Capital Group (April 2024).",
    },
    "Specialized Bicycle Components": {
        "Ownership Status": "Independent - Founder Owned",
        "Ownership Details": "Majority-owned by founder Mike Sinyard; Merida (Taiwan) holds minority stake (~35%, reduced from ~49% after $105M write-down in March 2025).",
        "Parent Company": "Independent",
    },
    "Mammut Sports Group": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Acquired by Telemos Capital (London PE) from Conzzeta AG in April 2021; Telemos merged with Jacobs Holding to form Jacobs Capital in 2025.",
        "Parent Company": "Jacobs Capital",
        "Acquisition History": "Owned by Conzzeta AG (1982–2021); acquired by Telemos Capital (2021); Telemos became Jacobs Capital (2025).",
    },
    "Rossignol": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Majority-owned by Altor Equity Partners (Nordic PE, ~80%) since 2013; Boix-Vives family retains minority stake.",
        "Parent Company": "Altor Equity Partners",
        "Acquisition History": "Acquired by Altor Equity Partners (2013); Boix-Vives family retained minority stake.",
    },
    "Rocky Mountain": {
        "Ownership Status": "Subsidiary",
        "Ownership Details": "Acquired by Chaos Sports Inc. in May 2025 via vesting order; new owners are four Canadian entrepreneurs: Jonathan Bourgeois, Christian Thibert, Patrick St-Denis, and Jean-François Grenache.",
        "Parent Company": "Chaos Sports Inc.",
        "Acquisition History": "Acquired by Chaos Sports Inc. (May 2025) via vesting order.",
    },
    "Cannondale": {
        "Ownership Status": "Subsidiary",
        "Ownership Details": "Subsidiary of Pon Holdings (Dutch conglomerate) since January 2022, acquired as part of the $810M Dorel Sports purchase.",
        "Parent Company": "Pon Holdings",
    },
    "Norco": {
        "Ownership Status": "Independent - Family Owned",
        "Ownership Details": "Lewis family (descendants of founder Bert Lewis) assumed full ownership of Live to Play Sports Group Inc. on July 1, 2024, buying out the Zalkow family co-owners.",
        "Parent Company": "Independent",
    },
    "Fox Racing": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Acquired by Vista Outdoor in August 2022 for $540M; became part of Revelyst, which was acquired by Strategic Value Partners (SVP) in January 2025 for $1.125B.",
        "Parent Company": "Strategic Value Partners",
        "Acquisition History": "Acquired by Vista Outdoor (August 2022) for $540M; sold to Strategic Value Partners via Revelyst acquisition (January 2025).",
    },
    "YT Industries": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Ardian (French PE) acquired majority stake in August 2021; founders Markus Flossmann and Jacob Fatih retained minority. Filed for insolvency in 2025 amid tariff impacts and supply chain crisis.",
        "Parent Company": "Ardian",
        "Acquisition History": "Ardian acquired majority stake (2021); filed for insolvency (2025).",
    },
    "Brodie Bicycles": {
        "Ownership Status": "Subsidiary",
        "Ownership Details": "Founder Paul Brodie sold the company to longtime distributor CyberSport Ltd. in 2001; operates as a locally owned Canadian brand.",
        "Parent Company": "CyberSport Ltd.",
    },
    "Howies": {
        "Ownership Status": "Independent - Founder Owned",
        "Ownership Details": "Founded by David and Clare Hieatt (1995); acquired by Timberland in 2006; management bought back the company in 2012, returning it to independent ownership.",
        "Parent Company": "Independent",
    },
    "Canyon Bicycles": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Groupe Bruxelles Lambert (GBL), Belgian investment holding company, holds 52.35% majority stake since 2020; founder Roman Arnold retains minority ownership.",
        "Parent Company": "Groupe Bruxelles Lambert",
        "Acquisition History": "GBL (Belgium) acquired majority stake (~50%) in 2020; raised to 52.35% by 2025. Revenue ~€738M (2025).",
    },
    "CamelBak": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Part of Vista Outdoor's Revelyst portfolio; Revelyst acquired by Strategic Value Partners (SVP) in January 2025 for $1.125B.",
        "Parent Company": "Strategic Value Partners",
        "Acquisition History": "Acquired by Vista Outdoor (2015); became part of Revelyst (2024); Revelyst sold to Strategic Value Partners (January 2025).",
    },
    "Bushnell": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Part of Vista Outdoor's Revelyst portfolio; Revelyst acquired by Strategic Value Partners (SVP) in January 2025 for $1.125B.",
        "Parent Company": "Strategic Value Partners",
        "Acquisition History": "Acquired by Vista Outdoor (2013); became part of Revelyst (2024); Revelyst sold to Strategic Value Partners (January 2025).",
    },
    "Stio ": {
        "Ownership Status": "Founder-Led - Venture Backed",
        "Ownership Details": "Founder Stephen Sullivan still serves as CEO; raised $42.6M total including $20M Series B from LAGO Innovation Fund (May 2023) and earlier rounds from Sandbridge Capital and KarpReilly.",
        "Parent Company": "Independent",
    },
    "Smith Optics": {
        "Ownership Status": "Subsidiary",
        "Ownership Details": "Subsidiary of Safilo Group S.p.A. (Italian public eyewear company, NYSE: SFL), which acquired Smith in 2014.",
        "Parent Company": "Safilo Group",
    },
    "Giro": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Part of Vista Outdoor's Revelyst portfolio; Revelyst acquired by Strategic Value Partners (SVP) in January 2025 for $1.125B.",
        "Parent Company": "Strategic Value Partners",
        "Acquisition History": "Founded 1985; acquired by Bell Sports (1996); acquired by Vista Outdoor (2016) for $400M; sold to Strategic Value Partners via Revelyst acquisition (January 2025).",
    },
    "Bell Helmets": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Part of Vista Outdoor's Revelyst portfolio; Revelyst acquired by Strategic Value Partners (SVP) in January 2025 for $1.125B.",
        "Parent Company": "Strategic Value Partners",
        "Acquisition History": "Multiple ownership changes; acquired by Vista Outdoor (2016) for $400M as part of BRG Sports deal; sold to Strategic Value Partners via Revelyst acquisition (January 2025).",
    },
    "Brunton": {
        "Ownership Status": "Independent - Family Owned",
        "Ownership Details": "Lauren and David Heerschap (former Brunton employees) acquired the company in November 2021; Lauren is majority owner and CEO, making it a woman-owned, geologist-operated business in Riverton, Wyoming.",
        "Parent Company": "Independent",
    },
    "Klymit": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Acquired by MacNeill Pride Group (MPG) in July 2021; MPG is a portfolio company of Centre Partners private equity.",
        "Parent Company": "MacNeill Pride Group",
    },
    "NEMO Equipment": {
        "Ownership Status": "Independent - Founder Owned",
        "Ownership Details": "Founded in 2002 by Cam Brensinger, who remains CEO. Minority investments from The Coleman Company and individual investors; no controlling outside investor.",
        "Parent Company": "Independent",
    },
    "Sea to Summit": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Five V Capital (Australian PE) acquired majority stake in June 2022; founder Roland Tyson retained minority stake and continues to advise on product design.",
        "Parent Company": "Five V Capital",
    },
    "Snow Peak": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Taken private via MBO in July 2024; Bain Capital holds 55%, founding Yamai family holds 45%; delisted from Tokyo Stock Exchange.",
        "Parent Company": "Bain Capital",
        "Acquisition History": "Founded 1958; IPO'd on Tokyo Stock Exchange; MBO by Bain Capital and Yamai family (July 2024); delisted from TSE.",
    },
    "Superfeet": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Became 100% employee-owned (ESOP) in 2015; Westward Partners (Seattle-based PE) acquired majority stake in June 2021.",
        "Parent Company": "Westward Partners",
    },
    "Dakine": {
        "Ownership Status": "Private Equity Owned",
        "Ownership Details": "Acquired by Marquee Brands in December 2018 from Altamont Capital Partners; Marquee Brands is backed by Neuberger Berman private equity. Marquee holds IP; JR286 operates the brand under license.",
        "Parent Company": "Marquee Brands",
        "Acquisition History": "Founded 1979; sold to Altamont Capital Partners (2013) for $70M; acquired by Marquee Brands (December 2018).",
    },
}


def update_csv(csv_path: str, updates: dict) -> None:
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    updated = []
    not_found = list(updates.keys())

    for row in rows:
        company = row.get("Company", "")
        if company in updates:
            for field, value in updates[company].items():
                row[field] = value
            updated.append(company)
            not_found.remove(company)

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated {len(updated)}/{len(updates)} companies:")
    for name in sorted(updated):
        print(f"  ✓ {name}")
    if not_found:
        print(f"\nNot found in CSV ({len(not_found)}):")
        for name in not_found:
            print(f"  ✗ {name}")


if __name__ == "__main__":
    update_csv(CSV_PATH, UPDATES)

import axios from 'axios';
import * as d3 from 'd3';

export interface CompanyData {
  Company: string;
  'Business Category': string;
  'Main Sport Focus': string;
  'Year Founded': string;
  Financials: string;
  'Ownership Status': string;
  'Ownership Details': string;
  'Parent Company': string;
  Headquarters: string;
  'Main Manufacturing': string;
  'Environmental & Sustainability Policies': string;
  'Acquisition History': string;
}

function score(c: CompanyData): number {
  // Prefer entries with more fields filled in
  return Object.values(c).filter(v => v && v.trim() !== '' && v !== 'Not Available').length;
}

export async function fetchCompanies(): Promise<CompanyData[]> {
  const baseUrl = import.meta.env.BASE_URL;
  const csvPath = baseUrl === '/' ? '/companies.csv' : `${baseUrl}companies.csv`;
  const response = await axios.get(csvPath);
  const parsed = d3.csvParse(response.data) as CompanyData[];

  // Deduplicate by company name, keeping the entry with the most data
  const map = new Map<string, CompanyData>();
  for (const company of parsed) {
    const key = company.Company?.trim().toLowerCase();
    if (!key) continue;
    const existing = map.get(key);
    if (!existing || score(company) > score(existing)) {
      map.set(key, company);
    }
  }

  return Array.from(map.values());
}

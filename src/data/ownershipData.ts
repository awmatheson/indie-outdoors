// Curated ownership data for the map visualization.
// Focused on recognizable brands that tell the consolidation story clearly.
// Long-tail micro-independents are excluded — they add noise, not insight.

export type OwnershipType = 'conglomerate' | 'pe' | 'independent' | 'co-op';

export interface Brand {
  name: string;
  founded?: number;
  note?: string;
}

export interface OwnershipGroup {
  id: string;
  name: string;
  type: OwnershipType;
  note?: string;
  brands: Brand[];
}

// ─────────────────────────────────────────────────────────────
// CONGLOMERATES — public companies or holding companies that
// own multiple outdoor brands as subsidiaries
// ─────────────────────────────────────────────────────────────

export const OWNERSHIP_GROUPS: OwnershipGroup[] = [
  {
    id: 'amer-sports',
    name: 'Amer Sports',
    type: 'conglomerate',
    note: 'Majority owned by Anta Sports (China) since 2019. NYSE: AS.',
    brands: [
      { name: "Arc'teryx", founded: 1989 },
      { name: 'Salomon', founded: 1947 },
      { name: 'Wilson', founded: 1913 },
      { name: 'Atomic', founded: 1955 },
      { name: 'Suunto', founded: 1936 },
      { name: 'Peak Performance', founded: 1986 },
    ],
  },
  {
    id: 'vf-corp',
    name: 'VF Corporation',
    type: 'conglomerate',
    note: 'Public holding company (NYSE: VFC). Headquarters moved to Denver in 2019.',
    brands: [
      { name: 'The North Face', founded: 1966 },
      { name: 'Timberland', founded: 1952 },
      { name: 'Smartwool', founded: 1994 },
      { name: 'Icebreaker', founded: 1994 },
      { name: 'Altra', founded: 2011 },
      { name: 'Napapijri', founded: 1987 },
    ],
  },
  {
    id: 'revelyst',
    name: 'Revelyst',
    type: 'conglomerate',
    note: 'Spun out of Vista Outdoor in 2024. Formerly one of the largest outdoor conglomerates.',
    brands: [
      { name: 'CamelBak', founded: 1989 },
      { name: 'Giro', founded: 1985 },
      { name: 'Bell Helmets', founded: 1954 },
      { name: 'Bushnell', founded: 1948 },
      { name: 'Camp Chef', founded: 1990 },
      { name: 'Fox Racing', founded: 1974 },
      { name: 'Simms Fishing', founded: 1980 },
    ],
  },
  {
    id: 'columbia',
    name: 'Columbia Sportswear',
    type: 'conglomerate',
    note: 'Publicly traded (NASDAQ: COLM) but family-controlled by the Boyle family since 1938.',
    brands: [
      { name: 'Columbia', founded: 1938 },
      { name: 'prAna', founded: 1992 },
      { name: 'Sorel', founded: 1962 },
      { name: 'Mountain Hardwear', founded: 1993 },
    ],
  },
  {
    id: 'wolverine',
    name: 'Wolverine World Wide',
    type: 'conglomerate',
    note: 'Public holding company (NYSE: WWW). One of the largest footwear groups in the world.',
    brands: [
      { name: 'Merrell', founded: 1981 },
      { name: 'Saucony', founded: 1898 },
      { name: 'Chaco', founded: 1989 },
      { name: 'Sweaty Betty', founded: 1998 },
      { name: 'Wolverine', founded: 1883 },
      { name: 'Sperry', founded: 1935 },
    ],
  },
  {
    id: 'deckers',
    name: 'Deckers Outdoor',
    type: 'conglomerate',
    note: 'Public holding company (NYSE: DECK). Hoka is its fastest-growing brand.',
    brands: [
      { name: 'Hoka', founded: 2009 },
      { name: 'Teva', founded: 1984 },
      { name: 'UGG', founded: 1978 },
      { name: 'Sanuk', founded: 1997 },
    ],
  },
  {
    id: 'helen-of-troy',
    name: 'Helen of Troy',
    type: 'conglomerate',
    note: 'Public holding company (NASDAQ: HELE). Acquired Hydro Flask and Osprey to build an outdoor portfolio.',
    brands: [
      { name: 'Hydro Flask', founded: 2009 },
      { name: 'Osprey', founded: 1974 },
      { name: 'OXO', founded: 1990 },
    ],
  },
  {
    id: 'fenix-outdoor',
    name: 'Fenix Outdoor',
    type: 'conglomerate',
    note: 'Swedish publicly listed holding company (Nasdaq: FENIX B). Anchored by Fjällräven.',
    brands: [
      { name: 'Fjällräven', founded: 1960 },
      { name: 'Hanwag', founded: 1921 },
      { name: 'Royal Robbins', founded: 1968 },
      { name: 'Brunton', founded: 1894 },
      { name: 'Primus', founded: 1892 },
    ],
  },
  {
    id: 'oberalp',
    name: 'Oberalp Group',
    type: 'conglomerate',
    note: 'Privately held Italian company. Owns a portfolio of European technical brands.',
    brands: [
      { name: 'Salewa', founded: 1935 },
      { name: 'Dynafit', founded: 1950 },
      { name: 'Evolv', founded: 2003 },
      { name: 'Wild Country', founded: 1969 },
      { name: 'Pomoca', founded: 1945 },
    ],
  },
  {
    id: 'cascade-designs',
    name: 'Cascade Designs',
    type: 'conglomerate',
    note: 'Privately held, family-founded in Seattle. Unusually independent for a multi-brand owner.',
    brands: [
      { name: 'MSR', founded: 1969 },
      { name: 'Therm-a-Rest', founded: 1971 },
      { name: 'PackTowl', founded: 1992 },
      { name: 'Platypus', founded: 1989 },
      { name: 'SealLine', founded: 1994 },
    ],
  },
  {
    id: 'pon-holdings',
    name: 'Pon Holdings',
    type: 'conglomerate',
    note: 'Dutch family-owned conglomerate. Owns the largest portfolio of bike brands.',
    brands: [
      { name: 'Cannondale', founded: 1971 },
      { name: 'Santa Cruz Bicycles', founded: 1993 },
      { name: 'Cervélo', founded: 1995 },
      { name: 'GT Bicycles', founded: 1979 },
      { name: 'Gazelle', founded: 1892 },
    ],
  },
  {
    id: 'clarus',
    name: 'Clarus Corp',
    type: 'conglomerate',
    note: 'Public holding company (NASDAQ: CLAR). Focuses on climbing and outdoor safety.',
    brands: [
      { name: 'Black Diamond', founded: 1957 },
      { name: 'PIEPS', founded: 1972 },
      { name: 'Sierra Bullets', founded: 1947 },
    ],
  },
  {
    id: 'compass-diversified',
    name: 'Compass Diversified',
    type: 'conglomerate',
    note: 'Public holding company (NYSE: CODI). Owns a range of niche industrial and consumer brands.',
    brands: [
      { name: '5.11 Tactical', founded: 1992 },
      { name: 'PrimaLoft', founded: 1983 },
      { name: 'Velocity Outdoor', founded: 1945 },
    ],
  },
  {
    id: 'samsonite',
    name: 'Samsonite',
    type: 'conglomerate',
    note: 'Hong Kong-listed luggage and travel company that acquired Gregory to expand into outdoor.',
    brands: [
      { name: 'Gregory Mountain Products', founded: 1977 },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PE-BACKED — private equity has a controlling or majority stake
  // ─────────────────────────────────────────────────────────────
  {
    id: 'tsg-consumer',
    name: 'TSG Consumer Partners',
    type: 'pe',
    note: 'San Francisco PE firm. Acquired Marmot from Newell Brands in 2018.',
    brands: [
      { name: 'Marmot', founded: 1974 },
    ],
  },
  {
    id: 'kohlberg',
    name: 'Kohlberg & Company',
    type: 'pe',
    note: 'NY-based middle-market PE. Acquired NEMO Equipment in 2022.',
    brands: [
      { name: 'NEMO Equipment', founded: 2002 },
    ],
  },
  {
    id: 'altamont',
    name: 'Altamont Capital',
    type: 'pe',
    note: 'PE firm that acquired both Dakine and Mervin Manufacturing (Lib Tech, GNU) from larger conglomerates.',
    brands: [
      { name: 'Dakine', founded: 1979 },
      { name: 'Lib Tech', founded: 1977 },
      { name: 'GNU Snowboards', founded: 1977 },
    ],
  },
  {
    id: 'ardian',
    name: 'Ardian',
    type: 'pe',
    note: 'French PE firm. Took majority stake in YT Industries in 2021.',
    brands: [
      { name: 'YT Industries', founded: 2008 },
    ],
  },
  {
    id: 'five-v',
    name: 'Five V Capital',
    type: 'pe',
    note: 'Australian PE. Took majority stake in Sea to Summit in 2022.',
    brands: [
      { name: 'Sea to Summit', founded: 1990 },
    ],
  },
  {
    id: 'gbm',
    name: 'Groupe Bruxelles Lambert',
    type: 'pe',
    note: 'Belgian investment holding company. Owns a majority stake in Canyon Bicycles.',
    brands: [
      { name: 'Canyon Bicycles', founded: 1985 },
    ],
  },
  {
    id: 'csc-gen',
    name: 'CSC Generation',
    type: 'pe',
    note: 'Retail-focused PE. Acquired Backcountry.com and other outdoor retailers.',
    brands: [
      { name: 'Backcountry.com', founded: 1996 },
      { name: 'Steep & Cheap', founded: 2005 },
    ],
  },
  {
    id: 'telemos',
    name: 'Telemos Capital',
    type: 'pe',
    note: 'UK-based PE. Acquired Swiss climbing brand Mammut in 2021.',
    brands: [
      { name: 'Mammut', founded: 1862 },
    ],
  },
  {
    id: 'kmb',
    name: 'KMD Brands',
    type: 'pe',
    note: 'Australian outdoor group (ASX: KMD). Owns Rip Curl and Oboz alongside Kathmandu.',
    brands: [
      { name: 'Rip Curl', founded: 1969 },
      { name: 'Kathmandu', founded: 1987 },
      { name: 'Oboz', founded: 2007 },
    ],
  },
  {
    id: 'adventure-ready',
    name: 'Adventure Ready Brands',
    type: 'pe',
    note: 'PE-backed aggregator of safety and survival brands.',
    brands: [
      { name: 'Adventure Medical Kits', founded: 1993 },
      { name: 'SOL Survival', founded: 2008 },
      { name: "Ben's Insect Repellent", founded: 1948 },
      { name: 'After Bite', founded: 1976 },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // INDEPENDENT — founder/family/employee-owned, no controlling
  // outside financial investor
  // ─────────────────────────────────────────────────────────────
  {
    id: 'independent',
    name: 'Independent',
    type: 'independent',
    note: 'Founder, family, or employee-owned. No controlling outside investor.',
    brands: [
      { name: 'Patagonia', founded: 1973, note: 'Transferred to Patagonia Purpose Trust in 2022' },
      { name: 'Burton Snowboards', founded: 1977 },
      { name: 'Trek Bicycle', founded: 1975 },
      { name: 'Specialized', founded: 1974 },
      { name: 'YETI', founded: 2006, note: 'Public since 2018 (NYSE: YETI)' },
      { name: 'Cotopaxi', founded: 2014 },
      { name: 'KÜHL', founded: 1983 },
      { name: 'Outdoor Research', founded: 1981 },
      { name: 'Darn Tough Vermont', founded: 2004, note: '100% family-owned in Northfield, VT. Unconditional lifetime guarantee. Has turned down multiple acquisition offers.' },
      { name: 'Big Agnes', founded: 2000 },
      { name: 'Petzl', founded: 1975 },
      { name: 'La Sportiva', founded: 1928 },
      { name: 'Norrøna', founded: 1929 },
      { name: 'Kuiu', founded: 2010 },
      { name: 'Melanzana', founded: 1994 },
      { name: 'Rab', founded: 1981 },
      { name: 'Channel Islands Surfboards', founded: 1969 },
      { name: 'Giant Bicycles', founded: 1972 },
      { name: 'Transition Bikes', founded: 2002 },
      { name: 'Opinel', founded: 1890 },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CO-OP / NON-PROFIT — member or employee owned
  // ─────────────────────────────────────────────────────────────
  {
    id: 'co-op',
    name: 'Co-op / Employee-Owned',
    type: 'co-op',
    note: 'Owned by members or employees. Profits distributed accordingly.',
    brands: [
      { name: 'REI', founded: 1938, note: 'Member-owned co-op with 23M+ members' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Summary stats derived from the full dataset
// ─────────────────────────────────────────────────────────────
export const SUMMARY_STATS = {
  total: 290,
  independent: 192,
  peOwned: 42,
  conglomerate: 35,
  ventureOrMixed: 21,
};

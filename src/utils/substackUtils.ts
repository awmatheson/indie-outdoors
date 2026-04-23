// Substack integration via RSS proxy
//
// Substack's RSS feed lacks CORS headers, so browser fetches are blocked.
// We route through corsproxy.io (free, no API key) and parse the XML ourselves.
//
// CONFIGURE: set VITE_SUBSTACK_PUBLICATION to your Substack subdomain
// e.g. if your publication is at https://indieoutdoors.substack.com
// set it to "indieoutdoors" (the default below)
// Or set VITE_SUBSTACK_CUSTOM_DOMAIN for custom-domain publications.

const PUBLICATION    = import.meta.env.VITE_SUBSTACK_PUBLICATION  || 'indieoutdoors';
const CUSTOM_DOMAIN  = import.meta.env.VITE_SUBSTACK_CUSTOM_DOMAIN || '';

export const SUBSTACK_PUBLICATION = PUBLICATION;

function getRssFeedUrl(): string {
  if (CUSTOM_DOMAIN) return `https://${CUSTOM_DOMAIN}/feed`;
  return `https://${PUBLICATION}.substack.com/feed`;
}

export const SUBSTACK_BASE_URL = CUSTOM_DOMAIN
  ? `https://${CUSTOM_DOMAIN}`
  : `https://${PUBLICATION}.substack.com`;

// ── Types ──────────────────────────────────────────────────────

export interface SubstackPost {
  id:           string;
  title:        string;
  subtitle:     string;
  slug:         string;
  post_date:    string;
  cover_image:  string | null;
  description:  string;
  url:          string;
  author:       string;
}

// ── Helpers ────────────────────────────────────────────────────

function slugFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    return path.replace(/^\/p\//, '').replace(/\/$/, '') || url;
  } catch {
    return url;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Get the text content of the first matching tag (supports namespace prefixes). */
function getText(el: Element, ...tags: string[]): string {
  for (const tag of tags) {
    const found = el.getElementsByTagName(tag)[0];
    if (found?.textContent) return found.textContent.trim();
  }
  return '';
}

function itemFromXml(item: Element, index: number): SubstackPost {
  const title    = getText(item, 'title');
  const url      = getText(item, 'link') || getText(item, 'guid');
  const pubDate  = getText(item, 'pubDate');
  const rawDesc  = getText(item, 'description', 'content:encoded', 'content');
  const author   = getText(item, 'dc:creator', 'creator', 'author');

  // Cover image: prefer <enclosure url="...">, fall back to <media:thumbnail url="...">
  const enclosure     = item.getElementsByTagName('enclosure')[0];
  const mediaThumbnail = item.getElementsByTagName('media:thumbnail')[0]
                      ?? item.getElementsByTagName('thumbnail')[0];
  const cover_image = enclosure?.getAttribute('url')
                   ?? mediaThumbnail?.getAttribute('url')
                   ?? null;

  const description = rawDesc ? stripHtml(rawDesc).slice(0, 300) : '';

  return {
    id:          `${index}-${slugFromUrl(url)}`,
    title,
    subtitle:    description,
    slug:        slugFromUrl(url),
    post_date:   pubDate,
    cover_image,
    description,
    url,
    author,
  };
}

// ── Main fetch ─────────────────────────────────────────────────

export async function fetchSubstackPosts(count = 12): Promise<SubstackPost[]> {
  const feedUrl = getRssFeedUrl();

  // corsproxy.io adds CORS headers and returns the raw feed — no API key required
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`);
  }

  const xmlText = await response.text();
  const parser  = new DOMParser();
  const doc     = parser.parseFromString(xmlText, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse RSS XML');
  }

  const items = Array.from(doc.getElementsByTagName('item')).slice(0, count);
  return items.map((item, i) => itemFromXml(item, i));
}

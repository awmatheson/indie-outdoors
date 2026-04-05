// Substack integration via RSS → JSON proxy
//
// The Substack JSON API (/api/v1/posts) blocks browser requests due to CORS.
// The RSS feed (/feed) also lacks CORS headers.
// Solution: route through rss2json.com which converts any RSS feed to CORS-friendly JSON.
// Free tier: 10,000 requests/month — plenty for a static site.
// Optional: set VITE_RSS2JSON_API_KEY for higher limits (rss2json.com plans start free).
//
// -----------------------------------------------------------------
// CONFIGURE YOUR SUBSTACK PUBLICATION HERE
// e.g. if your publication is at https://indieoutdoors.substack.com
// set VITE_SUBSTACK_PUBLICATION to "indieoutdoors"
// Or set VITE_SUBSTACK_CUSTOM_DOMAIN for custom-domain publications
// e.g. VITE_SUBSTACK_CUSTOM_DOMAIN=mysite.com
// -----------------------------------------------------------------

const PUBLICATION = import.meta.env.VITE_SUBSTACK_PUBLICATION || 'indieoutdoors';
const CUSTOM_DOMAIN = import.meta.env.VITE_SUBSTACK_CUSTOM_DOMAIN || '';
const RSS2JSON_API_KEY = import.meta.env.VITE_RSS2JSON_API_KEY || '';

export const SUBSTACK_PUBLICATION = PUBLICATION;

// RSS feed URL — works for both standard *.substack.com and custom domains
function getRssFeedUrl(): string {
  if (CUSTOM_DOMAIN) return `https://${CUSTOM_DOMAIN}/feed`;
  return `https://${PUBLICATION}.substack.com/feed`;
}

// The Substack base URL for "Subscribe" / "Read more" links
export const SUBSTACK_BASE_URL = CUSTOM_DOMAIN
  ? `https://${CUSTOM_DOMAIN}`
  : `https://${PUBLICATION}.substack.com`;

export interface SubstackPost {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  post_date: string;
  cover_image: string | null;
  description: string;
  url: string;
  author: string;
}

interface Rss2JsonItem {
  title?: string;
  pubDate?: string;
  link?: string;
  guid?: string;
  author?: string;
  thumbnail?: string;
  description?: string;  // truncated HTML excerpt
  content?: string;      // full HTML (free posts only)
  categories?: string[];
}

interface Rss2JsonResponse {
  status: string;
  message?: string;
  items?: Rss2JsonItem[];
}

function slugFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    return path.replace(/^\/p\//, '').replace(/\/$/, '') || url;
  } catch {
    return url;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function itemToPost(item: Rss2JsonItem, index: number): SubstackPost {
  const url = item.link ?? item.guid ?? '';
  const slug = slugFromUrl(url);
  const rawDescription = item.description ?? item.content ?? '';
  const description = rawDescription ? stripHtml(rawDescription).slice(0, 280) : '';

  return {
    id: `${slug}-${index}`,
    title: item.title ?? 'Untitled',
    subtitle: description,
    slug,
    post_date: item.pubDate ?? '',
    cover_image: item.thumbnail ?? null,
    description,
    url,
    author: item.author ?? '',
  };
}

export async function fetchSubstackPosts(count = 12): Promise<SubstackPost[]> {
  const rssUrl = encodeURIComponent(getRssFeedUrl());
  const apiKey = RSS2JSON_API_KEY ? `&api_key=${RSS2JSON_API_KEY}` : '';
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=${count}${apiKey}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`rss2json error: ${response.status}`);
  }

  const data: Rss2JsonResponse = await response.json();

  if (data.status !== 'ok' || !data.items) {
    throw new Error(data.message ?? 'Failed to parse RSS feed');
  }

  return data.items.map((item, i) => itemToPost(item, i));
}

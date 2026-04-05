// Substack integration utilities
// Uses the undocumented but widely-used public JSON API
// Full post content is paywalled; we fetch metadata + truncated content for listings

// -----------------------------------------------------------------
// CONFIGURE YOUR SUBSTACK PUBLICATION HERE
// e.g. if your publication is at https://indieoutdoors.substack.com
// set SUBSTACK_PUBLICATION to "indieoutdoors"
// -----------------------------------------------------------------
export const SUBSTACK_PUBLICATION = import.meta.env.VITE_SUBSTACK_PUBLICATION || 'indieoutdoors';
export const SUBSTACK_BASE_URL = `https://${SUBSTACK_PUBLICATION}.substack.com`;

export interface SubstackPost {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  post_date: string;
  cover_image: string | null;
  description: string;
  canonical_url: string;
  type: string;
  audience: string;
  // Computed
  url: string;
}

function toSubstackPost(raw: Record<string, unknown>): SubstackPost {
  const slug = String(raw.slug ?? '');
  return {
    id: Number(raw.id ?? 0),
    title: String(raw.title ?? 'Untitled'),
    subtitle: String(raw.subtitle ?? raw.description ?? ''),
    slug,
    post_date: String(raw.post_date ?? raw.publishedAt ?? ''),
    cover_image: raw.cover_image ? String(raw.cover_image) : null,
    description: String(raw.description ?? raw.subtitle ?? ''),
    canonical_url: String(raw.canonical_url ?? `${SUBSTACK_BASE_URL}/p/${slug}`),
    type: String(raw.type ?? 'newsletter'),
    audience: String(raw.audience ?? 'everyone'),
    url: String(raw.canonical_url ?? `${SUBSTACK_BASE_URL}/p/${slug}`),
  };
}

export async function fetchSubstackPosts(limit = 12, offset = 0): Promise<SubstackPost[]> {
  const url = `${SUBSTACK_BASE_URL}/api/v1/posts?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Substack API error: ${response.status}`);
  }
  const data: unknown[] = await response.json();
  return data
    .filter(p => typeof p === 'object' && p !== null)
    .map(p => toSubstackPost(p as Record<string, unknown>))
    .filter(p => p.audience === 'everyone' || p.type === 'newsletter');
}

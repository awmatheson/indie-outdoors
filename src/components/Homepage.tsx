import { Box, Container, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, fonts, getOwnershipColor, getOwnershipLabel, slugify } from '../theme';
import { fetchSubstackPosts, SUBSTACK_BASE_URL, type SubstackPost } from '../utils/substackUtils';

// ── Featured spotlight ──────────────────────────────────────────
const SPOTLIGHT = {
  eyebrow: 'Made in Maine',
  name: 'Hyperlite Mountain Gear',
  slug: 'hyperlite-mountain-gear',
  location: 'Biddeford, Maine',
  founded: '2010',
  category: 'Packs & Shelters',
  description:
    'Mike St. Pierre spent years frustrated by packs that were either light but fragile or durable but heavy. He started Hyperlite in a barn in Maine and figured out how to use Dyneema — a fiber originally engineered for racing yacht sails — to make packs that are both. Still made in Biddeford, still independent.',
  tags: ['Independent', 'Made in USA', 'Ultralight'],
};

// ── Category browse ─────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Bikes',    sport: 'Cycling',   icon: '🚲' },
  { label: 'Surf',     sport: 'Surfing',   icon: '🏄' },
  { label: 'Climb',    sport: 'Climbing',  icon: '🧗' },
  { label: 'Camp',     sport: 'Camping',   icon: '⛺' },
  { label: 'Hike',     sport: 'Hiking',    icon: '🥾' },
  { label: 'Ski',      sport: 'Skiing',    icon: '⛷️' },
  { label: 'Fish',     sport: 'Fishing',   icon: '🎣' },
  { label: 'Paddle',   sport: 'Paddling',  icon: '🛶' },
];

// ── Featured indie brands ───────────────────────────────────────
const FEATURED = [
  {
    name: 'Patagonia',
    category: 'Apparel',
    hq: 'Ventura, CA',
    mfg: 'Global fair-trade factories',
    ownershipStatus: 'Private - Family Owned',
    description: 'Transferred ownership to a climate trust in 2022. Still designs and runs like a gear company.',
    bcorp: true,
    independent: true,
  },
  {
    name: 'Burton Snowboards',
    category: 'Snow Sports',
    hq: 'Burlington, VT',
    mfg: 'Vermont & Austria',
    ownershipStatus: 'Private - Family Owned',
    description: 'Jake Burton invented the category. His family still owns the company nearly 50 years on.',
    bcorp: true,
    independent: true,
  },
  {
    name: 'Trek Bicycle',
    category: 'Cycling',
    hq: 'Waterloo, WI',
    mfg: 'USA & Taiwan',
    ownershipStatus: 'Private - family owned',
    description: 'Over a billion in revenue. Still family-owned in a small Wisconsin town.',
    bcorp: false,
    independent: true,
  },
  {
    name: "Arc'teryx",
    category: 'Apparel / Alpine',
    hq: 'North Vancouver, BC',
    mfg: 'Canada & Vietnam',
    ownershipStatus: 'Public',
    description: 'Started as a climbing harness company. Now a $475M piece of a Chinese sports conglomerate.',
    bcorp: false,
    independent: false,
  },
];

// ── Topo background ─────────────────────────────────────────────
const TopoBackground = () => (
  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.07, pointerEvents: 'none' }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="topo" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#C4A882" strokeWidth="1">
            <ellipse cx="200" cy="200" rx="190" ry="80" /><ellipse cx="200" cy="200" rx="160" ry="65" />
            <ellipse cx="200" cy="200" rx="130" ry="52" /><ellipse cx="200" cy="200" rx="100" ry="40" />
            <ellipse cx="200" cy="200" rx="70" ry="28" /><ellipse cx="200" cy="200" rx="40" ry="16" />
            <ellipse cx="0" cy="0" rx="120" ry="50" /><ellipse cx="0" cy="0" rx="90" ry="38" />
            <ellipse cx="400" cy="400" rx="120" ry="50" /><ellipse cx="400" cy="400" rx="90" ry="38" />
            <ellipse cx="50" cy="350" rx="80" ry="35" /><ellipse cx="350" cy="50" rx="80" ry="35" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  </Box>
);

export default function Homepage() {
  const [recentPosts, setRecentPosts] = useState<SubstackPost[]>([]);

  useEffect(() => {
    fetchSubstackPosts(3).then(setRecentPosts).catch(() => setRecentPosts([]));
  }, []);

  return (
    <Box>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', bgcolor: colors.forest, color: '#FFFFFF', pt: { xs: 10, md: 16 }, pb: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <TopoBackground />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 700 }}>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.ridgeline, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ display: 'inline-block', width: 24, height: 1, bgcolor: colors.ridgeline }} />
              Founder stories · Brand discovery · Ownership records
            </Typography>

            <Typography variant="h1" sx={{ fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.5rem' }, color: '#FFFFFF', mb: 3, lineHeight: 1.05 }}>
              Discover the independent companies building the outdoor industry.
            </Typography>

            <Typography sx={{ fontFamily: fonts.sans, fontSize: { xs: '1.0625rem', md: '1.1875rem' }, color: 'rgba(255,255,255,0.7)', mb: 5, maxWidth: 540, lineHeight: 1.7 }}>
              Founder stories. Brand discovery. And a free directory of who owns what in outdoor gear.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box component={Link} to="/directory" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 3.5, py: 1.5, bgcolor: colors.trail, color: '#FFFFFF', fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', borderRadius: 1, transition: 'background-color 0.2s', '&:hover': { bgcolor: '#B5501F' } }}>
                Browse Independent Brands →
              </Box>
              <Box component={Link} to="/blog" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 3.5, py: 1.5, bgcolor: 'transparent', color: 'rgba(255,255,255,0.85)', fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 1, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' } }}>
                Read the Stories
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Featured Spotlight ─────────────────────────────────── */}
      <Box sx={{ bgcolor: colors.surface, borderBottom: `1px solid ${colors.ridgeline}22`, py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 4 }}>
            Founder Spotlight
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {SPOTLIGHT.tags.map(tag => (
                  <Box key={tag} sx={{ px: 1.5, py: 0.375, bgcolor: tag === 'Independent' ? `${colors.independent}18` : `${colors.ridgeline}18`, color: tag === 'Independent' ? colors.independent : colors.text, fontFamily: fonts.mono, fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, borderRadius: 0.5 }}>
                    {tag}
                  </Box>
                ))}
              </Box>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.trail, textTransform: 'uppercase', mb: 1 }}>
                {SPOTLIGHT.eyebrow}
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: colors.text, mb: 2, lineHeight: 1.1 }}>
                {SPOTLIGHT.name}
              </Typography>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.06em', color: colors.textSecondary, mb: 3 }}>
                {SPOTLIGHT.location} · Est. {SPOTLIGHT.founded} · {SPOTLIGHT.category}
              </Typography>
              <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.75, mb: 4, maxWidth: 520 }}>
                {SPOTLIGHT.description}
              </Typography>
              <Box component={Link} to={`/directory/${SPOTLIGHT.slug}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem', color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                View company profile →
              </Box>
            </Box>

            {/* Decorative stat panel */}
            <Box sx={{ bgcolor: colors.forest, borderRadius: 2, p: { xs: 4, md: 5 }, color: '#FFFFFF' }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 4 }}>
                Why it matters
              </Typography>
              {[
                { stat: 'Made in USA', note: 'Every pack and shelter built in Biddeford, Maine' },
                { stat: 'Dyneema®', note: 'Same fiber used in offshore racing yacht sails' },
                { stat: 'Independent', note: 'No outside investors. No corporate parent.' },
              ].map(({ stat, note }) => (
                <Box key={stat} sx={{ mb: 3, pb: 3, borderBottom: `1px solid rgba(196,168,130,0.15)`, '&:last-child': { mb: 0, pb: 0, borderBottom: 'none' } }}>
                  <Typography sx={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: '1rem', color: colors.ridgeline, mb: 0.5 }}>
                    {stat}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    {note}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Browse by Category ─────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: colors.bg }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 1.5 }}>
                Find your gear
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: colors.text }}>
                Browse by category
              </Typography>
            </Box>
            <Box component={Link} to="/directory" sx={{ fontFamily: fonts.sans, fontSize: '0.9rem', fontWeight: 600, color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              See all brands →
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(8, 1fr)' }, gap: 1.5 }}>
            {CATEGORIES.map(({ label, sport, icon }) => (
              <Box
                key={label}
                component={Link}
                to={`/directory?q=${encodeURIComponent(sport)}`}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 1, py: { xs: 2.5, md: 3 }, px: 1,
                  bgcolor: '#FFFFFF', border: `1px solid ${colors.surface}`, borderRadius: 1.5,
                  textDecoration: 'none', transition: 'all 0.15s',
                  '&:hover': { borderColor: colors.trail, bgcolor: `${colors.trail}08`, transform: 'translateY(-2px)', boxShadow: `0 4px 16px rgba(27,42,33,0.08)` },
                }}
              >
                <Box sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, lineHeight: 1 }}>{icon}</Box>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.text, fontWeight: 600 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── A few worth knowing ────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: colors.surface }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 1.5 }}>
                The directory
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: colors.text }}>
                A few worth knowing
              </Typography>
            </Box>
            <Box component={Link} to="/directory" sx={{ fontFamily: fonts.sans, fontSize: '0.9rem', fontWeight: 600, color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              View all companies →
            </Box>
          </Box>

          <Grid container spacing={2.5}>
            {FEATURED.map((company) => {
              const ownershipColor = getOwnershipColor(company.ownershipStatus);
              const ownershipLabel = getOwnershipLabel(company.ownershipStatus);
              return (
                <Grid item xs={12} sm={6} lg={3} key={company.name}>
                  <Box
                    component={Link}
                    to={`/directory/${slugify(company.name)}`}
                    sx={{
                      display: 'flex', flexDirection: 'column', height: '100%',
                      bgcolor: '#FFFFFF', border: `1px solid ${colors.surface}`,
                      borderTop: company.independent ? `3px solid ${colors.independent}` : `3px solid ${colors.conglomerate}`,
                      borderRadius: 1.5, p: 3, textDecoration: 'none',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: `0 4px 20px rgba(27,42,33,0.10)` },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontFamily: fonts.sans, fontSize: '1.0625rem', fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
                          {company.name}
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, mt: 0.5, letterSpacing: '0.04em' }}>
                          {company.category}
                        </Typography>
                      </Box>
                      {company.independent && (
                        <Box sx={{ px: 1.25, py: 0.375, bgcolor: `${colors.independent}18`, color: colors.independent, fontFamily: fonts.mono, fontSize: '0.5625rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, borderRadius: 0.5, flexShrink: 0, ml: 1 }}>
                          Independent
                        </Box>
                      )}
                    </Box>

                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.textSecondary, lineHeight: 1.65, flexGrow: 1 }}>
                      {company.description}
                    </Typography>

                    <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${colors.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
                        {company.hq}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: ownershipColor, flexShrink: 0 }} />
                        <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: ownershipColor, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                          {ownershipLabel}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ── Latest Stories ──────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: colors.bg }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 1.5 }}>
                  From the field
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: colors.text }}>
                  Latest stories
                </Typography>
              </Box>
              <Box component="a" href={SUBSTACK_BASE_URL} target="_blank" rel="noopener noreferrer" sx={{ fontFamily: fonts.sans, fontSize: '0.9rem', fontWeight: 600, color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                All stories →
              </Box>
            </Box>

            <Grid container spacing={3}>
              {recentPosts.map((post) => (
                <Grid item xs={12} md={4} key={post.id}>
                  <Box
                    component="a"
                    href={`${post.url}?utm_source=indie-outdoors`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'block', bgcolor: '#FFFFFF', border: `1px solid ${colors.surface}`,
                      borderRadius: 1.5, p: 3.5, textDecoration: 'none', height: '100%',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      '&:hover': { borderColor: colors.trail, boxShadow: `0 4px 20px rgba(27,42,33,0.08)` },
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.textSecondary, mb: 2 }}>
                      {post.post_date ? new Date(post.post_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </Typography>
                    <Typography variant="h3" sx={{ fontSize: '1.25rem', color: colors.text, mb: 1.5, lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: colors.textSecondary, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.subtitle || post.description}
                    </Typography>
                    <Typography sx={{ mt: 2, fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.trail }}>
                      Read on Substack →
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* ── The Landscape (reference) ───────────────────────────── */}
      <Box sx={{ position: 'relative', bgcolor: colors.forest, py: { xs: 7, md: 10 }, overflow: 'hidden' }}>
        <TopoBackground />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6, alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
                The Landscape
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.5rem' }, color: '#FFFFFF', mb: 2.5 }}>
                Who owns what
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, mb: 4, maxWidth: 420 }}>
                Arc'teryx, Salomon, and Peak Performance — one owner. The North Face, Smartwool, Icebreaker — another. An interactive map of every parent company and brand we track.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box component={Link} to="/ownership-map" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.25, bgcolor: colors.ridgeline, color: colors.forest, fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', borderRadius: 1, transition: 'opacity 0.2s', '&:hover': { opacity: 0.9 } }}>
                  Open the Map →
                </Box>
                <Box component={Link} to="/directory" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.25, border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.75)', fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', borderRadius: 1, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' } }}>
                  Browse Directory
                </Box>
              </Box>
            </Box>

            {/* Mini stat strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { value: '200+', label: 'Brands tracked' },
                { value: '~66%', label: 'Still independent' },
                { value: '22', label: 'Ownership groups' },
              ].map(({ value, label }) => (
                <Box key={label} sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: { xs: '1.625rem', md: '2rem' }, fontWeight: 600, color: colors.ridgeline, lineHeight: 1, mb: 0.75 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <Box sx={{ bgcolor: colors.surface, py: { xs: 8, md: 10 }, borderTop: `1px solid ${colors.ridgeline}22` }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}>
              Newsletter
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.5rem' }, color: colors.text, mb: 2 }}>
              New stories, as they're published
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '1.0625rem', mb: 4, maxWidth: 440, mx: 'auto', lineHeight: 1.6 }}>
              Founder spotlights, brand discovery, and the occasional deep dive into who owns what.
            </Typography>
            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', gap: 1.5, maxWidth: 420, mx: 'auto', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Box component="input" type="email" placeholder="your@email.com" sx={{ flexGrow: 1, px: 2, py: 1.5, border: `1px solid ${colors.ridgeline}`, borderRadius: 1, fontFamily: fonts.sans, fontSize: '0.9375rem', bgcolor: '#FFFFFF', color: colors.text, outline: 'none', '&:focus': { borderColor: colors.trail }, width: { xs: '100%', sm: 'auto' } }} />
              <Box component="button" type="submit" sx={{ px: 3, py: 1.5, bgcolor: colors.trail, color: '#FFFFFF', fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem', border: 'none', borderRadius: 1, cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { bgcolor: '#B5501F' }, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}>
                Subscribe
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}

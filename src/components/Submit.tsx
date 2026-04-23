import { Box, Container, Typography } from '@mui/material';
import { colors, fonts } from '../theme';

const CSV_FIELDS = [
  { name: 'Company',                               desc: 'Official company name' },
  { name: 'Business Category',                     desc: 'Apparel / Equipment / Footwear / Accessories / Retailer' },
  { name: 'Main Sport Focus',                      desc: 'Comma-separated sports' },
  { name: 'Year Founded',                          desc: '4-digit year' },
  { name: 'Ownership Status',                      desc: 'Independent – Family Owned, Private Equity Owned, Subsidiary, etc.' },
  { name: 'Parent Company',                        desc: '"Independent" if none' },
  { name: 'Headquarters',                          desc: 'City, State, Country' },
  { name: 'Main Manufacturing',                    desc: 'Where products are physically made' },
  { name: 'Environmental & Sustainability Policies', desc: 'B-Corp, 1% for Planet, bluesign, etc.' },
];

export default function Submit() {
  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            Contribute
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
            Add a Company
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 520 }}>
            The directory is open source. Anyone can add a brand, fix outdated ownership data, or improve an existing entry.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        {/* How it works */}
        <Box sx={{ mb: 7 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 3 }}>
            How it works
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              {
                step: '01',
                title: 'Open the data file on GitHub',
                body: (
                  <>
                    All company data lives in{' '}
                    <Box component="a" href="https://github.com/awmatheson/indie-outdoors/blob/main/public/companies.csv" target="_blank" rel="noopener noreferrer" sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: fonts.mono, fontSize: '0.875em' }}>
                      public/companies.csv
                    </Box>
                    {' '}on GitHub. It's a plain CSV — you can edit it directly in the browser using the pencil icon.
                  </>
                ),
              },
              {
                step: '02',
                title: 'Add or edit a row',
                body: 'Add a new row for a missing company, or update fields in an existing row. Include sources in the Details field where possible — press releases, news articles, or the company\'s own About page.',
              },
              {
                step: '03',
                title: 'Open a pull request',
                body: 'GitHub will walk you through creating a pull request from your edit. Add a short note about what you changed and why. We\'ll review it and merge it in.',
              },
            ].map(({ step, title, body }) => (
              <Box key={step} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.75rem', color: colors.ridgeline, lineHeight: 1, pt: 0.25, flexShrink: 0, width: 24 }}>
                  {step}
                </Typography>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: colors.text, mb: 0.5 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9375rem', color: colors.textSecondary, lineHeight: 1.7 }}>
                    {body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 8 }}>
          <Box
            component="a"
            href="https://github.com/awmatheson/indie-outdoors/edit/main/public/companies.csv"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-block',
              bgcolor: colors.trail, color: '#FFFFFF',
              fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem',
              textDecoration: 'none', borderRadius: 1, px: 3, py: 1.25,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: '#B5501F' },
            }}
          >
            Edit companies.csv on GitHub →
          </Box>
          <Box
            component="a"
            href="https://github.com/awmatheson/indie-outdoors/issues/new?title=Company+suggestion&body=%23%23+Company+name%0A%0A%23%23+Website%0A%0A%23%23+What+to+add+or+correct%0A"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-block',
              fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem',
              color: colors.trail, textDecoration: 'none',
              border: `1px solid ${colors.trail}`,
              borderRadius: 1, px: 3, py: 1.25,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'rgba(197, 90, 35, 0.06)' },
            }}
          >
            Open a GitHub issue
          </Box>
        </Box>

        {/* CSV schema reference */}
        <Box>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2.5 }}>
            Data fields
          </Typography>
          <Box sx={{ border: `1px solid ${colors.surface}`, borderRadius: 1.5, overflow: 'hidden' }}>
            {CSV_FIELDS.map(({ name, desc }, i) => (
              <Box
                key={name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '2fr 3fr' },
                  gap: { xs: 0.25, sm: 2 },
                  px: 3, py: 1.75,
                  bgcolor: i % 2 === 0 ? '#FFFFFF' : colors.bg,
                  borderBottom: i < CSV_FIELDS.length - 1 ? `1px solid ${colors.surface}` : 'none',
                }}
              >
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.8125rem', color: colors.text, fontWeight: 500 }}>
                  {name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.textSecondary, lineHeight: 1.6 }}>
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

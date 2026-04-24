import { Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { colors, fonts } from '../theme';

export default function About() {
  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            The Project
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
            About Indie Outdoors
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 520 }}>
            Stories of independent outdoor companies and the people who build them.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>

        {/* The stories */}
        <Box sx={{ mb: 7 }}>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.85, mb: 2.5 }}>
            The outdoor industry is full of people building remarkable companies. Most of them don't get the attention they deserve.
          </Typography>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.85, mb: 2.5 }}>
            There's the founder in Biddeford, Maine who builds ultralight backpacks in a 180-year-old textile mill, using materials originally designed for America's Cup racing sails, and refuses to move manufacturing overseas. The guys in Chicoutimi, Quebec who make aluminum mountain bikes where the raw aluminum comes from — powered by hydroelectric — and brought one of their production lines back from Asia to do it. The cottage quilt-maker in Minnesota who started in his apartment and now outfits thru-hikers on every long trail in North America.
          </Typography>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.85 }}>
            These are real companies, run by real people, making real things. There are hundreds more like them across every outdoor category — bikes, surf, climb, camp, hike, ski, fish, paddle. We want a place to tell their stories and learn from them.
          </Typography>
        </Box>

        {/* What you'll get */}
        <Box sx={{ mb: 7 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 3 }}>
            What you'll get
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {[
              {
                title: 'Founder spotlights',
                body: 'Longer profiles of independent outdoor companies and the people running them. Specifics: where things are made, what materials they use, how the company is actually structured, what the founder\'s background is. After reading, you\'ll know a company you didn\'t know before and have a clear sense of why they\'re worth knowing.',
              },
              {
                title: 'Brand discovery',
                body: 'Shorter posts introducing a handful of independent brands in a specific category.',
              },
              {
                title: 'The landscape',
                body: 'The outdoor industry has consolidated a lot over the past couple of decades. Brands you think of as core are often owned by holding companies, private equity, or giant conglomerates. We dig into those stories when they\'re worth digging into — especially when they illuminate why the independent companies we feature are doing things differently.',
              },
              {
                title: 'The directory',
                body: (
                  <>
                    An{' '}
                    <Box component={Link} to="/directory" sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      open-source, searchable database
                    </Box>
                    {' '}of outdoor brands tagged by ownership, location, and manufacturing. Filter for independents, B-Corps, made-in-USA, employee-owned. Whatever matters to you.
                  </>
                ),
              },
            ].map(({ title, body }) => (
              <Box key={title} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Box sx={{ width: 3, flexShrink: 0, alignSelf: 'stretch', bgcolor: colors.ridgeline, borderRadius: 1, mt: 0.25, minHeight: 20 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors.text, mb: 0.5 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9375rem', color: colors.textSecondary, lineHeight: 1.75 }}>
                    {body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* What this isn't */}
        <Box sx={{ mb: 7 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 3 }}>
            What this isn't
          </Typography>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.85, mb: 2.5 }}>
            This isn't a crusade against big companies. Plenty of brands owned by conglomerates still make excellent products. The North Face still makes good jackets. Arc'teryx is as good as it's ever been. Ownership change doesn't automatically ruin a brand, and we're not interested in pretending otherwise.
          </Typography>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.85 }}>
            It's also not gear reviews. There are great publications for that. We care about the companies — how they're built, who builds them, where the work happens, and why the people making the gear chose to do it the way they do.
          </Typography>
        </Box>

        {/* Data methodology */}
        <Box sx={{ borderTop: `1px solid ${colors.surface}`, pt: 5 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}>
            About the data
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: colors.textSecondary, lineHeight: 1.75, mb: 1.5 }}>
            Company data is sourced from public filings, press releases, corporate websites, and reputable business journalism. Ownership classifications are our own interpretation of available information.
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: colors.textSecondary, lineHeight: 1.75 }}>
            The directory is open source. If you notice an error or have updated information,{' '}
            <Box component={Link} to="/submit" sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              you can edit it directly on GitHub
            </Box>.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

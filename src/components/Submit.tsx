import { Box, Container, Typography } from '@mui/material';
import { colors, fonts } from '../theme';

export default function Submit() {
  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            Contribute
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
            Submit a Company
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 480 }}>
            Know a brand we're missing? Have updated ownership information?
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3.5, md: 5 }, border: `1px solid ${colors.surface}` }}>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8, mb: 3 }}>
            Help us keep the directory accurate and complete. Send us:
          </Typography>
          <Box component="ul" sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8, pl: 3, mb: 4 }}>
            <Box component="li" sx={{ mb: 1 }}>A company we haven't tracked yet</Box>
            <Box component="li" sx={{ mb: 1 }}>An ownership change or acquisition</Box>
            <Box component="li" sx={{ mb: 1 }}>A correction to existing data</Box>
            <Box component="li">Updated sustainability information</Box>
          </Box>
          <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8 }}>
            Please open an issue or pull request on our{' '}
            <Box component="a" href="https://github.com/awmatheson/indie-outdoors" target="_blank" rel="noopener noreferrer" sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              GitHub repository
            </Box>
            {' '}with your submission. Include sources where possible — public records, press releases, or reputable business journalism.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

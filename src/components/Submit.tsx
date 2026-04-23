import { useState } from 'react';
import { Box, Container, Typography, TextField, MenuItem, Button, Alert, Divider } from '@mui/material';
import { colors, fonts } from '../theme';

// Set VITE_FORMSPREE_ENDPOINT to your Formspree form URL, e.g.:
//   https://formspree.io/f/abcdefgh
// Sign up free at formspree.io — 50 submissions/month on the free tier.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';

const SUBMISSION_TYPES = [
  { value: 'new-company',      label: 'New company to add' },
  { value: 'ownership-update', label: 'Ownership update or acquisition' },
  { value: 'correction',       label: 'Data correction' },
  { value: 'other',            label: 'Other' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Submit() {
  const [type, setType]       = useState('new-company');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) return;

    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ type, company, website, details, email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const labelSx = {
    fontFamily: fonts.mono,
    fontSize: '0.6875rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
    mb: 0.75,
    display: 'block',
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      '& fieldset': { borderColor: colors.surface },
      '&:hover fieldset': { borderColor: colors.ridgeline },
      '&.Mui-focused fieldset': { borderColor: colors.trail },
    },
    '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '0.9375rem' },
  };

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            Contribute
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
            Submit a Company
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 480 }}>
            Know a brand we're missing? Spotted an ownership change? Help us keep the directory accurate.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        {FORMSPREE_ENDPOINT ? (
          /* ── Formspree form ── */
          <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3.5, md: 5 }, border: `1px solid ${colors.surface}` }}>
            {status === 'success' ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: '1.5rem', color: colors.forest, mb: 2 }}>
                  Thanks for the tip!
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '0.9375rem', mb: 3 }}>
                  We'll research the submission and add it to the directory if it fits. We'll follow up if we have questions.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => { setStatus('idle'); setCompany(''); setWebsite(''); setDetails(''); setEmail(''); }}
                  sx={{ fontFamily: fonts.sans, fontWeight: 600, borderColor: colors.trail, color: colors.trail, borderRadius: 1, '&:hover': { borderColor: '#B5501F', bgcolor: 'transparent' } }}
                >
                  Submit another
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {status === 'error' && (
                  <Alert severity="error" sx={{ mb: 3, fontFamily: fonts.sans }}>
                    Something went wrong. Try again or use the GitHub link below.
                  </Alert>
                )}

                {/* Submission type */}
                <Box sx={{ mb: 3 }}>
                  <Typography component="label" htmlFor="submit-type" sx={labelSx}>
                    Type of submission
                  </Typography>
                  <TextField
                    id="submit-type"
                    select
                    fullWidth
                    value={type}
                    onChange={e => setType(e.target.value)}
                    size="small"
                    sx={fieldSx}
                  >
                    {SUBMISSION_TYPES.map(t => (
                      <MenuItem key={t.value} value={t.value} sx={{ fontFamily: fonts.sans, fontSize: '0.9375rem' }}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Company name */}
                <Box sx={{ mb: 3 }}>
                  <Typography component="label" htmlFor="submit-company" sx={labelSx}>
                    Company name <Box component="span" sx={{ color: colors.trail }}>*</Box>
                  </Typography>
                  <TextField
                    id="submit-company"
                    fullWidth
                    required
                    placeholder="e.g. Hyperlite Mountain Gear"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Website */}
                <Box sx={{ mb: 3 }}>
                  <Typography component="label" htmlFor="submit-website" sx={labelSx}>
                    Website <Box component="span" sx={{ color: colors.textSecondary, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</Box>
                  </Typography>
                  <TextField
                    id="submit-website"
                    fullWidth
                    placeholder="https://..."
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography component="label" htmlFor="submit-details" sx={labelSx}>
                    Details <Box component="span" sx={{ color: colors.textSecondary, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</Box>
                  </Typography>
                  <TextField
                    id="submit-details"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Anything we should know — ownership info, source links, corrections…"
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    sx={fieldSx}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ mb: 4 }}>
                  <Typography component="label" htmlFor="submit-email" sx={labelSx}>
                    Your email <Box component="span" sx={{ color: colors.textSecondary, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — only used to follow up)</Box>
                  </Typography>
                  <TextField
                    id="submit-email"
                    fullWidth
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!company.trim() || status === 'sending'}
                  sx={{
                    bgcolor: colors.trail, color: '#FFFFFF',
                    fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem',
                    px: 4, py: 1.25, borderRadius: 1,
                    '&:hover': { bgcolor: '#B5501F' },
                    '&:disabled': { bgcolor: colors.surface, color: colors.textSecondary },
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Submit'}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          /* ── Formspree not configured: point to GitHub ── */
          <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3.5, md: 5 }, border: `1px solid ${colors.surface}` }}>
            <Alert severity="info" sx={{ mb: 3, fontFamily: fonts.sans }}>
              The submission form isn't set up yet — please use GitHub for now.
            </Alert>
            <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8, mb: 2 }}>
              Open an issue or pull request on our{' '}
              <Box
                component="a"
                href="https://github.com/awmatheson/indie-outdoors"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                GitHub repository
              </Box>
              {' '}with your submission. Include sources where possible.
            </Typography>
          </Box>
        )}

        {/* GitHub alternative — always shown */}
        <Divider sx={{ my: 5, borderColor: colors.surface }} />

        <Box>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}>
            Prefer GitHub?
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: colors.textSecondary, lineHeight: 1.7, mb: 1.5 }}>
            The data lives in{' '}
            <Box
              component="a"
              href="https://github.com/awmatheson/indie-outdoors/blob/main/public/companies.csv"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: fonts.mono, fontSize: '0.8125rem' }}
            >
              public/companies.csv
            </Box>
            {' '}on GitHub. If you're comfortable with Git, a pull request is the fastest path to getting a company added.
          </Typography>
          <Box
            component="a"
            href="https://github.com/awmatheson/indie-outdoors/issues/new?title=Company+submission&body=%23%23+Company+name%0A%0A%23%23+Website%0A%0A%23%23+What+to+add+or+correct%0A"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-block',
              mt: 1,
              fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.875rem',
              color: colors.trail, textDecoration: 'none',
              border: `1px solid ${colors.trail}`,
              borderRadius: 1, px: 2.5, py: 0.875,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'rgba(197, 90, 35, 0.06)' },
            }}
          >
            Open a GitHub issue →
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

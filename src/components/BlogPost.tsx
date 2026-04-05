import { useParams, Link, Navigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blogUtils';
import { colors, fonts } from '../theme';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Post header — full bleed */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: colors.forest,
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 8 },
          overflow: 'hidden',
        }}
      >
        {/* Topo background */}
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="topo-post" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="#C4A882" strokeWidth="1">
                  <ellipse cx="200" cy="200" rx="190" ry="80" />
                  <ellipse cx="200" cy="200" rx="160" ry="65" />
                  <ellipse cx="200" cy="200" rx="130" ry="52" />
                  <ellipse cx="200" cy="200" rx="100" ry="40" />
                  <ellipse cx="200" cy="200" rx="70" ry="28" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo-post)" />
          </svg>
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <Box component={Link} to="/blog" sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', '&:hover': { color: colors.ridgeline } }}>
              Blog
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>/</Typography>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.ridgeline }}>
              {post.title}
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 740 }}>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.1em', color: colors.ridgeline, mb: 2.5 }}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}{post.author}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', lineHeight: 1.1 }}>
              {post.title}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Post content */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: 1.5,
            p: { xs: 3.5, md: 6 },
            border: `1px solid ${colors.surface}`,
            '& h2': {
              fontFamily: fonts.serif,
              fontSize: { xs: '1.75rem', md: '2rem' },
              color: colors.text,
              fontWeight: 400,
              mt: 5,
              mb: 2,
              lineHeight: 1.25,
            },
            '& h3': {
              fontFamily: fonts.serif,
              fontSize: { xs: '1.375rem', md: '1.5rem' },
              color: colors.text,
              fontWeight: 400,
              mt: 4,
              mb: 1.5,
            },
            '& p': {
              fontFamily: fonts.sans,
              fontSize: '1.0625rem',
              color: colors.text,
              lineHeight: 1.8,
              mb: 2,
            },
            '& ul, & ol': {
              fontFamily: fonts.sans,
              fontSize: '1.0625rem',
              color: colors.text,
              lineHeight: 1.8,
              mb: 2,
              pl: 3,
              '& li': { mb: 0.75 },
            },
            '& strong': { color: colors.text, fontWeight: 700 },
            '& a': {
              color: colors.trail,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': { color: colors.forest },
            },
            '& code': {
              fontFamily: fonts.mono,
              fontSize: '0.875em',
              bgcolor: colors.surface,
              px: '6px',
              py: '2px',
              borderRadius: '3px',
              color: colors.forest,
            },
            '& pre': {
              bgcolor: colors.forest,
              p: 3,
              borderRadius: 1,
              overflow: 'auto',
              mb: 2,
              '& code': { bgcolor: 'transparent', color: colors.ridgeline, px: 0, py: 0 },
            },
            '& blockquote': {
              borderLeft: `4px solid ${colors.ridgeline}`,
              pl: 3,
              ml: 0,
              mr: 0,
              fontStyle: 'italic',
              color: colors.textSecondary,
              fontFamily: fonts.serif,
              fontSize: '1.125rem',
              lineHeight: 1.6,
            },
            '& hr': {
              border: 'none',
              borderTop: `1px solid ${colors.surface}`,
              my: 4,
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </Box>

        {/* Back link */}
        <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${colors.surface}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box component={Link} to="/blog" sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem', color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            ← Back to Blog
          </Box>
          <Box component={Link} to="/directory" sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.9375rem', color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Explore the Directory →
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPost;

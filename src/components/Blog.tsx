import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { colors, fonts } from '../theme';
import { fetchSubstackPosts, SUBSTACK_BASE_URL, type SubstackPost } from '../utils/substackUtils';

const Blog = () => {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubstackPosts(20)
      .then(setPosts)
      .catch(err => {
        console.error(err);
        setError('Could not load posts from Substack. Check back soon.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography
            sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}
          >
            Writing
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
                Notes
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 480 }}>
                On ownership, acquisitions, and the business of the outdoor industry.
              </Typography>
            </Box>
            <Box
              component="a"
              href={`${SUBSTACK_BASE_URL}?utm_source=indie-outdoors`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 1,
                border: `1px solid rgba(196,168,130,0.4)`,
                borderRadius: 1,
                color: colors.ridgeline,
                fontFamily: fonts.mono,
                fontSize: '0.6875rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': { borderColor: colors.ridgeline, bgcolor: 'rgba(196,168,130,0.1)' },
              }}
            >
              Subscribe on Substack →
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Posts */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress sx={{ color: colors.trail }} />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: '1.375rem', color: colors.textSecondary, mb: 2 }}>
              {error}
            </Typography>
            <Box
              component="a"
              href={SUBSTACK_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontFamily: fonts.sans, fontWeight: 600, color: colors.trail, fontSize: '0.9375rem' }}
            >
              Read directly on Substack →
            </Box>
          </Box>
        )}

        {!loading && !error && posts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: '1.5rem', color: colors.textSecondary }}>
              No posts yet. Check back soon.
            </Typography>
          </Box>
        )}

        {!loading && !error && posts.length > 0 && (
          <Grid container spacing={3}>
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} featured={i === 0} />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

function PostCard({ post, featured }: { post: SubstackPost; featured: boolean }) {
  const dateStr = post.post_date
    ? new Date(post.post_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Grid item xs={12} md={featured ? 12 : 6} lg={featured ? 8 : 4}>
      <Box
        component="a"
        href={`${post.url}?utm_source=indie-outdoors`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'block',
          bgcolor: '#FFFFFF',
          border: `1px solid ${colors.surface}`,
          borderRadius: 1.5,
          overflow: 'hidden',
          textDecoration: 'none',
          height: '100%',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: colors.trail,
            boxShadow: '0 4px 24px rgba(27,42,33,0.07)',
          },
        }}
      >
        {/* Cover image */}
        {post.cover_image && (
          <Box
            component="img"
            src={post.cover_image}
            alt={post.title}
            sx={{
              width: '100%',
              height: featured ? { xs: 220, md: 320 } : 180,
              objectFit: 'cover',
              display: 'block',
              bgcolor: colors.surface,
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}

        <Box sx={{ p: featured ? { xs: 3.5, md: 5 } : 3 }}>
          {/* Date */}
          {dateStr && (
            <Typography
              sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.textSecondary, mb: 2 }}
            >
              {dateStr}
            </Typography>
          )}

          <Typography
            variant={featured ? 'h2' : 'h3'}
            sx={{
              fontSize: featured ? { xs: '1.75rem', md: '2.25rem' } : '1.25rem',
              color: colors.text,
              mb: 1.5,
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          {(post.subtitle || post.description) && (
            <Typography
              sx={{
                fontSize: featured ? '1.0625rem' : '0.9rem',
                color: colors.textSecondary,
                lineHeight: 1.7,
                display: '-webkit-box',
                WebkitLineClamp: featured ? 4 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2.5,
              }}
            >
              {post.subtitle || post.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.trail }}>
              Read on Substack →
            </Typography>
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                bgcolor: colors.surface,
                borderRadius: 0.5,
                fontFamily: fonts.mono,
                fontSize: '0.5625rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.textSecondary,
              }}
            >
              External
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default Blog;

import { Box, Container, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/blogUtils';
import { colors, fonts } from '../theme';

const Blog = () => {
  const posts = getAllPosts();

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            From the Field
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
            Dispatches
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 480 }}>
            Notes on ownership, sustainability, and independence in the outdoor industry.
          </Typography>
        </Container>
      </Box>

      {/* Posts */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        {posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: '1.5rem', color: colors.textSecondary }}>
              No posts yet. Check back soon.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post, i) => (
              <Grid item xs={12} md={i === 0 ? 12 : 6} lg={i === 0 ? 8 : 4} key={post.slug}>
                <Box
                  component={Link}
                  to={`/blog/${post.slug}`}
                  sx={{
                    display: 'block',
                    bgcolor: '#FFFFFF',
                    border: `1px solid ${colors.surface}`,
                    borderRadius: 1.5,
                    p: i === 0 ? { xs: 3.5, md: 5 } : 3,
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      borderColor: colors.trail,
                      boxShadow: '0 4px 24px rgba(27,42,33,0.07)',
                    },
                  }}
                >
                  {/* Date / Author */}
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.textSecondary, mb: 2 }}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {' · '}{post.author}
                  </Typography>

                  <Typography
                    variant={i === 0 ? 'h2' : 'h3'}
                    sx={{
                      fontSize: i === 0 ? { xs: '1.75rem', md: '2.25rem' } : '1.25rem',
                      color: colors.text,
                      mb: 1.5,
                      lineHeight: 1.25,
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: i === 0 ? '1.0625rem' : '0.9rem',
                      color: colors.textSecondary,
                      lineHeight: 1.7,
                      display: '-webkit-box',
                      WebkitLineClamp: i === 0 ? 4 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2.5,
                    }}
                  >
                    {post.excerpt}
                  </Typography>

                  <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.trail }}>
                    Read more →
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Blog;

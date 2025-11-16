import { Box, Paper, Typography, Stack, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { getPostsGroupedByDate } from '../utils/blogUtils';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: '"Work Sans", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  palette: {
    primary: {
      main: '#C75C2C',
    },
    secondary: {
      main: '#2A5B5B',
    },
    background: {
      default: '#FAF6F1',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '2px solid #2A2A2A',
          boxShadow: '4px 4px 0px #2A2A2A',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '2px solid #2A2A2A',
          boxShadow: '4px 4px 0px #2A2A2A',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '6px 6px 0px #2A2A2A',
          },
        },
      },
    },
  },
});

const Blog = () => {
  const groupedPosts = getPostsGroupedByDate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: 'calc(100vh - 200px)',
        width: '100%',
        mx: { xs: -2, sm: -3, md: -4 },
      }}>
        <Typography 
          variant="h1" 
          align="center" 
          sx={{ 
            mb: 4, 
            color: '#2A2A2A',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          Blog
        </Typography>
        
        <Box sx={{ width: '100%' }}>
          {groupedPosts.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="#2A2A2A">
                No blog posts yet. Check back soon!
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={4}>
              {groupedPosts.map((group) => (
                <Box key={`${group.year}-${group.month}`}>
                  <Typography 
                    variant="h2"
                    sx={{
                      mb: 3,
                      color: '#2A2A2A',
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      borderBottom: '3px solid #C75C2C',
                      pb: 1,
                      px: { xs: 2, sm: 3, md: 4 },
                    }}
                  >
                    {group.monthName}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                    {group.posts.map((post) => (
                      <Grid item xs={12} sm={6} key={post.slug}>
                        <Card>
                          <CardActionArea 
                            component={Link}
                            to={`/blog/${post.slug}`}
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                          >
                            {post.thumbnail ? (
                              <CardMedia
                                component="img"
                                height="200"
                                image={post.thumbnail}
                                alt={post.title}
                                sx={{
                                  width: '100%',
                                  objectFit: 'cover',
                                  backgroundColor: '#FAF6F1',
                                }}
                                onError={(e) => {
                                  // Hide image if it fails to load
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 200,
                                  backgroundColor: '#FAF6F1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderBottom: '2px solid #2A2A2A',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: '#C75C2C',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    px: 2,
                                  }}
                                >
                                  {post.title}
                                </Typography>
                              </Box>
                            )}
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                              {post.thumbnail && (
                                <Typography 
                                  variant="h5" 
                                  component="h3"
                                  sx={{ 
                                    color: '#C75C2C',
                                    mb: 1,
                                    fontWeight: 700,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {post.title}
                                </Typography>
                              )}
                              
                              <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{ color: '#2A5B5B', fontWeight: 500 }}
                                >
                                  {new Date(post.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ color: '#2A5B5B' }}
                                >
                                  • {post.author}
                                </Typography>
                              </Stack>
                              
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#2A2A2A', 
                                  lineHeight: 1.6,
                                  flexGrow: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {post.excerpt}
                              </Typography>
                              
                              <Typography 
                                variant="body2"
                                sx={{
                                  color: '#C75C2C',
                                  fontWeight: 600,
                                  mt: 2,
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                Read more →
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Blog;

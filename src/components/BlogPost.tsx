import { useParams, Link, Navigate } from 'react-router-dom';
import { Box, Paper, Typography, Stack, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blogUtils';
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
      marginTop: '2rem',
      marginBottom: '1rem',
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
      marginTop: '1.5rem',
      marginBottom: '0.75rem',
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
  },
});

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%' }}>
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <Button
            component={Link}
            to="/blog"
            sx={{
              mb: 3,
              color: '#C75C2C',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(199, 92, 44, 0.1)',
              },
            }}
          >
            ← Back to Blog
          </Button>

          <Paper sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Typography 
              variant="h1" 
              sx={{ 
                mb: 2,
                color: '#2A2A2A',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              {post.title}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap' }}>
              <Typography 
                variant="body1" 
                sx={{ color: '#2A5B5B', fontWeight: 500 }}
              >
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: '#2A5B5B' }}
              >
                by {post.author}
              </Typography>
            </Stack>

            <Box
              sx={{
                '& h2': {
                  color: '#2A2A2A',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  fontWeight: 700,
                  mt: 4,
                  mb: 2,
                },
                '& h3': {
                  color: '#2A2A2A',
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  fontWeight: 600,
                  mt: 3,
                  mb: 1.5,
                },
                '& p': {
                  color: '#2A2A2A',
                  lineHeight: 1.8,
                  mb: 2,
                  fontSize: '1.1rem',
                },
                '& ul, & ol': {
                  color: '#2A2A2A',
                  lineHeight: 1.8,
                  mb: 2,
                  pl: 3,
                  '& li': {
                    mb: 1,
                  },
                },
                '& strong': {
                  color: '#2A2A2A',
                  fontWeight: 600,
                },
                '& a': {
                  color: '#C75C2C',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
                '& code': {
                  backgroundColor: '#FAF6F1',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                },
                '& pre': {
                  backgroundColor: '#FAF6F1',
                  padding: '1rem',
                  borderRadius: '8px',
                  overflow: 'auto',
                  border: '1px solid #2A2A2A',
                  '& code': {
                    backgroundColor: 'transparent',
                    padding: 0,
                  },
                },
                '& blockquote': {
                  borderLeft: '4px solid #C75C2C',
                  pl: 2,
                  ml: 0,
                  fontStyle: 'italic',
                  color: '#2A5B5B',
                },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </Box>
          </Paper>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/blog"
              variant="contained"
              sx={{
                bgcolor: '#C75C2C',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#A04822',
                },
              }}
            >
              Back to Blog
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default BlogPost;


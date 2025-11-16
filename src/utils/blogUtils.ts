import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  thumbnail?: string;
  content: string;
}

// Import all markdown files from the blog directory
// Using glob pattern that Vite can resolve from project root
const blogModules = import.meta.glob('/src/content/blog/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
}) as Record<string, string>;

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, content] of Object.entries(blogModules)) {
    // Extract slug from path - handle different path formats
    const pathParts = path.split('/');
    const filename = pathParts[pathParts.length - 1];
    const slug = filename.replace('.md', '');
    
    const { data, content: markdownContent } = matter(content as string);
    
    posts.push({
      slug,
      title: data.title || 'Untitled',
      date: data.date || '',
      author: data.author || 'Unknown',
      excerpt: data.excerpt || '',
      thumbnail: data.thumbnail || undefined,
      content: markdownContent,
    });
  }

  // Sort by date, newest first
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export interface GroupedPosts {
  year: number;
  month: number;
  monthName: string;
  posts: BlogPost[];
}

export function getPostsGroupedByDate(): GroupedPosts[] {
  const posts = getAllPosts();
  const grouped: { [key: string]: BlogPost[] } = {};

  posts.forEach(post => {
    const date = new Date(post.date);
    if (isNaN(date.getTime())) return; // Skip invalid dates
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(post);
  });

  // Convert to array and sort by date (newest first)
  return Object.entries(grouped)
    .map(([key, posts]) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month);
      return {
        year,
        month,
        monthName: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}


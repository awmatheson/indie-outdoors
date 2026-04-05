import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Homepage from './components/Homepage';
import Directory from './components/Directory';
import CompanyProfile from './components/CompanyProfile';
import OwnershipMap from './components/OwnershipMap';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import About from './components/About';
import Submit from './components/Submit';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/indie-outdoors">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="directory" element={<Directory />} />
            <Route path="directory/:slug" element={<CompanyProfile />} />
            <Route path="ownership-map" element={<OwnershipMap />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="about" element={<About />} />
            <Route path="submit" element={<Submit />} />
            {/* Legacy redirect from old dashboard route */}
            <Route path="dashboard" element={<Navigate to="/directory" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

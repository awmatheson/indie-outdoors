import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel, Stack, Slider, createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';

// Create theme with indie outdoors colors
const theme = createTheme({
  typography: {
    fontFamily: '"Work Sans", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  palette: {
    primary: {
      main: '#C75C2C', // Terracotta orange
    },
    secondary: {
      main: '#2A5B5B', // Teal/forest green
    },
    background: {
      default: '#FAF6F1', // Light cream background
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#2A2A2A',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#C75C2C',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2A2A2A',
            borderWidth: 2,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C75C2C',
          },
        },
      },
    },
  },
});

interface CompanyData {
  Company: string;
  'Main Sport Focus': string;
  'Year Founded': string;
  Financials: string;
  'Ownership Status': string;
  Headquarters: string;
  'Main Manufacturing': string;
  'Environmental & Sustainability Policies': string;
  'Acquisition History': string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: string;
}

interface Link {
  source: Node;
  target: Node;
}

interface FilterState {
  [key: string]: string | number[];
}

const Dashboard = () => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use BASE_URL to determine the environment
        const baseUrl = import.meta.env.BASE_URL;
        const csvPath = baseUrl === '/' 
          ? '/companies.csv'  // Local development
          : `${baseUrl}companies.csv`;  // GitHub Pages
        
        const response = await axios.get(csvPath);
        const parsedData = d3.csvParse(response.data) as CompanyData[];
        setData(parsedData);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      createNetworkGraph();
    }
  }, [data, searchTerm, filters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (column: string, value: string | number[]) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const getUniqueValues = (column: keyof CompanyData) => {
    return Array.from(new Set(data.map(d => d[column])));
  };

  const getYearRange = () => {
    const years = data
      .map(d => parseInt(d['Year Founded']))
      .filter(year => !isNaN(year));
    return [Math.min(...years), Math.max(...years)];
  };

  const filteredData = data.filter(company => {
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const companyName = company.Company.toLowerCase();
      const mainFocus = company['Main Sport Focus'].toLowerCase();
      const headquarters = company.Headquarters.toLowerCase();
      
      // Search across multiple fields
      if (!companyName.includes(searchLower) && 
          !mainFocus.includes(searchLower) && 
          !headquarters.includes(searchLower)) {
        return false;
      }
    }

    // Apply column filters
    return Object.entries(filters).every(([column, value]) => {
      if (!value) return true;
      
      if (column === 'Year Founded' && Array.isArray(value)) {
        const year = parseInt(company['Year Founded']);
        return !isNaN(year) && year >= value[0] && year <= value[1];
      }
      
      return company[column as keyof CompanyData] === value;
    });
  });

  const createNetworkGraph = () => {
    // Clear any existing SVG
    d3.select('#network-graph').selectAll('*').remove();

    // Get container dimensions
    const container = document.getElementById('network-graph');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select('#network-graph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background-color', '#FAF6F1');

    // Add zoom behavior
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create nodes for each company
    const nodes: Node[] = filteredData.map(d => ({
      id: d.Company,
      group: d['Main Sport Focus'].split(',')[0].trim()
    }));

    // Create a map for quick node lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // Create links based on acquisition history
    const links: Link[] = [];
    filteredData.forEach(company => {
      const acquisitionText = company['Acquisition History'];
      filteredData.forEach(otherCompany => {
        if (acquisitionText.includes(otherCompany.Company) && 
            company.Company !== otherCompany.Company) {
          const sourceNode = nodeMap.get(company.Company);
          const targetNode = nodeMap.get(otherCompany.Company);
          if (sourceNode && targetNode) {
            links.push({
              source: sourceNode,
              target: targetNode
            });
          }
        }
      });
    });

    // Create force simulation with responsive forces
    const newSimulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-width * 0.25)) // Responsive charge
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#2A2A2A')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Add nodes with responsive sizes
    const nodeRadius = Math.min(width, height) * 0.015; // Responsive node size
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? nodeRadius * 1.6 : nodeRadius;
      })
      .attr('fill', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        const colorScale = d3.scaleOrdinal<string>()
          .domain([...new Set(nodes.map(n => n.group))])
          .range(['#C75C2C', '#2A5B5B', '#F4B942']);
        return isHighlighted ? '#C75C2C' : colorScale(d.group);
      })
      .attr('stroke', '#2A2A2A')
      .attr('stroke-width', 2);

    // Add labels with responsive font sizes
    const fontSize = Math.min(width, height) * 0.02; // Responsive font size
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.id)
      .attr('font-size', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? `${fontSize * 1.25}px` : `${fontSize}px`;
      })
      .attr('font-weight', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? 'bold' : 'normal';
      })
      .attr('fill', '#2A2A2A')
      .attr('dx', nodeRadius * 1.5)
      .attr('dy', nodeRadius * 0.5);

    // Update positions on simulation tick
    newSimulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x ?? 0)
        .attr('y1', d => d.source.y ?? 0)
        .attr('x2', d => d.target.x ?? 0)
        .attr('y2', d => d.target.y ?? 0);

      node
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0);

      labels
        .attr('x', d => d.x ?? 0)
        .attr('y', d => d.y ?? 0);
    });

    // If there's a search term, zoom to the highlighted nodes
    if (searchTerm) {
      const highlightedNodes = nodes.filter(node => 
        node.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (highlightedNodes.length > 0) {
        // Calculate the center point of all highlighted nodes
        const centerX = highlightedNodes.reduce((sum, node) => sum + (node.x ?? 0), 0) / highlightedNodes.length;
        const centerY = highlightedNodes.reduce((sum, node) => sum + (node.y ?? 0), 0) / highlightedNodes.length;
        
        // Zoom to show all highlighted nodes
        const transform = d3.zoomIdentity
          .translate(width / 2 - centerX, height / 2 - centerY)
          .scale(highlightedNodes.length > 1 ? 1.5 : 2);
        
        svg.transition().duration(750).call(zoom.transform, transform);
      }
    }

    // Add resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      svg.attr('viewBox', `0 0 ${newWidth} ${newHeight}`);
      newSimulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
      newSimulation.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      newSimulation.stop();
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: '#C75C2C' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="#C75C2C">{error}</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
        <Typography 
          variant="h1" 
          align="center" 
          sx={{ 
            mb: 4, 
            color: '#2A2A2A',
            fontSize: '2.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
          }}
        >
          Indie Outdoors
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                bgcolor: '#FFFFFF',
                borderRadius: { xs: 2, sm: 3 },
                border: '2px solid #2A2A2A',
                boxShadow: '4px 4px 0px #2A2A2A',
              }}
            >
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Search Companies"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearch}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1, sm: 2 },
                      '& fieldset': {
                        borderColor: '#2A2A2A',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#C75C2C',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#2A2A2A',
                    },
                  }}
                />
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {Object.keys(data[0]).map((column) => (
                    <Grid item xs={12} sm={6} md={4} key={column}>
                      {column === 'Year Founded' ? (
                        <Box sx={{ width: '100%', px: { xs: 1, sm: 2 } }}>
                          <Typography gutterBottom sx={{ color: '#2A2A2A', fontWeight: 600 }}>
                            Year Founded
                          </Typography>
                          <Slider
                            value={filters[column] as number[] || getYearRange()}
                            onChange={(_, newValue) => handleFilterChange(column, newValue as number[])}
                            valueLabelDisplay="auto"
                            min={getYearRange()[0]}
                            max={getYearRange()[1]}
                            sx={{
                              '& .MuiSlider-thumb': {
                                borderColor: '#2A2A2A',
                                bgcolor: '#F4B942',
                              },
                              '& .MuiSlider-track': {
                                backgroundColor: '#C75C2C',
                              },
                              '& .MuiSlider-rail': {
                                backgroundColor: '#2A5B5B',
                              },
                            }}
                            marks={[
                              { value: getYearRange()[0], label: getYearRange()[0].toString() },
                              { value: getYearRange()[1], label: getYearRange()[1].toString() }
                            ]}
                          />
                        </Box>
                      ) : (
                        <FormControl fullWidth>
                          <InputLabel sx={{ color: '#2A2A2A' }}>{column}</InputLabel>
                          <Select
                            value={filters[column] || ''}
                            label={column}
                            onChange={(e) => handleFilterChange(column, e.target.value)}
                            sx={{
                              borderRadius: { xs: 1, sm: 2 },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2A2A2A',
                                borderWidth: 2,
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#C75C2C',
                              },
                            }}
                          >
                            <MenuItem value="">All</MenuItem>
                            {getUniqueValues(column as keyof CompanyData).map((value) => (
                              <MenuItem key={value} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                bgcolor: '#FFFFFF',
                borderRadius: { xs: 2, sm: 3 },
                border: '2px solid #2A2A2A',
                boxShadow: '4px 4px 0px #2A2A2A',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#2A2A2A', fontWeight: 'bold', letterSpacing: '0.02em' }}>
                Company Relationships Overview
              </Typography>
              <Box 
                id="network-graph" 
                sx={{ 
                  width: '100%',
                  height: { xs: '50vh', sm: '60vh' },
                  bgcolor: '#FAF6F1', 
                  borderRadius: { xs: 1, sm: 2 },
                  overflow: 'hidden'
                }} 
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                bgcolor: '#FFFFFF',
                borderRadius: { xs: 2, sm: 3 },
                border: '2px solid #2A2A2A',
                boxShadow: '4px 4px 0px #2A2A2A',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#2A2A2A', fontWeight: 'bold', letterSpacing: '0.02em' }}>
                Company Details
              </Typography>
              <Box sx={{ maxHeight: { xs: 300, sm: 400 }, overflow: 'auto' }}>
                {filteredData.map((company) => (
                  <Box 
                    key={company.Company} 
                    sx={{ 
                      mb: 2, 
                      p: { xs: 1.5, sm: 2 }, 
                      borderLeft: 4, 
                      borderColor: '#C75C2C',
                      bgcolor: '#FAF6F1',
                      borderRadius: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="#2A2A2A">
                      {company.Company}
                    </Typography>
                    <Typography variant="body2" color="#2A5B5B">
                      Main Focus: {company['Main Sport Focus']}
                    </Typography>
                    <Typography variant="body2" color="#2A5B5B">
                      Founded: {company['Year Founded']}
                    </Typography>
                    <Typography variant="body2" color="#2A5B5B">
                      Headquarters: {company.Headquarters}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                bgcolor: '#FFFFFF',
                borderRadius: { xs: 2, sm: 3 },
                border: '2px solid #2A2A2A',
                boxShadow: '4px 4px 0px #2A2A2A',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#2A2A2A', fontWeight: 'bold', letterSpacing: '0.02em' }}>
                Environmental Impact
              </Typography>
              <Box sx={{ maxHeight: { xs: 300, sm: 400 }, overflow: 'auto' }}>
                {filteredData.map((company) => (
                  <Box 
                    key={company.Company} 
                    sx={{ 
                      mb: 2, 
                      p: { xs: 1.5, sm: 2 }, 
                      borderLeft: 4, 
                      borderColor: '#2A5B5B',
                      bgcolor: '#FAF6F1',
                      borderRadius: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="#2A2A2A">
                      {company.Company}
                    </Typography>
                    <Typography variant="body2" color="#2A5B5B">
                      {company['Environmental & Sustainability Policies']}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 
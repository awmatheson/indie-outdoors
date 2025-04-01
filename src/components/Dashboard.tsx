import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel, Stack, Slider } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';

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

    const width = 600;
    const height = 400;

    const svg = d3.select('#network-graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

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

    // Create force simulation
    const newSimulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    // Add nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? 8 : 5;  // Make highlighted nodes larger
      })
      .attr('fill', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? '#ff0000' : d3.schemeCategory10[
          [...new Set(nodes.map(n => n.group))].indexOf(d.group)
        ];
      });

    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.id)
      .attr('font-size', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? '10px' : '8px';
      })
      .attr('font-weight', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? 'bold' : 'normal';
      })
      .attr('dx', 8)
      .attr('dy', 3);

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
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Search Companies"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Grid container spacing={2}>
              {Object.keys(data[0]).map((column) => (
                <Grid item xs={12} sm={6} md={4} key={column}>
                  {column === 'Year Founded' ? (
                    <Box sx={{ width: '100%', px: 2 }}>
                      <Typography gutterBottom>
                        Year Founded
                      </Typography>
                      <Slider
                        value={filters[column] as number[] || getYearRange()}
                        onChange={(_, newValue) => handleFilterChange(column, newValue as number[])}
                        valueLabelDisplay="auto"
                        min={getYearRange()[0]}
                        max={getYearRange()[1]}
                        marks={[
                          { value: getYearRange()[0], label: getYearRange()[0].toString() },
                          { value: getYearRange()[1], label: getYearRange()[1].toString() }
                        ]}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">
                          {filters[column] ? (filters[column] as number[])[0] : getYearRange()[0]}
                        </Typography>
                        <Typography variant="caption">
                          {filters[column] ? (filters[column] as number[])[1] : getYearRange()[1]}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel>{column}</InputLabel>
                      <Select
                        value={filters[column] || ''}
                        label={column}
                        onChange={(e) => handleFilterChange(column, e.target.value)}
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
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Company Relationships Overview
          </Typography>
          <Box id="network-graph" sx={{ width: '100%', height: '400px' }} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Company Details
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredData.map((company) => (
              <Box key={company.Company} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {company.Company}
                </Typography>
                <Typography variant="body2">
                  Main Focus: {company['Main Sport Focus']}
                </Typography>
                <Typography variant="body2">
                  Founded: {company['Year Founded']}
                </Typography>
                <Typography variant="body2">
                  Headquarters: {company.Headquarters}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Environmental Impact
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredData.map((company) => (
              <Box key={company.Company} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {company.Company}
                </Typography>
                <Typography variant="body2">
                  {company['Environmental & Sustainability Policies']}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 
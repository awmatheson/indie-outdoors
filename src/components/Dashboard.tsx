import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';

interface CompanyData {
  // We'll define the exact interface once we see the CSV structure
  [key: string]: any;
}

const Dashboard = () => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace this URL with your actual CSV file URL from GitHub
        const response = await axios.get('');
        const parsedData = d3.csvParse(response.data);
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

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading data...</Typography>
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
          <Typography variant="h5" gutterBottom>
            Company Relationships Overview
          </Typography>
          {/* We'll add visualization components here */}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Network Graph
          </Typography>
          {/* D3 network visualization will go here */}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Company Details
          </Typography>
          {/* Company details panel will go here */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 
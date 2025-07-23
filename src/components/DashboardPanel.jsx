import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

const DashboardPanel = ({ selectedDateData }) => {
  if (!selectedDateData) return null;

  const chartData = {
    labels: selectedDateData.timestamps,
    datasets: [
      {
        label: 'Price',
        data: selectedDateData.prices,
        borderColor: 'green',
        fill: false,
      },
    ],
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">Details</Typography>
      <Line data={chartData} />
    </Box>
  );
};

export default DashboardPanel;

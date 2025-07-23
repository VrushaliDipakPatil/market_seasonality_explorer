import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

const DashboardPanel = ({ selectedDateData }) => {
  if (!selectedDateData) return null;

  const chartData = {
    labels: selectedDateData.timestamps,
    datasets: [
      {
        label: 'Price',
        data: selectedDateData.prices,
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Intraday Price Chart</Typography>
        <Line data={chartData} />
      </CardContent>
    </Card>
  );
};

export default DashboardPanel;

// src/components/DashboardPanel.jsx
import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip, Legend);

function DashboardPanel({ realTimeData, historicalChartData }) {
  const renderChart = (title, data, isDate) => {
    const chartData = {
      labels: data?.timestamps || [],
      datasets: [
        {
          label: "Price",
          data: data?.prices || [],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: isDate ? "Date" : "Time",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Price (USD)",
          },
        },
      },
    };

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          {data?.timestamps?.length ? (
            <Line data={chartData} options={options} />
          ) : (
            <Typography>No data available</Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        {renderChart("Real-Time Price Data", realTimeData, false)}
      </Grid>
      <Grid item xs={12} md={6}>
        {renderChart("Selected Date Chart", historicalChartData, true)}
      </Grid>
    </Grid>
  );
}

export default DashboardPanel;

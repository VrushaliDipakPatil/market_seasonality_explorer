import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend
);

function DashboardPanel({ selectedDateData }) {
  const data = {
    labels: selectedDateData?.timestamps || [],
    datasets: [
      {
        label: "Price",
        data: selectedDateData?.prices || [],
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
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: "Time" },
      },
      y: {
        display: true,
        title: { display: true, text: "Price (USD)" },
      },
    },
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6">Real-Time Price Data</Typography>
        {selectedDateData?.timestamps?.length ? (
          <Line data={data} options={options} />
        ) : (
          <Typography variant="body2">No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardPanel;

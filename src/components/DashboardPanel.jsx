import React, { useMemo} from "react";
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";
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

function calculateIndicators(prices) {
  const ma = (arr, n) =>
    arr.map((_, i) =>
      i + 1 >= n
        ? arr.slice(i + 1 - n, i + 1).reduce((a, b) => a + b, 0) / n
        : null
    );

  const ma7 = ma(prices, 7);
  const ma14 = ma(prices, 14);

  const rsi = (() => {
    if (prices.length < 15) return [];
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < 15; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    const avgGain = gains / 14;
    const avgLoss = losses / 14 || 0.01;
    const rs = avgGain / avgLoss;
    const rsiVal = 100 - 100 / (1 + rs);
    return Array(prices.length).fill(rsiVal);
  })();

  const stdDev = (() => {
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance =
      prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) /
      prices.length;
    return Math.sqrt(variance).toFixed(2);
  })();

  return { ma7, ma14, rsi, stdDev };
}

function MetricCard({ title, value, color = "primary" }) {
  return (
    <Card sx={{ p: 2, minWidth: 120 }}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body1" color={color} fontWeight={600}>
        {value ?? "-"}
      </Typography>
    </Card>
  );
}

function DashboardPanel({ realTimeData, historicalChartData }) {
  const theme = useTheme();
  const isPortrait = useMediaQuery("(orientation: portrait)");
const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
const isStacked = isPortrait || isSmallScreen;

  const latestData = useMemo(() => {
    if (!historicalChartData || !historicalChartData.timestamps?.length)
      return null;
    const prices = historicalChartData.prices;
    const open = prices[0];
    const close = prices[prices.length - 1];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const volume = prices.length * 1000;
    const volatility = ((high - low) / open).toFixed(2);
    const change = (((close - open) / open) * 100).toFixed(2);
    const perf = close > open ? "↑" : close < open ? "↓" : "→";
    const indicators = calculateIndicators(prices);
    return {
      open,
      close,
      high,
      low,
      volume,
      volatility,
      change,
      perf,
      indicators,
    };
  }, [historicalChartData]);

  const renderChart = (title, data, isDate) => {
    const indicators = data?.indicators || {};

    const chartData = {
      labels: data?.timestamps || [],
      datasets: [
        {
          label: "Price",
          data: data?.prices || [],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.1)",
          tension: 0.3,
          fill: true,
          pointRadius: 2,
        },
        {
          label: "MA7",
          data: indicators?.ma7 || [],
          borderColor: "#FFA726",
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: "MA14",
          data: indicators?.ma14 || [],
          borderColor: "#66BB6A",
          borderDash: [2, 2],
          pointRadius: 0,
        },
        {
          label: "RSI",
          data: indicators?.rsi || [],
          borderColor: "#AB47BC",
          pointRadius: 0,
        },
      ],
    };

    const options = {
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
      },
      layout: { padding: 10 },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: isDate ? "Date" : "Time",
          },
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          display: true,
          title: { display: true, text: "Price (USD)" },
        },
      },
    };

    return (
      <Card sx={{ mt: 2, width: "100%" }}>
        <CardContent sx={{ width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: {
                xs: 300,
                sm: 400,
                md: 500,
                lg: 600,
              },
              minHeight: 240,
            }}
          >
            <Line data={chartData} options={options} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box mt={3}>
      {historicalChartData && (
        <Typography variant="h6" gutterBottom>
          Selected Date Metrics
        </Typography>
      )}
      {latestData && (
        <Grid container spacing={2} mb={2}>
          {[
            ["Open", latestData.open?.toFixed(2)],
            ["Close", latestData.close?.toFixed(2)],
            ["High", latestData.high?.toFixed(2)],
            ["Low", latestData.low?.toFixed(2)],
            ["Volatility", latestData.volatility],
            ["Change %", latestData.change + "%"],
          ].map(([label, value]) => (
            <Grid item xs={6} sm={3} md={2} key={label}>
              <MetricCard title={label} value={value} />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={2} >
        <Grid item xs={12} sm={6}     sx={{
      width: isStacked ? "100%" : "48%",
      margin: isStacked ? "0 auto" : "0",
    }}>
          {renderChart("Real-Time Price Data", realTimeData, false)}
        </Grid>
        <Grid item xs={12} sm={6}     sx={{
      width: isStacked ? "100%" : "48%",
      margin: isStacked ? "0 auto" : "0",
    }}>
          {historicalChartData &&
            renderChart(
              "Selected Date Chart",
              {
                ...historicalChartData,
                indicators: latestData?.indicators,
              },
              true
            )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPanel;

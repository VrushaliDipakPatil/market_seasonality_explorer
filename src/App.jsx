import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  ThemeProvider,
  CssBaseline,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import CalendarView from "./components/CalandarView";
import DashboardPanel from "./components/DashboardPanel";
import ViewSwitcher from "./components/ViewSwitcher";
import SymbolFilter from "./components/symbolFilter";
import ExportButtons from "./components/ExportButtons";
import DateRangeSelector from "./components/DateRangeSelector";
import ComparisonPanel from "./components/ComparisionPanel";
import SnackbarAlert from "./components/SnackBarAlert";

import {
  defaultTheme,
  highContrastTheme,
  colorblindFriendlyTheme,
} from "./themes";

import { fetchHistoricalData } from "./services/binanceService";

function App() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1d");
  const [view, setView] = useState("monthly");
  const [selectedMatrix, setSelectedMatrix] = useState("volatility");
  const [volatilityData, setVolatilityData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [realTimeData, setRealTimeData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [comparisonRanges, setComparisonRanges] = useState({
    range1: { start: null, end: null },
    range2: { start: null, end: null },
  });
  const [themeMode, setThemeMode] = useState("default");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const load = async () => {
      const data = await fetchHistoricalData(symbol, interval, 1000);
      setVolatilityData(data);
      setHistoricalData(data);
    };
    load();
  }, [symbol, interval]);

  useEffect(() => {
    let lastMid = null;

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );

    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        const bid = d?.b?.[0]?.[0];
        const ask = d?.a?.[0]?.[0];

        if (bid && ask) {
          const bidNum = parseFloat(bid);
          const askNum = parseFloat(ask);
          const mid = (bidNum + askNum) / 2;
          const now = new Date().toLocaleTimeString();

          setRealTimeData((prev) => ({
            timestamps: [...(prev?.timestamps || []), now].slice(-15),
            prices: [...(prev?.prices || []), mid].slice(-15),
          }));

          const volatility = Math.abs(askNum - bidNum);
          console.log(`Current volatility: ${volatility.toFixed(2)}`);
          if (volatility > 2) {
            showAlert(`Volatility Alert : ${volatility.toFixed(2)}`);
          }

          if (lastMid !== null) {
            const priceChange = mid - lastMid;
            console.log(`Price change: ${priceChange.toFixed(2)}`);
            if (priceChange > 0) {
              showAlert(
                `Performance : Price increased by $${priceChange.toFixed(2)}`
              );
            }
          }

          lastMid = mid;
        }
      } catch (err) {
        console.error("WebSocket parse error", err);
      }
    };

    return () => ws.close();
  }, [symbol]);

  useEffect(() => {
    if (!historicalData || Object.keys(historicalData).length === 0) return;

    const threshold = 5;
    const patternCount = {};

    for (const [dateStr, data] of Object.entries(historicalData)) {
      const [mm, dd] = dateStr.split("-");
      const key = `${mm}-${dd}`;

      if (data?.volatility && data.volatility > threshold) {
        patternCount[key] = (patternCount[key] || 0) + 1;
      }
    }

    const recurring = Object.entries(patternCount).filter(
      ([, count]) => count >= 3
    );

    if (recurring.length > 0) {
      const patternDates = recurring.map(([date]) => date).join(", ");
      showAlert(
        `📈 Recurring Pattern: High volatility often seen on these dates — ${patternDates}`
      );
    }
  }, [historicalData]);

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const getTheme = () => {
    switch (themeMode) {
      case "highContrast":
        return highContrastTheme;
      case "colorblindFriendly":
        return colorblindFriendlyTheme;
      default:
        return defaultTheme;
    }
  };

  const handleDateSelect = async (date) => {
    if (selectedDate === date) return;
    setSelectedDate(date);

    let newRange = { ...range };
    if (!range.start || (range.start && range.end)) {
      newRange = { start: date, end: null };
    } else {
      newRange.end = date;
    }
    setRange(newRange);

    if (newRange.start && newRange.end) {
      const start = new Date(newRange.start + "T00:00:00Z").getTime();
      const end = new Date(newRange.end + "T23:59:59Z").getTime();

      const res = await fetchHistoricalData(symbol, "1d", 1000, start, end);
      const stamps = Object.keys(res).sort();
      const prices = stamps.map((d) => res[d]?.close || 0);
      setSelectedDateData({ timestamps: stamps, prices });
    } else {
      setSelectedDateData(null);
    }
  };

  const handleClearSelection = () => {
    setRange({ start: null, end: null });
    setSelectedDate(null);
    setSelectedDateData(null);
  };

  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ width: "100%", px: { xs: 1, sm: 2 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box id="export-area" sx={{ bgcolor: "background.paper", p: 2 }}>
              <Typography variant="h4" gutterBottom>
                Market Seasonality Explorer
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <Button
                      variant={
                        themeMode === "default" ? "contained" : "outlined"
                      }
                      onClick={() => setThemeMode("default")}
                    >
                      Default
                    </Button>
                    <Button
                      variant={
                        themeMode === "colorblindFriendly"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => setThemeMode("colorblindFriendly")}
                    >
                      Colorblind‑Friendly
                    </Button>
                    <Button
                      variant={
                        themeMode === "highContrast" ? "contained" : "outlined"
                      }
                      onClick={() => setThemeMode("highContrast")}
                    >
                      High Contrast
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    display="flex"
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  >
                    <ExportButtons
                      exportTargetId="export-area"
                      csvData={Object.entries(volatilityData).map(
                        ([date, v]) => ({
                          date,
                          ...v,
                        })
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>

              <SymbolFilter
                symbol={symbol}
                onChange={setSymbol}
                interval={interval}
                onIntervalChange={setInterval}
                selectedMatrix={selectedMatrix}
                onMatrixChange={setSelectedMatrix}
              />

              <ViewSwitcher view={view} onChange={setView} />

              <CalendarView
                key={view + interval + selectedMatrix}
                data={volatilityData}
                view={view}
                onDateSelect={handleDateSelect}
                range={range}
                selectedDate={selectedDate}
                selectedMatrix={selectedMatrix}
              />

              {selectedDateData && (
                <Button
                  onClick={handleClearSelection}
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2 }}
                >
                  Clear Selection
                </Button>
              )}

              <DashboardPanel
                realTimeData={realTimeData}
                historicalChartData={selectedDateData}
              />
            </Box>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Compare Time Periods
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <DateRangeSelector
                    label="Range 1"
                    range={comparisonRanges.range1}
                    onChange={(k, v) =>
                      setComparisonRanges((prev) => ({
                        ...prev,
                        range1: { ...prev.range1, [k]: v },
                      }))
                    }
                  />
                  <DateRangeSelector
                    label="Range 2"
                    range={comparisonRanges.range2}
                    onChange={(k, v) =>
                      setComparisonRanges((prev) => ({
                        ...prev,
                        range2: { ...prev.range2, [k]: v },
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={8} mb={6}>
                  <ComparisonPanel
                    data={Object.entries(historicalData).map(([d, v]) => ({
                      date: new Date(d),
                      ...v,
                    }))}
                    ranges={[
                      {
                        start: comparisonRanges.range1.start
                          ? new Date(comparisonRanges.range1.start)
                          : null,
                        end: comparisonRanges.range1.end
                          ? new Date(comparisonRanges.range1.end)
                          : null,
                      },
                      {
                        start: comparisonRanges.range2.start
                          ? new Date(comparisonRanges.range2.start)
                          : null,
                        end: comparisonRanges.range2.end
                          ? new Date(comparisonRanges.range2.end)
                          : null,
                      },
                    ].filter((r) => r.start && r.end)}
                  />
                </Grid>
              </Grid>
            </Box>

            <SnackbarAlert
              open={alert.open}
              message={alert.message}
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, open: false })}
            />
          </motion.div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

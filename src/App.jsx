// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import CalendarView from "./components/CalandarView";
import DashboardPanel from "./components/DashboardPanel";
import ViewSwitcher from "./components/ViewSwitcher";
import SymbolFilter from "./components/symbolFilter";
import { fetchHistoricalData } from "./services/binanceService";
import ExportButtons from "./components/ExportButtons";
import DateRangeSelector from "./components/DateRangeSelector";
import ComparisonPanel from "./components/ComparisionPanel";

import {
  defaultTheme,
  highContrastTheme,
  colorblindFriendlyTheme,
} from "./themes";

function App() {
  const [view, setView] = useState("monthly");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1d");
  const [metric, setMetric] = useState("all");
  const [volatilityData, setVolatilityData] = useState({});
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [selectedMatrix, setSelectedMatrix] = useState("volatility");
  const [themeName, setThemeName] = useState("default");
  const [comparisonRanges, setComparisonRanges] = useState({
    range1: { start: null, end: null },
    range2: { start: null, end: null },
  });
  const [historicalData, setHistoricalData] = useState([]);

  const currentTheme =
    themeName === "highContrast"
      ? highContrastTheme
      : themeName === "colorblind"
      ? colorblindFriendlyTheme
      : defaultTheme;

  useEffect(() => {
    const getData = async () => {
      const realData = await fetchHistoricalData(symbol, interval, 1000);
      setVolatilityData(realData);
      setHistoricalData(realData);
    };
    getData();
  }, [symbol, interval]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const bid = data?.b?.[0]?.[0];
        const ask = data?.a?.[0]?.[0];
        if (bid && ask) {
          const midPrice = (parseFloat(bid) + parseFloat(ask)) / 2;
          const now = new Date().toLocaleTimeString();
          setRealTimeData((prev) => {
            const prevTimestamps = prev?.timestamps || [];
            const prevPrices = prev?.prices || [];
            return {
              timestamps: [...prevTimestamps, now].slice(-15),
              prices: [...prevPrices, midPrice].slice(-15),
            };
          });
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };
    return () => ws.close();
  }, [symbol]);

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

      const result = await fetchHistoricalData(symbol, "1d", 1000, start, end);
      const timestamps = Object.keys(result).sort();
      const prices = timestamps.map((d) => result[d]?.close || 0);

      setSelectedDateData({ timestamps, prices });
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
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container>
        <Box sx={{ width: "100%", px: 2 }}>
          <div
            id="export-area"
            style={{ backgroundColor: "#fff", padding: "16px" }}
          >
            <Typography variant="h4" mt={2}>
              Market Seasonality Explorer
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Theme Switcher */}
              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant={themeName === "default" ? "contained" : "outlined"}
                  onClick={() => setThemeName("default")}
                >
                  Default
                </Button>
                <Button
                  variant={
                    themeName === "colorblind" ? "contained" : "outlined"
                  }
                  onClick={() => setThemeName("colorblind")}
                >
                  Colorblind-Friendly
                </Button>
                <Button
                  variant={
                    themeName === "highContrast" ? "contained" : "outlined"
                  }
                  onClick={() => setThemeName("highContrast")}
                >
                  High Contrast
                </Button>
              </Box>
              <ExportButtons
                exportTargetId="export-area"
                csvData={Object.entries(volatilityData).map(
                  ([date, values]) => ({
                    date,
                    ...values,
                  })
                )}
              />
            </div>
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
          </div>
          <Box mt={2}>
            <Typography variant="h6">Compare Time Periods</Typography>

            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={4}
              alignItems="flex-start"
            >
              {/* Left Column: Range Selectors */}
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                width={{ xs: "100%", md: "30%" }}
              >
                <DateRangeSelector
                  label="Range 1"
                  range={comparisonRanges.range1}
                  onChange={(key, value) =>
                    setComparisonRanges((prev) => ({
                      ...prev,
                      range1: { ...prev.range1, [key]: value },
                    }))
                  }
                />
                <DateRangeSelector
                  label="Range 2"
                  range={comparisonRanges.range2}
                  onChange={(key, value) =>
                    setComparisonRanges((prev) => ({
                      ...prev,
                      range2: { ...prev.range2, [key]: value },
                    }))
                  }
                />
              </Box>

              {/* Right Column: Comparison Panel */}
              <Box width={{ xs: "100%", md: "70%" }}>
                <ComparisonPanel
                  data={Object.entries(historicalData).map(
                    ([date, values]) => ({
                      date: new Date(date),
                      ...values,
                    })
                  )}
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
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

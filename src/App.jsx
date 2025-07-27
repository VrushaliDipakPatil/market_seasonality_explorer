// src/App.jsx
import React, { useEffect, useState } from "react";
import CalendarView from "./components/CalandarView";
import DashboardPanel from "./components/DashboardPanel";
import ViewSwitcher from "./components/ViewSwitcher";
import { Container, Typography, Button } from "@mui/material";
import SymbolFilter from "./components/symbolFilter";
import { fetchHistoricalData } from "./services/binanceService";

function App() {
  const [view, setView] = useState("monthly");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1d");
  const [metric, setMetric] = useState("all");
  const [volatilityData, setVolatilityData] = useState({});
  const [selectedDateData, setSelectedDateData] = useState(null);   // for range chart
  const [realTimeData, setRealTimeData] = useState(null);           // for live updates
  const [selectedDate, setSelectedDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [selectedMatrix, setSelectedMatrix] = useState("volatility");

  useEffect(() => {
    const getData = async () => {
      const realData = await fetchHistoricalData(symbol, interval, 1000);
      setVolatilityData(realData);
    };
    getData();
  }, [symbol, interval]);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`);
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
      setSelectedDateData(null); // Only show if full range
    }
  };

  const handleClearSelection = () => {
    setRange({ start: null, end: null });
    setSelectedDate(null);
    setSelectedDateData(null);
  };

  return (
    <Container>
      <Typography variant="h4" mt={2}>Market Seasonality Explorer</Typography>

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

      <Button
        onClick={handleClearSelection}
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
      >
        Clear Selection
      </Button>

      <DashboardPanel
        realTimeData={realTimeData}
        historicalChartData={selectedDateData}
      />
    </Container>
  );
}

export default App;

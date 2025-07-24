import React, { useEffect, useState } from "react";
import CalendarView from "./components/CalandarView";
import DashboardPanel from "./components/DashboardPanel";
import ViewSwitcher from "./components/ViewSwitcher";
import { Container, Typography } from "@mui/material";
import SymbolFilter from "./components/symbolFilter";


function App() {
  const [view, setView] = useState("monthly");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [volatilityData, setVolatilityData] = useState({});
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });

  useEffect(() => {
    const tempData = {};
    const today = new Date();

    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      tempData[dateStr] = {
        volatility: parseFloat((Math.random() * 1).toFixed(2)),
        volume: Math.floor(Math.random() * 10000),
      };
    }

    setVolatilityData(tempData);
  }, []);

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

          setSelectedDateData((prev) => {
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

  const handleDateSelect = (date) => {
    if (selectedDate === date) return;

    setSelectedDate(date); // ✅ Fix: Set selected date
    setSelectedDateData({ timestamps: [], prices: [] });

    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      } else {
        return { start: prev.start, end: date };
      }
    });
  };

  return (
    <Container>
      <Typography variant="h4" mt={2}>
        Market Seasonality Explorer
      </Typography>

      <SymbolFilter symbol={symbol} onChange={setSymbol} />
      <ViewSwitcher view={view} onChange={setView} />

      <CalendarView
        data={volatilityData}
        view={view}
        onDateSelect={handleDateSelect}
        range={range}
        selectedDate={selectedDate}
      />

      <DashboardPanel selectedDateData={selectedDateData} />
    </Container>
  );
}

export default App;

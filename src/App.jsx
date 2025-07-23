import React, { useEffect, useState } from "react";
import CalendarView from "./components/CalandarView";
import DashboardPanel from "./components/DashboardPanel";
import ViewSwitcher from "./components/ViewSwitcher";
import { fetchOrderBook } from "./services/binanceservice";
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
    const getData = async () => {
      const book = await fetchOrderBook(symbol);
      const newData = {};

      // Generate dummy volatility and volume for past 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        newData[dateStr] = {
          volatility: Math.random().toFixed(2),
          volume: Math.floor(Math.random() * 10000),
        };
      }

      const generatedData = {};
      for (let i = 0; i < 100; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        generatedData[dateStr] = {
          volatility: Math.random().toFixed(2),
          volume: Math.floor(Math.random() * 10000),
        };
      }
      setVolatilityData(generatedData);

      // Set selectedDateData for today
      const today = new Date().toISOString().split("T")[0];
      setSelectedDateData({
        timestamps: ["10:00", "11:00", "12:00"],
        prices: [book?.bids?.[0]?.[0] || 30000, 30500, 30200],
      });
    };

    getData();
  }, [symbol]);

  const handleDateSelect = (date) => {
    if (selectedDate === date) return; // 👈 Skip if same date

    setSelectedDate(date);

    // Range selection logic
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      } else {
        return { start: prev.start, end: date };
      }
    });

    // Simulate chart data
    setSelectedDateData({
      timestamps: ["10:00", "11:00", "12:00"],
      prices: [
        Math.floor(30000 + Math.random() * 1000),
        Math.floor(30000 + Math.random() * 1000),
        Math.floor(30000 + Math.random() * 1000),
      ],
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
      />

      <DashboardPanel selectedDateData={selectedDateData} />
    </Container>
  );
}

export default App;

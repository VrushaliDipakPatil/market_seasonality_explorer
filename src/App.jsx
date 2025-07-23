import React, { useEffect, useState } from "react";
import CalendarView from "./components/CalandarView";
import DashboardPanel from "./components/DashboardPanel";
import ViewSwitcher from "./components/ViewSwitcher";
import { fetchOrderBook } from "./services/binanceservice";
import { Container, Typography } from "@mui/material";
import SymbolFilter from "./components/symbolFilter";
import dayjs from "dayjs";

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
      const today = new Date().toISOString().split("T")[0];

      setVolatilityData({
        [today]: {
          volatility: Math.random().toFixed(2),
          volume: Math.floor(Math.random() * 10000),
        },
      });

      setSelectedDateData({
        timestamps: ["10:00", "11:00", "12:00"],
        prices: [book?.bids?.[0]?.[0] || 30000, 30500, 30200],
      });
    };

    getData();
  }, [symbol]);

  const handleRangeSelect = (date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else {
      const start = dayjs(range.start);
      const end = dayjs(date);
      if (end.isBefore(start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange((prev) => ({ ...prev, end: date }));
      }
    }
  };

  const handleDateClick = (date) => {
    handleRangeSelect(date);
    setSelectedDate(date);

    // Simulate selected day data
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
        onDateSelect={handleDateClick}
        range={range}
      />

      <DashboardPanel selectedDateData={selectedDateData} />
    </Container>
  );
}

export default App;

import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);

const CalendarView = ({ data, view, onDateSelect, range, selectedDate }) => {
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(today);

  const isFutureDate = (date) => date.isAfter(today, "day");
  const isPastLimit = (date) => date.isBefore(today.subtract(1000, "day"), "day");

  const handlePrev = useCallback(() => {
    const prevDate =
      view === "daily"
        ? currentDate.subtract(1, "month")
        : view === "weekly"
        ? currentDate.subtract(8, "week")
        : currentDate.subtract(1, "year");

    if (!isPastLimit(prevDate)) {
      setCurrentDate(prevDate);
    }
  }, [currentDate, view]);

  const handleNext = useCallback(() => {
    const nextDate =
      view === "daily"
        ? currentDate.add(1, "month")
        : view === "weekly"
        ? currentDate.add(8, "week")
        : currentDate.add(1, "year");

    if (!isFutureDate(nextDate)) {
      setCurrentDate(nextDate);
    }
  }, [currentDate, view]);

  const getVolatilityColor = (volatility) => {
    if (volatility >= 0.06) return "#f44336"; // red - high
    if (volatility >= 0.03) return "#ff9800"; // orange - medium
    if (volatility >= 0.01) return "#8bc34a"; // green - low
    return "#e0e0e0"; // gray
  };

  const getPerformanceArrow = (perf) => {
    if (perf > 0) return "▲";
    if (perf < 0) return "▼";
    return "-";
  };

const renderCell = (date, label = null, cellData = null) => {
  const dateStr = date.format("YYYY-MM-DD");
  const isTodayDate = date.isToday();
  const isSelected = selectedDate && dateStr === selectedDate;
  const inRange =
    range.start &&
    range.end &&
    date.isSameOrAfter(dayjs(range.start)) &&
    date.isSameOrBefore(dayjs(range.end));

  const { volatility, volume, priceChange } = cellData || data[dateStr] || {};

  // Volatility Color
  const getVolatilityColor = (volatility) => {
    if (volatility >= 0.06) return "#f44336"; // High - Red
    if (volatility >= 0.03) return "#ff9800"; // Medium - Orange
    if (volatility >= 0.01) return "#8bc34a"; // Low - Green
    return "#e0e0e0"; // Very low / no data - Gray
  };

  // Volume Bar Width (% based on max observed volume)
  const getBarWidthPercent = (volume) => {
    if (!volume || volume <= 0) return 0;
    if (volume >= 1000000) return 95;
    if (volume >= 500000) return 75;
    if (volume >= 100000) return 50;
    if (volume >= 10000) return 25;
    return 10;
  };

  // Performance Arrow and Color
  const getPerformanceIndicator = (change) => {
    if (change > 0) return { arrow: "▲", color: "green" };
    if (change < 0) return { arrow: "▼", color: "red" };
    return { arrow: "-", color: "gray" };
  };

  const perf = getPerformanceIndicator(priceChange);
  const barWidth = getBarWidthPercent(volume);

  return (
<Paper
  key={label || dateStr}
  onClick={() => !isFutureDate(date) && onDateSelect(dateStr)}
  sx={{
    p: 1,
    m: 0.5,
    width: 100,
    height: 100,
    cursor: isFutureDate(date) ? "not-allowed" : "pointer",
    backgroundColor: isSelected
      ? "#cce5ff"
      : inRange
      ? "#e6f7ff"
      : getVolatilityColor(volatility),
    border: isTodayDate ? "2px solid #1976d2" : "1px solid #ccc",
    opacity: isFutureDate(date) ? 0.5 : 1,
    position: "relative",
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "space-between",  // Even spacing top to bottom
    alignItems: "flex-start",         // Align content to left
    overflow: "hidden",
  }}
>
  {/* Top: Label (Date or Month) */}
  <Typography variant="subtitle2" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
    {label || date.format("DD MMM")}
  </Typography>

  {/* Middle: Data */}
  <Box sx={{ mt: "auto" }}>
    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
      Vol: {volatility?.toFixed(2) || "-"}
    </Typography><br/>
    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
      Volu: {volume?.toFixed(0) || "-"}
    </Typography><br/>
    <Typography
      variant="caption"
      sx={{
        color: perf.color,
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 1.2,
      }}
    >
      {perf.arrow}
    </Typography>
  </Box>

  {/* Bottom: Volume Bar */}
  <Box
    sx={{
      position: "absolute",
      bottom: 6,
      left: 4,
      height: 6,
      width: `${barWidth}%`,
      backgroundColor: "#1976d2",
      borderRadius: "4px",
      opacity: 0.8,
    }}
  />
</Paper>
  );
};



  const getDailyCells = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const cells = [];
    let day = startOfMonth;

    while (day.isSameOrBefore(endOfMonth)) {
      cells.push(renderCell(day));
      day = day.add(1, "day");
    }
    return cells;
  };

  const getWeeklyCells = () => {
    const cells = [];
    for (let i = 0; i < 8; i++) {
      const weekStart = currentDate.subtract(i, "week").startOf("week");
      const weekEnd = weekStart.endOf("week");

      let weeklyVol = 0;
      let totalVolu = 0;
      let priceStart = null;
      let priceEnd = null;
      let count = 0;

      for (let j = 0; j < 7; j++) {
        const date = weekStart.add(j, "day");
        const dateStr = date.format("YYYY-MM-DD");
        const entry = data[dateStr];
        if (entry) {
          weeklyVol += entry.volatility || 0;
          totalVolu += entry.volume || 0;
          if (priceStart === null) priceStart = entry.open;
          priceEnd = entry.close;
          count++;
        }
      }

      const avgVol = count ? weeklyVol / count : 0;
      const perf = priceStart && priceEnd ? (priceEnd - priceStart) / priceStart : 0;

      cells.push(renderCell(weekStart, `${weekStart.format("DD MMM")} - ${weekEnd.format("DD MMM")}`, {
        volatility: avgVol,
        volume: totalVolu,
        priceChange: perf,
      }));
    }
    return cells;
  };

  const getMonthlyCells = () => {
    const yearStart = currentDate.startOf("year");
    const cells = [];

    for (let i = 0; i < 12; i++) {
      const monthStart = yearStart.add(i, "month");
      const monthEnd = monthStart.endOf("month");
      let monthVol = 0;
      let totalVolu = 0;
      let priceStart = null;
      let priceEnd = null;
      let count = 0;

      for (let d = monthStart; d.isSameOrBefore(monthEnd); d = d.add(1, "day")) {
        const dateStr = d.format("YYYY-MM-DD");
        const entry = data[dateStr];
        if (entry) {
          monthVol += entry.volatility || 0;
          totalVolu += entry.volume || 0;
          if (priceStart === null) priceStart = entry.open;
          priceEnd = entry.close;
          count++;
        }
      }

      const avgVol = count ? monthVol / count : 0;
      const perf = priceStart && priceEnd ? (priceEnd - priceStart) / priceStart : 0;

      cells.push(renderCell(monthStart, monthStart.format("MMMM"), {
        volatility: avgVol,
        volume: totalVolu,
        priceChange: perf,
      }));
    }

    return cells;
  };

  const getTitle = () => {
    if (view === "daily") return currentDate.format("MMMM YYYY");
    if (view === "weekly") {
      const endWeek = currentDate.format("DD MMM YYYY");
      return null;
    }
    if (view === "monthly") return currentDate.format("YYYY");
    return "";
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    },
    [handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderCells = () => {
    if (view === "daily") return getDailyCells();
    if (view === "weekly") return getWeeklyCells();
    if (view === "monthly") return getMonthlyCells();
    return [];
  };

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton onClick={handlePrev}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">{getTitle()}</Typography>
        <IconButton onClick={handleNext}>
          <ArrowForward />
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {renderCells()}
      </Box>
    </Box>
  );
};

export default CalendarView;

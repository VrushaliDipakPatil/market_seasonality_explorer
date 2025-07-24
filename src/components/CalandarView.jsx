import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { ArrowBack, ArrowForward, ArrowDropUp, ArrowDropDown, Remove } from "@mui/icons-material";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const getVolatilityColor = (volatility) => {
  if (volatility == null) return "#ffffff";
  if (volatility < 0.01) return "#d0f0c0"; // Light green
  if (volatility < 0.03) return "#fff4cc"; // Light yellow
  return "#ffd6d6"; // Light red
};

const getPerformanceIcon = (performance) => {
  if (performance > 0) return <ArrowDropUp sx={{ color: "green" }} />;
  if (performance < 0) return <ArrowDropDown sx={{ color: "red" }} />;
  return <Remove sx={{ color: "gray" }} />;
};

const CalendarView = ({ data, view, onDateSelect, range, selectedDate }) => {
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(today);

  const isFutureDate = (date) => date.isAfter(today, "day");
  const isPastLimit = (date) => date.isBefore(today.subtract(364, "day"), "day");

  const handlePrev = () => {
    const prevDate =
      view === "daily"
        ? currentDate.subtract(1, "day")
        : view === "weekly"
        ? currentDate.subtract(1, "week")
        : currentDate.subtract(1, "month");

    if (!isPastLimit(prevDate)) {
      setCurrentDate(prevDate);
    }
  };

  const handleNext = () => {
    const nextDate =
      view === "daily"
        ? currentDate.add(1, "day")
        : view === "weekly"
        ? currentDate.add(1, "week")
        : currentDate.add(1, "month");

    if (!isFutureDate(nextDate)) {
      setCurrentDate(nextDate);
    }
  };

  const getDailyCells = () => {
    return [renderCell(currentDate)];
  };

  const getWeeklyCells = () => {
    const startOfWeek = currentDate.startOf("week");
    return Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.add(i, "day");
      return renderCell(date);
    });
  };

  const getMonthlyCells = () => {
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

  const renderCell = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const isTodayDate = date.isToday();
    const isSelected = selectedDate && dateStr === selectedDate;
    const inRange =
      range.start && range.end &&
      date.isSameOrAfter(dayjs(range.start)) &&
      date.isSameOrBefore(dayjs(range.end));

    const cellData = data[dateStr] || {};
    const { volatility, volume, performance } = cellData;

    const cellColor = getVolatilityColor(volatility);

    return (
      <Paper
        key={dateStr}
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
            : cellColor,
          border: isTodayDate ? "2px solid #1976d2" : "1px solid #ccc",
          opacity: isFutureDate(date) ? 0.5 : 1,
          position: "relative",
        }}
      >
        <Typography variant="subtitle2">{date.format("DD MMM")}</Typography>
        <Typography variant="caption">Vol: {volatility || "-"}</Typography><br/>
        <Typography variant="caption">Volu: {volume?.toFixed(2) || "-"}</Typography>

        {/* Volume bar visual */}
        {volume && (
          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              left: 4,
              width: "90%",
              height: 6,
              backgroundColor: "#eee",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${Math.min(100, (volume / 5000) * 100)}%`, // Adjust divisor to scale
                backgroundColor: "#1976d2",
                borderRadius: 2,
              }}
            />
          </Box>
        )}

        {/* Performance icon */}
        <Box sx={{ position: "absolute", top: 4, right: 4 }}>
          {getPerformanceIcon(performance)}
        </Box>
      </Paper>
    );
  };

  const renderCells = () => {
    if (view === "daily") return getDailyCells();
    if (view === "weekly") return getWeeklyCells();
    if (view === "monthly") return getMonthlyCells();
    return [];
  };

  const getTitle = () => {
    if (view === "daily") return currentDate.format("DD MMM YYYY");
    if (view === "weekly") {
      const start = currentDate.startOf("week").format("DD MMM");
      const end = currentDate.endOf("week").format("DD MMM YYYY");
      return `${start} - ${end}`;
    }
    if (view === "monthly") return currentDate.format("MMMM YYYY");
    return "";
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    },
    [currentDate, view]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton onClick={handlePrev} disabled={isPastLimit(
          view === "daily"
            ? currentDate.subtract(1, "day")
            : view === "weekly"
            ? currentDate.subtract(1, "week")
            : currentDate.subtract(1, "month")
        )}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">{getTitle()}</Typography>
        <IconButton onClick={handleNext} disabled={isFutureDate(
          view === "daily"
            ? currentDate.add(1, "day")
            : view === "weekly"
            ? currentDate.add(1, "week")
            : currentDate.add(1, "month")
        )}>
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

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

dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CalendarView = ({ data, view, onDateSelect, range, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const today = dayjs();

  const isFutureDate = (date) => date.isAfter(today, "day");

  const handlePrev = () => {
    if (view === "daily") setCurrentDate((prev) => prev.subtract(1, "day"));
    if (view === "weekly") setCurrentDate((prev) => prev.subtract(1, "week"));
    if (view === "monthly") setCurrentDate((prev) => prev.subtract(1, "month"));
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
    const date = currentDate;
    const cell = renderCell(date);
    return [cell];
  };

  const getWeeklyCells = () => {
    const startOfWeek = currentDate.startOf("week");
    const cells = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, "day");
      cells.push(renderCell(date));
    }
    return cells;
  };

  const getMonthlyCells = () => {
    const startOfMonth = currentDate.startOf("month");
    const daysInMonth = currentDate.daysInMonth();
    const cells = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = startOfMonth.add(i, "day");
      cells.push(renderCell(date));
    }
    return cells;
  };

  const renderCell = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const day = date.date();
    const isTodayDate = date.isToday();
    const isSelected = selectedDate && dateStr === selectedDate;
    const inRange =
      range.start && range.end &&
      date.isSameOrAfter(dayjs(range.start)) &&
      date.isSameOrBefore(dayjs(range.end));

    const cellData = data[dateStr] || {};
    const { volatility, volume } = cellData;

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
            : "white",
          border: isTodayDate ? "2px solid #1976d2" : "1px solid #ccc",
          opacity: isFutureDate(date) ? 0.5 : 1,
        }}
      >
        <Typography variant="subtitle2">{date.format("DD MMM")}</Typography>
        <Typography variant="caption">Vol: {volatility || "-"}</Typography>
        <Typography variant="caption">Volu: {volume || "-"}</Typography>
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
        <IconButton onClick={handlePrev}>
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
      <Grid container>{renderCells()}</Grid>
    </Box>
  );
};

export default CalendarView;

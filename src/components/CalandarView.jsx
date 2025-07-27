import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, Typography, IconButton, Box, Paper } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";

dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);

const CalendarView = ({
  data,
  view,
  onDateSelect,
  range,
  selectedDate,
  selectedMatrix = "volatility",
}) => {
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(today);

  // Zoom state
  const [scale, setScale] = useState(1);
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2;
  const touchStartDistRef = useRef(null);

  // Zoom handlers
  const handleWheelZoom = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const newScale = Math.min(
          Math.max(scale - e.deltaY * 0.001, MIN_SCALE),
          MAX_SCALE
        );
        setScale(newScale);
      }
    },
    [scale]
  );

  const handlePinchZoom = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [touch1, touch2] = e.touches;
        const distance = Math.hypot(
          touch1.pageX - touch2.pageX,
          touch1.pageY - touch2.pageY
        );

        if (touchStartDistRef.current == null) {
          touchStartDistRef.current = distance;
          return;
        }

        const scaleFactor = distance / touchStartDistRef.current;
        const newScale = Math.min(
          Math.max(scale * scaleFactor, MIN_SCALE),
          MAX_SCALE
        );
        setScale(newScale);
        touchStartDistRef.current = distance;
      }
    },
    [scale]
  );

  useEffect(() => {
    const container = document.getElementById("calendar-zoom-container");

    if (container) {
      container.addEventListener("wheel", handleWheelZoom, { passive: false });
      container.addEventListener("touchmove", handlePinchZoom, {
        passive: false,
      });
      container.addEventListener(
        "touchend",
        () => (touchStartDistRef.current = null)
      );
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheelZoom);
        container.removeEventListener("touchmove", handlePinchZoom);
        container.removeEventListener(
          "touchend",
          () => (touchStartDistRef.current = null)
        );
      }
    };
  }, [handleWheelZoom, handlePinchZoom]);

  const isFutureDate = (date) => date.isAfter(today, "day");
  const isPastLimit = (date) =>
    date.isBefore(today.subtract(1000, "day"), "day");

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

  const renderCell = (date, label = null, cellData = null) => {
    const dateStr = date.format("YYYY-MM-DD");
    const isTodayDate = date.isToday();
    const isSelected = selectedDate && dateStr === selectedDate;
    const inRange =
      range.start &&
      range.end &&
      date.isSameOrAfter(dayjs(range.start)) &&
      date.isSameOrBefore(dayjs(range.end));

    const { volatility, volume, priceChange, open, close, high, low } =
      cellData || data[dateStr] || {};

    const tooltipText = (
      <div>
        <div>Volatility: {volatility?.toFixed(2) ?? "-"}</div>
        <div>Volume: {volume?.toFixed(2) ?? "-"}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          Performance:&nbsp;
          {priceChange === 1 ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : priceChange === -1 ? (
            <ArrowDownwardIcon fontSize="small" />
          ) : (
            <RemoveIcon fontSize="small" />
          )}
        </div>
        <div>Opening Price: {open?.toFixed(2) ?? "-"}</div>
        <div>Closing Price: {close?.toFixed(2) ?? "-"}</div>
        <div>
          High / Low: {high?.toFixed(2) ?? "-"} / {low?.toFixed(2) ?? "-"}
        </div>
        <div>
          Price Change:{" "}
          {typeof priceChange === "number" ? `${priceChange.toFixed(2)}%` : "-"}
        </div>
      </div>
    );

    const getVolatilityColor = (volatility) => {
      if (volatility >= 0.06) return "#f44336";
      if (volatility >= 0.03) return "#ff9800";
      if (volatility >= 0.01) return "#8bc34a";
      return "#e0e0e0";
    };

    const getBarWidthPercent = (volume) => {
      if (!volume || volume <= 0) return 0;
      if (volume >= 1000000) return 95;
      if (volume >= 500000) return 75;
      if (volume >= 100000) return 50;
      if (volume >= 10000) return 25;
      return 10;
    };

    const getPerformanceIndicator = (change) => {
      if (typeof change !== "number")
        return <RemoveIcon sx={{ color: "gray", fontSize: 16 }} />;
      if (change > 0)
        return <ArrowUpwardIcon sx={{ color: "green", fontSize: 16 }} />;
      if (change < 0)
        return <ArrowDownwardIcon sx={{ color: "red", fontSize: 16 }} />;
      return <RemoveIcon sx={{ color: "gray", fontSize: 16 }} />;
    };

    const perf = getPerformanceIndicator(priceChange);
    const barWidth = getBarWidthPercent(volume);

    return (
      <Tooltip placement="top" title={tooltipText} key={label || dateStr}>
        <Paper
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
            border: (() => {
              if (isTodayDate) return "2px solid #1976d2";
              if (selectedMatrix === "volatility" && volatility >= 0.06)
                return "4px solid #d24419ff";
              if (selectedMatrix === "volume" && volume > 500000)
                return "4px solid #d2197fff";
              if (selectedMatrix === "performance" && priceChange === 1)
                return "4px solid #2519d2ff";
              return "1px solid #ccc";
            })(),
            opacity: isFutureDate(date) ? 0.5 : 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
          >
            {label || date.format("DD MMM")}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
              Vol: {volatility?.toFixed(2) || "-"}
            </Typography>
            <br />
            <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
              Volu: {volume?.toFixed(0) || "-"}
            </Typography>
            <br />
            <Typography
              variant="caption"
              sx={{
                color: perf.color,
                fontWeight: "bold",
                fontSize: 16,
                lineHeight: 1.2,
              }}
            >
              {perf}
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              left: 4,
              height: 5,
              width: `${barWidth}%`,
              backgroundColor: "#1976d2",
              borderRadius: "4px",
              opacity: 0.8,
            }}
          />
        </Paper>
      </Tooltip>
    );
  };

  const getDailyCells = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const cells = [];
    let day = startOfMonth;

    while (day.isSameOrBefore(endOfMonth)) {
      const dateStr = day.format("YYYY-MM-DD");
      const entry = data[dateStr] || {};
      const volatility = entry.volatility || 0;
      const volume = entry.volume || 0;
      const priceChange =
        entry.performance === "up" ? 1 : entry.performance === "down" ? -1 : 0;
      const open = entry.open;
      const close = entry.close;
      const high = entry.high;
      const low = entry.low;

      cells.push(
        renderCell(day, null, {
          volatility,
          volume,
          priceChange,
          open,
          close,
          high,
          low,
        })
      );

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
      let performance = 0;
      let count = 0;
      let open = 0;
      let close = 0;
      let high = 0;
      let low = 0;

      for (let j = 0; j < 7; j++) {
        const date = weekStart.add(j, "day");
        const dateStr = date.format("YYYY-MM-DD");
        const entry = data[dateStr];

        if (entry) {
          weeklyVol += entry.volatility || 0;
          totalVolu += entry.volume || 0;
          performance =
            entry.performance === "up"
              ? 1
              : entry.performance === "down"
              ? -1
              : 0;
          count++;
          open = entry.open;
          close = entry.close;
          high = entry.high;
          low = entry.low;
        }
      }

      const avgVol = count ? weeklyVol / count : 0;
      const perf = performance;

      cells.push(
        renderCell(
          weekStart,
          `${weekStart.format("DD MMM")} - ${weekEnd.format("DD MMM")}`,
          {
            volatility: avgVol,
            volume: totalVolu,
            priceChange: perf,
            open,
            close,
            high,
            low,
          }
        )
      );
    }

    return cells.reverse();
  };

  const getMonthlyCells = () => {
    const yearStart = currentDate.startOf("year");
    const cells = [];

    for (let i = 0; i < 12; i++) {
      const monthStart = yearStart.add(i, "month");
      const monthEnd = monthStart.endOf("month");

      let monthVol = 0;
      let totalVolu = 0;
      let performance = 0;
      let count = 0;
      let open = 0;
      let close = 0;
      let high = 0;
      let low = 0;

      for (
        let d = monthStart;
        d.isSameOrBefore(monthEnd);
        d = d.add(1, "day")
      ) {
        const dateStr = d.format("YYYY-MM-DD");
        const entry = data[dateStr];
        if (entry) {
          monthVol += entry.volatility || 0;
          totalVolu += entry.volume || 0;
          performance =
            entry.performance === "up"
              ? 1
              : entry.performance === "down"
              ? -1
              : 0;
          count++;
          open = entry.open;
          close = entry.close;
          high = entry.high;
          low = entry.low;
        }
      }

      const avgVol = count ? monthVol / count : 0;
      const perf = performance;

      cells.push(
        renderCell(monthStart, monthStart.format("MMMM"), {
          volatility: avgVol,
          volume: totalVolu,
          priceChange: perf,
          open,
          close,
          high,
          low,
        })
      );
    }

    return cells;
  };

  const getTitle = () => {
    if (view === "daily") return currentDate.format("MMMM YYYY");
    if (view === "weekly") return null;
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

      <Box
        id="calendar-zoom-container"
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        sx={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.1s ease-out",
        }}
      >
        {renderCells()}
      </Box>

      <Typography variant="caption" align="center" display="block" mt={1}>
        Zoom: {(scale * 100).toFixed(0)}%
      </Typography>
    </Box>
  );
};

export default CalendarView;

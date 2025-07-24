import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  parseISO,
  addWeeks,
  subWeeks,
  startOfYear,
  endOfYear,
  addYears,
  subYears,
} from "date-fns";

const CalendarView = ({ data, view, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef(null);

  const handlePrev = () => {
    setCurrentDate((prev) =>
      view === "monthly"
        ? subMonths(prev, 1)
        : view === "weekly"
        ? subWeeks(prev, 15)
        : subWeeks(prev, 8)
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === "monthly"
        ? addMonths(prev, 1)
        : view === "weekly"
        ? addWeeks(prev, 15)
        : addWeeks(prev, 8)
    );
  };

  const getCalendarCells = () => {
    const today = new Date();

    if (view === "daily") {
      const end = today;
      const start = subWeeks(end, 8); // ~60 days
      return eachDayOfInterval({ start, end });
    } else if (view === "weekly") {
      const end = today;
      const weeks = [];
      for (let i = 14; i >= 0; i--) {
        weeks.push(subWeeks(end, i)); // 15 weeks
      }
      return weeks;
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const cells = getCalendarCells();

  const handleKeyDown = useCallback(
    (e, date) => {
      const index = cells.findIndex((d) => isSameDay(d, date));
      let newIndex = index;
      if (e.key === "ArrowRight") newIndex++;
      else if (e.key === "ArrowLeft") newIndex--;
      else if (e.key === "ArrowDown") newIndex += 7;
      else if (e.key === "ArrowUp") newIndex -= 7;
      else if (e.key === "Enter") onDateSelect(format(date, "yyyy-MM-dd"));
      else if (e.key === "Escape") containerRef.current?.blur();

      if (newIndex >= 0 && newIndex < cells.length) {
        document.getElementById(`cell-${newIndex}`)?.focus();
      }
    },
    [cells, onDateSelect]
  );

  const headingLabel =
    view === "monthly"
      ? format(currentDate, "MMMM yyyy")
      : view === "weekly"
      ? "Last 15 Weeks"
      : "Last 60 Days";

  return (
    <Box mt={4} ref={containerRef}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <IconButton onClick={handlePrev}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">{headingLabel}</Typography>
        <IconButton onClick={handleNext}>
          <ArrowForward />
        </IconButton>
      </Box>

      <Grid
        container
        spacing={1}
        mt={2}
        columns={view === "monthly" ? 7 : 5}
      >
        {cells.map((date, index) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const cellData = data[dateStr];
          const isSelected =
            selectedDate && isSameDay(parseISO(selectedDate), date);

          return (
            <Grid
              key={dateStr}
              item
              xs={view === "monthly" ? 1 : 1}
              tabIndex={0}
              id={`cell-${index}`}
              onKeyDown={(e) => handleKeyDown(e, date)}
              onClick={() => onDateSelect(dateStr)}
              sx={{
                p: 1,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: isSelected
                  ? "lightblue"
                  : isToday(date)
                  ? "#e0f7fa"
                  : "white",
                cursor: "pointer",
                outline: "none",
                "&:focus": { boxShadow: "0 0 0 2px #1976d2" },
              }}
            >
              <Typography variant="subtitle2">
                {view === "weekly"
                  ? `Week of ${format(date, "dd MMM")}`
                  : format(date, "dd MMM")}
              </Typography>
              {cellData ? (
                <>
                  <Typography variant="caption">
                    Vol: {cellData.volatility}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    Volu: {cellData.volume}
                  </Typography>
                </>
              ) : (
                <Typography variant="caption">No data</Typography>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarView;

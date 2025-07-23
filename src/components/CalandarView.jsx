import React from "react";
import { Grid, Paper, Typography, Tooltip } from "@mui/material";
import dayjs from "dayjs";

const CalendarView = ({ data, view, onDateSelect, range }) => {
  const today = dayjs().format("YYYY-MM-DD");

  const generateDates = () => {
    if (view === "daily") {
      return Array.from({ length: 30 }, (_, i) =>
        dayjs().subtract(29 - i, "day").format("YYYY-MM-DD")
      );
    } else if (view === "weekly") {
      return Array.from({ length: 15 }, (_, i) => {
        const startOfWeek = dayjs().subtract((14 - i) * 7, "day");
        const endOfWeek = startOfWeek.add(6, "day");

        // Aggregate data
        let totalVolatility = 0;
        let totalVolume = 0;
        let count = 0;

        for (let d = 0; d < 7; d++) {
          const date = startOfWeek.add(d, "day").format("YYYY-MM-DD");
          if (data[date]) {
            totalVolatility += parseFloat(data[date].volatility);
            totalVolume += parseFloat(data[date].volume);
            count++;
          }
        }

        const avgVolatility = count ? (totalVolatility / count).toFixed(2) : null;
        const avgVolume = count ? Math.floor(totalVolume / count) : null;

        return {
          label: `${startOfWeek.format("MMM D")} - ${endOfWeek.format("MMM D")}`,
          date: startOfWeek.format("YYYY-MM-DD"),
          metrics: count
            ? {
                volatility: avgVolatility,
                volume: avgVolume,
              }
            : null,
        };
      });
    } else {
      // monthly fallback - last 40 days
      return Array.from({ length: 40 }, (_, i) =>
        dayjs().subtract(39 - i, "day").format("YYYY-MM-DD")
      );
    }
  };

  const dates = generateDates();

  return (
    <Grid container spacing={1} mt={2}>
      {dates.map((entry, index) => {
        const isWeekly = view === "weekly";
        const dateStr = isWeekly ? entry.date : entry;
        const label = isWeekly ? entry.label : dateStr;
        const metrics = isWeekly ? entry.metrics : data[dateStr];
        const isToday = dateStr === today;

        const isInRange =
          range?.start &&
          range?.end &&
          dayjs(dateStr).isAfter(dayjs(range.start).subtract(1, "day")) &&
          dayjs(dateStr).isBefore(dayjs(range.end).add(1, "day"));

        const backgroundColor = metrics
          ? metrics.volatility < 0.3
            ? "#C8E6C9"
            : metrics.volatility < 0.6
            ? "#FFECB3"
            : "#FFCDD2"
          : "#F5F5F5";

        return (
          <Grid
            item
            xs={view === "daily" ? 3 : view === "weekly" ? 4 : 2}
            key={dateStr + index}
          >
            <Tooltip
              title={
                <div>
                  <div>
                    <strong>{isWeekly ? "Week:" : "Date:"}</strong> {label}
                  </div>
                  <div>
                    <strong>Volatility:</strong> {metrics?.volatility ?? "N/A"}
                  </div>
                  <div>
                    <strong>Volume:</strong> {metrics?.volume ?? "N/A"}
                  </div>
                </div>
              }
              arrow
              placement="top"
            >
              <Paper
                sx={{
                  backgroundColor: isInRange ? "#e3f2fd" : backgroundColor,
                  height: 80,
                  padding: 1,
                  cursor: "pointer",
                  border: isToday ? "2px solid black" : "1px solid #ccc",
                  "&:hover": { opacity: 0.85 },
                }}
                onClick={() => onDateSelect(dateStr)}
              >
                <Typography variant="caption">
                  {view === "weekly" ? label : dateStr}
                </Typography>
                <Typography variant="body2">
                  Vol: {metrics?.volatility ?? "--"}
                </Typography>
                <Typography variant="body2">
                  Volu: {metrics?.volume ?? "--"}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CalendarView;
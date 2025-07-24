import React from "react";
import { Grid, Paper, Typography, Tooltip } from "@mui/material";
import dayjs from "dayjs";

const CalendarView = ({ data, view, onDateSelect, selectedDate }) => {
  const today = new Date().toISOString().split("T")[0];

  const generateDates = () => {
    const dates = [];

    if (view === "daily") {
      for (let i = 29; i >= 0; i--) {
        const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
        dates.push(date);
      }
    } else if (view === "weekly") {
      for (let i = 14; i >= 0; i--) {
        const startOfWeek = dayjs().subtract(i * 7, "day");
        const weekDates = Array.from({ length: 7 }, (_, j) =>
          startOfWeek.add(j, "day").format("YYYY-MM-DD")
        );
        dates.push(weekDates);
      }
    } else if (view === "monthly") {
      for (let i = 11; i >= 0; i--) {
        const month = dayjs().subtract(i, "month").format("YYYY-MM");
        const daysInMonth = dayjs(month + "-01").daysInMonth();
        const monthDates = Array.from({ length: daysInMonth }, (_, j) =>
          dayjs(month + "-01")
            .add(j, "day")
            .format("YYYY-MM-DD")
        );
        dates.push({ month, dates: monthDates });
      }
    }

    return dates;
  };

  const computeMetrics = (dateGroup) => {
    if (typeof dateGroup === "string") {
      const metrics = data[dateGroup];
      return metrics
        ? {
            volatility: metrics.volatility,
            volume: metrics.volume,
            label: dateGroup,
            date: dateGroup,
          }
        : null;
    } else if (Array.isArray(dateGroup)) {
      const valid = dateGroup.filter((d) => data[d]);
      if (!valid.length) return null;
      const avgVol = (
        valid.reduce((sum, d) => sum + (data[d]?.volatility || 0), 0) /
        valid.length
      ).toFixed(2);
      const avgVolu = Math.round(
        valid.reduce((sum, d) => sum + (data[d]?.volume || 0), 0) / valid.length
      );
      return {
        volatility: avgVol,
        volume: avgVolu,
        label:
          dayjs(valid[0]).format("MMM D") +
          " - " +
          dayjs(valid[valid.length - 1]).format("MMM D"),
        date: valid[0],
      };
    } else if (typeof dateGroup === "object" && dateGroup.month) {
      const valid = dateGroup.dates.filter((d) => data[d]);
      if (!valid.length) return null;
      const avgVol = (
        valid.reduce((sum, d) => sum + (data[d]?.volatility || 0), 0) /
        valid.length
      ).toFixed(2);
      const avgVolu = Math.round(
        valid.reduce((sum, d) => sum + (data[d]?.volume || 0), 0) / valid.length
      );
      return {
        volatility: avgVol,
        volume: avgVolu,
        label: dateGroup.month,
        date: valid[0],
      };
    }
  };

  const dateGroups = generateDates();

  return (
    <Grid container spacing={1} mt={2}>
      {dateGroups.map((group, index) => {
        const metrics = computeMetrics(group);
        if (!metrics) return null;

        const backgroundColor =
          metrics.volatility < 0.3
            ? "#C8E6C9"
            : metrics.volatility < 0.6
            ? "#FFECB3"
            : "#FFCDD2";

        const isSelected = metrics.date === selectedDate;
        const isToday = metrics.date === today;

        return (
          <Grid
            item
            xs={view === "daily" ? 3 : view === "weekly" ? 2 : 2}
            key={index}
          >
            <Tooltip
              title={
                <div>
                  <div>
                    <strong>{metrics.label}</strong>
                  </div>
                  <div>
                    <strong>Volatility:</strong> {metrics.volatility}
                  </div>
                  <div>
                    <strong>Volume:</strong> {metrics.volume}
                  </div>
                </div>
              }
              arrow
              placement="top"
            >
              <Paper
                sx={{
                  backgroundColor,
                  height: 80,
                  padding: 1,
                  cursor: "pointer",
                  border: isSelected
                    ? "2px solid black"
                    : isToday
                    ? "2px solid green"
                    : "1px solid #ccc",
                  "&:hover": { opacity: 0.85 },
                }}
                onClick={() => {
                  if (typeof group === "string") {
                    onDateSelect(group);
                  } else if (Array.isArray(group)) {
                    onDateSelect(group[0]);
                  } else if (typeof group === "object" && group.dates?.length) {
                    onDateSelect(group.dates[0]);
                  }
                }}
              >
                <Typography variant="caption">{metrics.label}</Typography>
                <Typography variant="body2">
                  Vol: {metrics.volatility}
                </Typography>
                <Typography variant="body2">
                  Volu: {metrics.volume}
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
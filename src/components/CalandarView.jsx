import React from 'react';
import { Grid, Paper, Typography, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

const CalendarView = ({ data, view, onDateSelect, range }) => {
  const today = new Date().toISOString().split('T')[0];

  // Last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return (
    <Grid container spacing={1} mt={2}>
      {days.map((dateStr) => {
        const metrics = data[dateStr];
        const isToday = dateStr === today;

        // 🟦 Highlight if date is within selected range
        const isInRange =
          range?.start &&
          range?.end &&
          dayjs(dateStr).isAfter(dayjs(range.start).subtract(1, 'day')) &&
          dayjs(dateStr).isBefore(dayjs(range.end).add(1, 'day'));

        const backgroundColor = isInRange
          ? '#e3f2fd' // light blue for range
          : metrics
          ? metrics.volatility < 0.3
            ? '#C8E6C9' // green
            : metrics.volatility < 0.6
            ? '#FFECB3' // yellow
            : '#FFCDD2' // red
          : '#F5F5F5'; // no data

        return (
          <Grid item xs={view === 'daily' ? 3 : view === 'weekly' ? 2 : 1} key={dateStr}>
            <Tooltip
              title={
                <div>
                  <div><strong>Date:</strong> {dateStr}</div>
                  <div><strong>Volatility:</strong> {metrics?.volatility ?? 'N/A'}</div>
                  <div><strong>Volume:</strong> {metrics?.volume ?? 'N/A'}</div>
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
                  cursor: 'pointer',
                  border: isToday ? '2px solid black' : '1px solid #ccc',
                  '&:hover': { opacity: 0.85 },
                }}
                onClick={() => onDateSelect(dateStr)}
              >
                <Typography variant="caption">{dateStr}</Typography>
                <Typography variant="body2">
                  Vol: {metrics?.volatility ?? '--'}
                </Typography>
                <Typography variant="body2">
                  Volu: {metrics?.volume ?? '--'}
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

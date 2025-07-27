import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";

const SymbolFilter = ({ symbol, interval, metric, onSymbolChange, onIntervalChange, onMetricChange }) => {
  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];
  const intervals = ["1d", "1h", "4h"];
  const metrics = ["all", "volatility", "volume", "performance"];

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Symbol</InputLabel>
          <Select value={symbol} label="Symbol" onChange={(e) => onSymbolChange(e.target.value)}>
            {symbols.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Interval</InputLabel>
          <Select value={interval} label="Interval" onChange={(e) => onIntervalChange(e.target.value)}>
            {intervals.map((i) => (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Metric</InputLabel>
          <Select value={metric} label="Metric" onChange={(e) => onMetricChange(e.target.value)}>
            {metrics.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SymbolFilter;

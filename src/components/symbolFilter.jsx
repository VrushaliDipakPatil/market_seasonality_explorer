import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const SymbolFilter = ({
  symbol,
  onChange,
  interval,
  onIntervalChange,
  selectedMatrix,
  onMatrixChange,
}) => {
  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];
  const intervals = ["1h", "4h", "1d"];
  const matrices = ["volatility", "volume", "performance"];

  return (
    <Box display="flex" gap={2} mt={2}>
      <FormControl fullWidth>
        <InputLabel>Symbol</InputLabel>
        <Select
          value={symbol}
          label="Symbol"
          onChange={(e) => onChange(e.target.value)}
        >
          {symbols.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Interval</InputLabel>
        <Select
          value={interval}
          label="Interval"
          onChange={(e) => onIntervalChange(e.target.value)}
        >
          {intervals.map((int) => (
            <MenuItem key={int} value={int}>
              {int}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Matrix</InputLabel>
        <Select
          value={selectedMatrix}
          label="Matrix"
          onChange={(e) => onMatrixChange(e.target.value)}
        >
          {matrices.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SymbolFilter;

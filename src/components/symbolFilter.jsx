import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SymbolFilter = ({ symbol, onChange }) => {
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Symbol</InputLabel>
      <Select value={symbol} label="Symbol" onChange={(e) => onChange(e.target.value)}>
        {symbols.map((sym) => (
          <MenuItem value={sym} key={sym}>
            {sym}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SymbolFilter;

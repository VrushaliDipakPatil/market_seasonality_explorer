import React from "react";
import { Box, TextField, Typography } from "@mui/material";

const DateRangeSelector = ({ label, range, onChange }) => {
  return (
    <Box mb={2}>
      <Typography>{label}</Typography>
      <TextField
        type="date"
        value={range.start || ""}
        onChange={(e) => onChange("start", e.target.value)}
        size="small"
        sx={{ mr: 1}}
      />
      <TextField
        type="date"
        value={range.end || ""}
        onChange={(e) => onChange("end", e.target.value)}
        size="small"
        sm={{ mt: 1 }}
      />
    </Box>
  );
};

export default DateRangeSelector;

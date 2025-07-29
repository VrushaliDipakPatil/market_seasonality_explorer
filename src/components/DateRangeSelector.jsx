import React from "react";
import { Box, TextField, Typography } from "@mui/material";

const DateRangeSelector = ({ label, range, onChange }) => {
  return (
<Box
  mb={2}
  display="flex"
  flexDirection={{ xs: "column", sm: "row" }}
  alignItems="center"
>
  <Typography sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}>{label}</Typography>
  <TextField
    type="date"
    value={range.start || ""}
    onChange={(e) => onChange("start", e.target.value)}
    size="small"
    sx={{ mr: { sm: 1 }, mb: { xs: 1, sm: 0 } }}
  />
  <TextField
    type="date"
    value={range.end || ""}
    onChange={(e) => onChange("end", e.target.value)}
    size="small"
  />
</Box>

  );
};

export default DateRangeSelector;

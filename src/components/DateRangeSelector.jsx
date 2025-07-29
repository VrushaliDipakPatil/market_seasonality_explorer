import React from "react";
import { Box, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DateRangeSelector = ({ label, range, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      mb={2}
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems="center"
    >
      <Typography sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}>
        {label}
      </Typography>

      <TextField
        type="date"
        value={range.start || ""}
        onChange={(e) => onChange("start", e.target.value)}
        size={isMobile ? undefined : "small"}
        fullWidth
        sx={{
          mr: { sm: 1 },
          mb: { xs: 1, sm: 0 },
          minWidth: { sm: 160 },
        }}
      />

      <TextField
        type="date"
        value={range.end || ""}
        onChange={(e) => onChange("end", e.target.value)}
        size={isMobile ? undefined : "small"}
        fullWidth
        sx={{
          minWidth: { sm: 160 },
          mt: { xs: 1, sm: 1 },
        }}
      />
    </Box>
  );
};

export default DateRangeSelector;

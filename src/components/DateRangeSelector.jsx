import React from "react";
import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DateRangeSelector = ({ label, range, onChange }) => {
  return (
    <Box
      mb={2}
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems="center"
    >
      <Typography
        sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 }, whiteSpace: "nowrap" }}
      >
        {label}
      </Typography>

      <DatePicker
        label="Start Date"
        value={range.start ? dayjs(range.start) : null}
        onChange={(newValue) =>
          onChange("start", newValue ? newValue.format("YYYY-MM-DD") : "")
        }
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            placeholder: "mm/dd/yyyy",
            sx: {
              mr: { sm: 1 },
              mb: { xs: 1, sm: 0 },
              minWidth: { sm: 160, xs: "100%" },
              mt: { xs: 1, sm: 1 },
            },
          },
        }}
      />

      <DatePicker
        label="End Date"
        value={range.end ? dayjs(range.end) : null}
        onChange={(newValue) =>
          onChange("end", newValue ? newValue.format("YYYY-MM-DD") : "")
        }
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            placeholder: "mm/dd/yyyy",
            sx: {
              mr: { sm: 1 },
              mb: { xs: 1, sm: 0 },
              minWidth: { sm: 160, xs: "100%" },
              mt: { xs: 1, sm: 1 },
            },
          },
        }}
      />
    </Box>
  );
};

export default DateRangeSelector;

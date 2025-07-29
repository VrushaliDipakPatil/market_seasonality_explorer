import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ViewSwitcher = ({ view, onChange }) => {
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(_, newView) => newView && onChange(newView)}
      sx={{ mt: 2 }}
    >
      <ToggleButton value="daily">Daily</ToggleButton>
      <ToggleButton value="weekly">Weekly</ToggleButton>
      <ToggleButton value="monthly">Monthly</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewSwitcher;

import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { exportAsImage, exportAsPDF, exportAsCSV } from "../utils/exportUtils";

const ExportButtons = ({ exportTargetId, csvData }) => {
  return (
    <ButtonGroup sx={{ mt: 2 , mb: 2 }}>
      <Button variant="outlined" onClick={() => exportAsPDF(exportTargetId)}>
        Export PDF
      </Button>
      <Button variant="outlined" onClick={() => exportAsImage(exportTargetId)}>
        Export Image
      </Button>
      <Button variant="outlined" onClick={() => exportAsCSV(csvData)}>
        Export CSV
      </Button>
    </ButtonGroup>
  );
};

export default ExportButtons;

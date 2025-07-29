import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarAlert = ({ open, message, onClose, severity = "info" }) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        width: "30%",
        maxWidth: "100vw",
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1rem",
          "& .MuiAlert-message": {
            width: "100%",
            textAlign: "center",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;

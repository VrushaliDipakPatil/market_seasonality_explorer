// src/components/SnackbarAlert.jsx
import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

const SlideUp = (props) => <Slide {...props} direction="up" />;

const SnackbarAlert = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        width: "100%",
        left: 0,
        right: 0,
        bottom: 0,
        maxWidth: "100vw",
      }}
    >
      <Alert
        onClose={onClose}
        severity="info"
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

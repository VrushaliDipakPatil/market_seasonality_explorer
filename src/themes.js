import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export const highContrastTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#121212",
    },
    text: {
      primary: "#ffffff",
      secondary: "#dddddd",
    },
    divider: "#444444",
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
        notchedOutline: {
          borderColor: "#ffffff",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#ffffff",
        },
      },
    },
  },
});

export const colorblindFriendlyTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0072B2", // blue
    },
    secondary: {
      main: "#E69F00", // orange
    },
    background: {
      default: "#F9F9F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#333333",
    },
  },
});

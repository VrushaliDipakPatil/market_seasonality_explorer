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
      main: "#205375",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f66b0e",
    },
    background: {
      default: "#e8f3f3ff",
      paper: "#e8f3f3ff",
    },
    text: {
      primary: "#131111ff",
      secondary: "#0f0f13ff",
    },
    divider: "#444444",
  },
  typography: {
    fontSize: 14,
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#0e0c0cff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#0c0b0bff",
        },
        notchedOutline: {
          borderColor: "#0e0c0cff",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#111010ff",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: "#131111ff",
          "&.Mui-selected": {
            backgroundColor: "#205375",
            color: "#fff",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
        },
      },
    },
  },
});


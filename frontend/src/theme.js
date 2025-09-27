import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e"
    },
    text: {
      primary: "#ffffff"
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;

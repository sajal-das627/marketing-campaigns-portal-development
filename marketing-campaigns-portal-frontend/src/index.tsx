import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NotificationProvider from "./components/Notifications/NotificationProvider";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4263EB",
    },
    secondary: {
      main: "#6D6976",
    },
    background: {
      default: "#F7F9FF",
    },
    text:{
      primary:"#232232",
      secondary:"#6D6976"
    }
  },
  typography: {
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </Provider>
);

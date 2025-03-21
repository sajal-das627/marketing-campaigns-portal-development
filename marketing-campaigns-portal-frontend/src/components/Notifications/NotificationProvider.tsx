import React from "react";
import { SnackbarProvider } from "notistack";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;

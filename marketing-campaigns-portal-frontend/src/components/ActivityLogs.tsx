import 
// React, 
{ useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import apiClient from "../api/apiClient";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get("/activity-logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">📝 Activity Logs</Typography>
      {logs.map((log) => (
        <Paper key={log._id} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">{log.action}</Typography>
          <Typography>{log.message}</Typography>
          <Typography variant="caption">{new Date(log.timestamp).toLocaleString()}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ActivityLogs;

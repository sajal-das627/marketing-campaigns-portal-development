import 
// React, 
{ useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import apiClient from "../api/apiClient";

const Analytics = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get("/analytics/report").then((res) => setAnalytics(res.data));
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">📊 Campaign Analytics</Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics}>
            <XAxis dataKey="campaign[0].name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="averageOpenRate" stroke="#8884d8" name="Avg Open Rate" />
            <Line type="monotone" dataKey="averageClickRate" stroke="#82ca9d" name="Avg Click Rate" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Analytics;

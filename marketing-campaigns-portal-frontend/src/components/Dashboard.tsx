import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import apiClient from "../api/apiClient";

const Dashboard = () => {
  const [campaignMetrics, setCampaignMetrics] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const campaigns = await apiClient.get("/campaigns");
      const logs = await apiClient.get("/activity-logs");
      setCampaignMetrics(campaigns.data);
      setActivityLogs(logs.data);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>📊 Marketing Dashboard</Typography>

      <Grid container spacing={3}>
        {/* Campaign Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Active Campaigns</Typography>
            <Typography variant="h3">{campaignMetrics.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Total Emails Sent</Typography>
            <Typography variant="h3">
              {campaignMetrics.reduce((acc, cur) => acc + (cur.emailsSent || 0), 0)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Conversion Rate (%)</Typography>
            <Typography variant="h3">
              {(
                campaignMetrics.reduce((acc, cur) => acc + (cur.conversionRate || 0), 0) /
                campaignMetrics.length
              ).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Campaign Performance Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">📈 Campaign Performance (Opens & Clicks)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignMetrics}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="openRate" fill="#1976d2" name="Open Rate" />
                <Bar dataKey="clickRate" fill="#ff9800" name="Click Rate" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity Logs */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">📝 Recent Activity Logs</Typography>
            <ul>
              {activityLogs.slice(0, 5).map((log, index) => (
                <li key={index}>
                  <strong>{log.action}</strong> - {log.message} ({new Date(log.timestamp).toLocaleString()})
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

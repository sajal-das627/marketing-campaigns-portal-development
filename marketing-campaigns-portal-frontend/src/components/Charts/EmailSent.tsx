import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Box, Typography, ButtonGroup, Button } from '@mui/material';
import { MonthlyStat } from 'types/dashboard';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EmailSentProps {
  data?: MonthlyStat[];
}

const EmailSent: React.FC<EmailSentProps> = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const timeFrames = ['daily', 'weekly', 'monthly'] as const;

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

  // const labels = data.map((d) => d.month);
  // Pick the right slice of EmailRate
  // const clickRates = data.map((d) => d[timeFrame].clickRate);
  // const openRates = data.map((d) => d[timeFrame].openRate);

  const labels = data.map((stat) => stat.month);

  const clickRates = data.map((stat) => {
    const campaigns = stat[timeFrame]?.campaigns || [];
    if (campaigns.length === 0) return 0;
    const totalClick = campaigns.reduce((sum, c) => sum + c.clickRate, 0);
    return Math.round(totalClick / campaigns.length); // average
  });

  const openRates = data.map((stat) => {
    const campaigns = stat[timeFrame]?.campaigns || [];
    if (campaigns.length === 0) return 0;
    const totalOpen = campaigns.reduce((sum, c) => sum + c.openRate, 0);
    return Math.round(totalOpen / campaigns.length); // average
  });

    return {
      labels,
      datasets: [
        {
          label: 'Click Rate',
          data: clickRates,
          backgroundColor: '#0057D9',
          borderRadius: 5,
          barPercentage: 0.8,
          categoryPercentage: 0.8
        },
        {
          label: 'Open Rate',
          data: openRates,
          backgroundColor: '#EAECF0',
          borderRadius: 5,
          barPercentage: 0.8,
          categoryPercentage: 0.8
        }
      ]
    };
  }, [data, timeFrame]);

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ flexDirection: { xs: 'column', md: 'row' } }}
        >
          <Typography variant="h6">Emails Sent</Typography>
          <Box bgcolor="#F7F9FF" p={1} borderRadius={2} border="1px solid #DEE2E6">
            <ButtonGroup variant="outlined" aria-label="time frame selection" sx={{ gap: 1 }}>
              {timeFrames.map((frame) => (
                <Button
                  key={frame}
                  onClick={() => setTimeFrame(frame)}
                  sx={{
                    borderRadius: '4px !important',
                    backgroundColor: timeFrame === frame ? '#0057D9' : '#FFFFFF',
                    color: timeFrame === frame ? '#FFFFFF' : '#000000',
                    borderColor: '#F7F9FF',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: timeFrame === frame ? '#0057D9' : '#FFFFFF',
                      borderColor: '#F7F9FF!important'
                    }
                  }}
                >
                  {frame.charAt(0).toUpperCase() + frame.slice(1)}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </Box>

        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { usePointStyle: true, pointStyle: 'circle' }
              },
              title: {
                display: true,
                text: `Email Stats (${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})`
              }
            },
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: { stacked: false, grid: { display: true }, ticks: { stepSize: 50 } }
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default EmailSent;

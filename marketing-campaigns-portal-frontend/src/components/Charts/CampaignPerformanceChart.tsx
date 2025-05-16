import React, { useState } from 'react';
import { Box, Typography, Button, ButtonGroup, Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MonthlyStat } from 'types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CampaignPerformanceChartProps {
  stats?: MonthlyStat[];
}

const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({stats}) => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const timeFrames = ['daily', 'weekly', 'monthly'] as const;
  if (!stats || stats.length === 0) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h6">No campaign performance data available.</Typography>
        </CardContent>
      </Card>
    );
  }

  const labels = stats.map((stat) => stat.month);
  const clickRates = stats.map((stat) => {
    const campaigns = stat[timeFrame]?.campaigns || [];
    if (campaigns.length === 0) return 0;
    const totalClick = campaigns.reduce((sum, c) => sum + c.clickRate, 0);
    return Math.round(totalClick / campaigns.length); // average
  });

  const openRates = stats.map((stat) => {
    const campaigns = stat[timeFrame]?.campaigns || [];
    if (campaigns.length === 0) return 0;
    const totalOpen = campaigns.reduce((sum, c) => sum + c.openRate, 0);
    return Math.round(totalOpen / campaigns.length); // average
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Open Rate %',
        data: clickRates,
        borderColor: '#3f51b5',
        backgroundColor: '#3f51b5',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Click Rate %',
        data: openRates,
        borderColor: '#ff9800',
        backgroundColor: '#ff9800',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  const handleTimeFrameChange = (frame: "daily" | "weekly" | "monthly") => {
    setTimeFrame(frame);
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" sx={{flexDirection:{xs:'column', md:'row'}}} alignItems="center" mb={2}>
          <Typography variant="h6" >Campaign Performance</Typography>
          <Box bgcolor={'#F7F9FF'} p={1} borderRadius={2} border={'1px solid #DEE2E6'}>
          <ButtonGroup variant="outlined" aria-label="time frame selection" sx={{gap: 1}}>
            {timeFrames.map((frame) => (
              <Button
                key={frame}
                onClick={() => handleTimeFrameChange(frame)}
                sx={{
                  borderColor: '#F7F9FF',
                  borderRadius: '4px !important',
                  backgroundColor: timeFrame === frame ? '#0057D9' : '#FFFFFF',
                  color: timeFrame === frame ? '#FFFFFF' : '#000000',                  
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: timeFrame === frame ? '#0057D9' : '#FFFFFF',
                    borderColor: '#F7F9FF!important',
                  },
                }}
              >
                {frame}
              </Button>
            ))}
          </ButtonGroup>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: { xs: '300px', md: '400px' }, position: 'relative' }}>
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignPerformanceChart;

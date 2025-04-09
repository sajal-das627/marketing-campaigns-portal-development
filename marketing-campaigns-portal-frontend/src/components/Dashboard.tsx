import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  styled,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Select, MenuItem, FormControl,
  useTheme, useMediaQuery,
  Container,
} from '@mui/material';
import { Types } from 'mongoose';
import CampaignPerformanceChart from './Charts/CampaignPerformanceChart';
import EmailSent from './Charts/EmailSent';

import { RootState } from '../../src/redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../src/redux/hooks';
import { fetchDashboardData } from '../../src/redux/slices/dashboardSlice';
import { TotalAudience, ScheduledCampaigns, ActiveCampaigns } from 'types/dashboard';

const StyledButton = styled(Button)({
  position: 'relative',
  border: '1.5px solid #0057D9',
  borderRadius: '6px',
  display: 'block',
  overflow: 'hidden',
  transition: 'all 0.5s ease-out',
  padding: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-110%',
    width: '110%',
    height: '100%',
    backgroundColor: '#0057D9',
    borderRadius: '0 15px 15px 0',
    transition: 'left 0.5s ease-out'
  },
  '&:hover': {
    backgroundColor: 'transparent',
    '& .MuiTypography-root': {
      color: '#fff  '
    },
    '&::before': {
      left: 0
    }
  },
});

const StyledText = styled(Typography)({
  position: 'relative',
  lineHeight: '30px',
  color: '#0057D9  ',
  transition: 'all 0.6s ease-out',
  zIndex: 2,
});

interface DashboardProps {

}

type AudienceKey = keyof TotalAudience; 
type ScheduledKey = keyof ScheduledCampaigns;
type ActiveKey = keyof ActiveCampaigns;

const Dashboard: React.FC<DashboardProps> = () => {
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeDropdownOption, setActiveDropdownOption] = useState<ActiveKey>("weekly");
  const [scheduleDropdownOption, setScheduleDropdownOption] = useState<ActiveKey>("weekly");
  const [audienceDropdownOption, setaudienceDropdownOption] = useState<AudienceKey>("monthly");
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  //demo api response
const campaignResponses: Array<{
  activeCampaigns: number;
  scheduledCampaigns: number;
  totalAudience: number;
  emailsSent: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  engagementMetrics: {
    openRate: string;
    clickRate: string;
  };
  recentActivity: Array<{
    id: Types.ObjectId;
    type: string;
    user: string;
    details: string;
    timeAgo: string;
  }>;
}> = [

    {
      activeCampaigns: 40,
      scheduledCampaigns: 12,
      totalAudience: 30500,
      emailsSent: {
        daily: 1000,
        weekly: 7000,
        monthly: 30000
      },
      engagementMetrics: {
        openRate: "75%",
        clickRate: "12%"
      },
      recentActivity: [
        {
          id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e52345"),          
          type: "New Campaign",
          user: "Michael Scott",
          details: "Created 'Spring Super Sale 2025'",
          timeAgo: "5m ago"
        },
        {
          id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e52346"), 
          type: "New Campaign",
          user: "Michael Scott",
          details: "Created 'Spring Super Sale 2025'",
          timeAgo: "5m ago"
        },        
      ]
    },

  ];
    console.log(campaignResponses[0].activeCampaigns);
    
    function timeAgo(date: number) {
      const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    
      const units = [
        { label: 'month', seconds: 2592000 },  // 30*24*60*60
        { label: 'week', seconds: 604800 },    // 7*24*60*60
        { label: 'day', seconds: 86400 },      // 24*60*60
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
      ];
    
      for (const unit of units) {
        const value = Math.floor(seconds / unit.seconds);
        if (value >= 1) {
          return `${value} ${unit.label}${value !== 1 ? 's' : ''} ago`;
        }
      }
    
      return 'just now';
    }
    
    
    
    const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
    
    useEffect(() => {
      const fetchData = async () => {
        const result = await dispatch(fetchDashboardData());
        if (fetchDashboardData.fulfilled.match(result)) {
          console.log("🎯 Data from payload:", result.payload);
        }
      };
      fetchData();
    }, [dispatch]);
    
    
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <Container>
    <Box sx={{
      p: 3, bgcolor: '#F8F9FE', maxWidth: '100%', overflow: 'hidden',
      // '& *': { color: '#495057' }
    }}>
      
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" marginBottom={{ xs: 1 }} >
          Dashboard&nbsp;
        </Typography>

        <Box display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          sx={{ gap: { xs: 1, sm: 1 } }}>
          <StyledButton variant="outlined" sx={{ mr: 2, p: 1 }}>
            <StyledText variant="button">
              View&nbsp;Reports
            </StyledText>
          </StyledButton>

          <StyledButton variant="outlined" sx={{ mr: 2, p: 1 }} onClick={()=> navigation('/templates')}>
            <StyledText variant="button" >
              Manage&nbsp;Templates
            </StyledText>
          </StyledButton>
          <Button onClick={()=> navigation('/create-campaign')} variant="contained" sx={{ minWidth: '180px',bgcolor: '#0057D9', color: '#fff  ', p: 1, ":hover": { bgcolor: '#2068d5' } }}>
            + Create&nbsp;Campaign
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ m: 1 }} component="img" src="/icons/active_campaigns.png" alt="Active Campaigns Icon" />

                <FormControl sx={{ width: 100 }}>
                  <Select
                    value={activeDropdownOption}
                    onChange={(e) => setActiveDropdownOption(e.target.value as ActiveKey)}
                    sx={{ fontSize: 10, height: 30, color: '#495057', }}
                  >
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="daily">Daily</MenuItem>
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="weekly">Weekly</MenuItem>
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography color='#495057' fontSize={'14px'} pb={1} pt={1} >Active Campaigns</Typography>
              <Box display="flex" justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{data?.activeCampaigns?.daily?.count}</Typography>
                <Typography variant="body2" color="#2B8A3E" bgcolor="#ECFDF3" display={'inline'} border="1px solid #D3F9D8" borderRadius='6px' p={'4px'} >
                  ↑ 12%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ m: 1 }} component="img" src="/icons/schedule_campaigns.png" alt="Active Campaigns Icon" />
                <FormControl sx={{ width: 100 }}>
                  <Select
                    value={audienceDropdownOption}
                    onChange={(e) => setScheduleDropdownOption(e.target.value as ScheduledKey)}
                    sx={{ fontSize: 10, height: 30, color: '#495057' }}
                  >
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="daily">Daily</MenuItem>
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="weekly">Weekly</MenuItem>
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography color='#495057' fontSize={'14px'} pb={1} pt={1} >Scheduled Campaigns</Typography>
              <Box display="flex" justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{data?.scheduledCampaigns?.[scheduleDropdownOption]?.count}</Typography>
                <Typography variant="body2" color="#2B8A3E" bgcolor="#ECFDF3" display={'inline'} border="1px solid #D3F9D8" borderRadius='6px' p={'4px'} >
                  ↑ 8%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ m: 1 }} component="img" src="/icons/total_audience.png" alt="Active Campaigns Icon" />
                <FormControl sx={{ width: 100 }}>
                  <Select
                    value={audienceDropdownOption}
                    onChange={(e) => setaudienceDropdownOption(e.target.value as AudienceKey)}
                    sx={{ fontSize: 10, height: 30, color: '#495057' }}
                  >
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="daily">Daily</MenuItem>
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="weekly">Weekly</MenuItem>
                    <MenuItem sx={{ fontSize: 10, color: '#495057' }} value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography color='#495057' fontSize={'14px'} pb={1} pt={1} >Total Audience</Typography>
              <Box display="flex" justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" sx={{ color: 'black  ', fontWeight: 'bold' }}>{data?.totalAudience?.[audienceDropdownOption]?.count ?? 'NA'}</Typography>
                <Typography variant="body2" color="#2B8A3E" bgcolor="#ECFDF3" border="1px solid #D3F9D8" borderRadius='6px' display={'inline'} p={'4px'} >
                  ↑ 12%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


<Grid container spacing={3}>
      {/* Main Content */}
      <Grid  size={{ xs: 12, md: 8 }}>
        <Grid container spacing={3}>
          <Grid  size={{ xs: 12}}>

            <EmailSent />

          </Grid>
          <Grid  size={{ xs: 12}}>

            <CampaignPerformanceChart />

          </Grid>
        </Grid>
      </Grid>

      {/* Recent Activity Sidebar (Responsive) */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ order: isMobile ? 1 : "unset" }}>  
      
        <Card sx={{ borderRadius:2}}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Recent Activity
            </Typography>
            <List>
              <ListItem sx={{ alignItems: "flex-start", padding: { xs: 1, md: 2 },minHeight: { xs: 'auto', md: '64px' }, }}>
                <Box
                  component="img"
                  src="/icons/recent_activity.png"
                  alt="Activity Icon"
                  sx={{ width: 24, height: 24, mr: { xs: 1, md: 2 }, flexShrink: 0 }}
                />
                <ListItemText
                  primary="New Campaign"
                  secondary="Michael Scott created 'Spring Super Sale 2025' - 5 min ago"
                  sx={{ margin: 0 }}
                />
              </ListItem>


              {data?.recentActivity.map((activity) => (
                <ListItem key={activity._id.toString()} sx={{ alignItems: "flex-start", padding: { xs: 1, md: 2 },minHeight: { xs: 'auto', md: '64px' }, }}>

                  <Box component="img" src="/icons/recent_activity.png" alt="Activity Icon" sx={{ width: 24, height: 24, mr: { xs: 1, md: 2 }, flexShrink: 0 }} />

                  <ListItemText 
                    primary={activity.name}
                    secondary={`Michael Scott ${activity.name} - ${ timeAgo(activity.createdAt).toString() }`}
                    sx={{ margin: 0 }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </Box>
    </Container>
  );
};

export default Dashboard;
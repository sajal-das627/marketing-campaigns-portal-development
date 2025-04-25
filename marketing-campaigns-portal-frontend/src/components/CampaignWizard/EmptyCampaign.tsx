// import React from 'react'
import {
  Box,
    Container, 
    Button,
    Typography,
    Card,
} from '@mui/material'
import {useNavigate} from 'react-router-dom'


const EmptyCampaign = () => {
    const navigation = useNavigate();
    return (
      
          <Container sx={{py: 4, bgcolor: '#F8F9FE',  maxWidth: '80vw',}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography sx={{ fontSize: "26px", }} gutterBottom>
              Manage Campaign
            </Typography>
            <Button variant="contained" onClick={()=>navigation('/create-campaign')}
            sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, ":hover": { bgcolor: '#2068d5' } }}> +&nbsp;Create&nbsp;Campaign  </Button>
            </Box>
          
    <Card sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", pt: '10vh', pb: '10vh', mt:2, borderRadius: '6px'}}>
         <Box component="img" src="/images/noCampaignFound.png" alt="Activity Icon" sx={{ width: '400px', height: '350px', mr: { xs: 1, md: 2 }, flexShrink: 0 }} />
      
      <Typography sx={{color: '#6D6976', mb:2, fontSize:"16",}} >"No campaigns yet! Start by creating a new campaign."</Typography>
      <Button variant="contained" onClick={()=>navigation('/create-campaign')}
      sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, ":hover": { bgcolor: '#2068d5' } }}> +&nbsp;Create&nbsp;Campaign  </Button>
     
    
    </Card>
    </Container>
  )
}

export default EmptyCampaign
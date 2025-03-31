import React, { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import TvIcon from '@mui/icons-material/Tv';
import DescriptionIcon from "@mui/icons-material/Description";
import RateReviewIcon from "@mui/icons-material/RateReview";
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Types } from 'mongoose';
import {
  Container,
  Typography,  
  Box,
  Button,
  Grid2 as Grid,
  Card,  
  CardContent,
  Stepper, StepConnector, stepConnectorClasses,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Step2Templates from './Step2Templates';
import Step3Schedule from './Step3Schedule';
import Step4Review from './Step4Review';
import Step0CampaignType from './Step0CampaignType';
import { CampaignData } from '../../types/campaign';
import { createCampaign } from '../../redux/slices/campaignSlice';
import Step1Audience from './Step1Audience';
import SuccessModal from './SuccessModal';

const SpacedBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
const StyledCard = styled(Card)({
  display: "flex",
  alignItems: "center",
  padding: "16px",
  marginBottom: "16px",
  "@media (max-width:600px)": {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#0057D9',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#0057D9',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#B8B8B8',
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const steps = ['Campaign Type', 'Audience', 'Template', 'Schedule', 'Review & Launch'];
const stepIcons = [TvIcon, PeopleIcon, DescriptionIcon, CalendarTodayIcon, RateReviewIcon];
// const stepIcons = [
//   '/icons/presention-chart.png',
//   '/icons/people.png',
//   '/icons/description.png',
//   '/icons/calendar-today.png',
//   '/icons/rate-review.png',
// ];
export default function CampaignCreator() {
  
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState<number>(0);  
  const [audienceName ,setAudienceName] = useState<string>('');
  const [templateData ,setTemplateData] = useState<{name: string; type: string}>({
    name: '',
    type: 'Email',
  });
  const [campaignData, setCampaignData] = useState<CampaignData>({
    _id:"",
    name: '',
    type: "",
    audience:  null as Types.ObjectId | null,
    template:  null as Types.ObjectId | null,
    schedule: {      
      frequency: '',
      time: '09:00',
      startDate:  new Date(new Date().setDate(new Date().getDate() + 1)),
      endDate: new Date(),
    },
    status: "Draft",
    openRate: 0,
    ctr: 0,
    delivered: 0,
  });

  const handleNextStep = async() => {
  let errors: string[] = [];

  switch(activeStep) {    
    case 0:
      if (!campaignData.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(campaignData.name)) {
        errors.push("Campaign name should be 3-50 characters and contain only letters, numbers, and spaces. ");
      }
      if (!campaignData.type) {
        errors.push("Please select a campaign type.");
      }
      break;

    case 1:
      if (!campaignData.audience) {
        errors.push("Please select an audience.");
      }
      break;

    case 2:
      if (!campaignData.template) {
        errors.push("Please select a template.");
      }
      break;

    case 3:
      if (!campaignData.schedule?.frequency) {
        errors.push("Schedule frequency is required.");
      }
      if (!campaignData.schedule?.startDate) {
        errors.push("Start date is required.");
      }
      // if (campaignData.schedule?.endDate && new Date(campaignData.schedule.startDate) > new Date(campaignData.schedule.endDate)) {
      //   errors.push("End date must be after start date.");
      // }
      break;
    default:
      break;
    }
      if (errors.length > 0) {
        setValidationErrors(errors);
      return ;
    }
    setValidationErrors([]);
      
    console.log('Moving to next step:', activeStep);
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      try{
        const result = await dispatch(createCampaign(campaignData)).unwrap();
        setOpen(true);
        console.log("ShowSuccessModal:", open)
        console.log('Submitting final data: ', result);
      }catch(error){
        console.log('Error');
      }
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    console.log('Change event:', e.target.name, e.target.value);
    const { name, value } = e.target;
    const scheduleFields = ["frequency", "time", "startDate"];

    if (scheduleFields.includes(name)) {
      setCampaignData((prevData) => ({
        ...prevData,
        schedule: {
          ...prevData.schedule,
          [name]:
            name === "startDate" ? new Date(value) : value,
        },
      }));
    } else {
      setCampaignData((prevData) => ({
        ...prevData,
        [name]:
          name === "openRate" || name === "ctr" || name === "deliverd"
            ? Number(value)
            : name === "createdAt"
            ? new Date(value).toISOString()
            : value,
      }));
    }
  };

 const handleDateChange = (
  value: Dayjs | null,
  context: { validationError: any }
) => {
  if (value) {
    setCampaignData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        startDate: value.toDate(),
      },
    }));
  }
};
  console.log('campaignData: ', campaignData);
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step0CampaignType handleChange={handleChange} campaignData={campaignData} />;
      case 1:
        return <Step1Audience handleChange={handleChange}  campaignData={campaignData} setAudienceName={setAudienceName}  />
      case 2:
        return <Step2Templates handleChange={handleChange} campaignData={campaignData} templateData={templateData} setTemplateData={setTemplateData} />;
      case 3:
        return <Step3Schedule handleChange={handleChange} campaignData={campaignData} handleDateChange={handleDateChange} />;
      case 4:
        return <Step4Review campaignData={campaignData} audienceName={audienceName} templateData={templateData} />;
      default:
        return <Typography variant="h6">Unknown Step</Typography>;
    }
  };

  return (
    <Container sx={{ py: 4, bgcolor: '#F8F9FE', maxWidth: '80vw' }}>
      <Typography sx={{ fontSize: "26px", }} gutterBottom>
        Create a New Campaign
      </Typography>
      
      {validationErrors.length > 0 &&(
        <Alert variant='outlined' severity="warning" sx={{mb:1}}>
          {validationErrors[0]}
        </Alert>
      )}

      <Box >
        <Card>
          <CardContent>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<CustomConnector />}
              sx={{ mb: 4 }}
            >
              {steps.map((label, index) => {
                const IconComponent = stepIcons[index];
                return (
                  <Step key={label}>
                    <StepLabel
                      icon={
                         //code for exact figma image
                        //   <img
                        //   src={stepIcons[index]}
                        //   alt={label}
                        //   style={{
                        //     padding: 4,
                        //     borderRadius: '50%',
                        //     width: '24px',
                        //     height: '24px',
                        //     backgroundColor: activeStep >= index ? '#0057D9' : '#F5F5F5',
                        //   }}
                        // />
                        <IconComponent
                          sx={{
                            p: 1,
                            borderRadius: '50%',
                            color: activeStep >= index ? '#fff' : '#B8B8B8',
                            bgcolor: activeStep >= index ? '#0057D9' : '#F5F5F5',
                            '&.Mui-completed': { color: '#0057D9' },
                            width: { xs: '24px', sm: '30px', md: '35px' },
                            height: { xs: '24px', sm: '30px', md: '35px' },
                          }}
                        />
                      }
                      sx={{
                        flexDirection: 'column',
                        fontSize: { xs: '12px', sm: '15px' },
                        alignItems: 'center',
                        '& .MuiStepLabel-label': {
                          mt: 1,
                          textAlign: 'center',
                          fontSize: 'inherit',
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {renderStepContent(activeStep)}
            <SpacedBox sx={{ width: "100%", borderTop: '2px solid #E5E5E5', pt: 2 }}>
              <Grid container sx={{ justifyContent: "space-between" }}  >
                <Grid>
                  <Button
                    variant="outlined"
                    onClick={handlePreviousStep}
                    disabled={activeStep === 0}
                  >
                    Previous
                  </Button>
                </Grid>
                <Grid>
                  <Button sx={{ bgcolor: "#0057D9" }} variant="contained" onClick={handleNextStep}>
                    {(activeStep === steps.length - 1) ? 'Launch Campaign' : activeStep === 0 ? 'Next' : 'Save & Continue'}
                  </Button>
                  <SuccessModal open={open} onClose={() => setOpen(false)} />                    
                </Grid>
              </Grid>
              
            </SpacedBox>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
 
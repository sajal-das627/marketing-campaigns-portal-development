import React, { useEffect, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import TvIcon from '@mui/icons-material/Tv';
import DescriptionIcon from "@mui/icons-material/Description";
import RateReviewIcon from "@mui/icons-material/RateReview";
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Types } from 'mongoose';
import { useParams } from 'react-router-dom';
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
import { CampaignData, Schedule } from '../../types/campaign';
import { createCampaign, fetchCampaignById } from '../../redux/slices/campaignSlice';
import Step1Audience from './Step1Audience';
import SuccessModal from './SuccessModal';
import { useNavigate } from 'react-router-dom';
// import useUnsavedChangesWarning from '../../hooks/usePrompt';

import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { updateCampaign } from "../../redux/slices/campaignSlice";
import DeleteModal from '../Modals/DeleteModal';
import {DynamicIconProps} from '../../types/modal';
const SpacedBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
// const StyledCard = styled(Card)({
//   display: "flex",
//   alignItems: "center",
//   padding: "16px",
//   marginBottom: "16px",
//   "@media (max-width:600px)": {
//     flexDirection: "column",
//     alignItems: "flex-start",
//   },
// });

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

// const stepIcons = [
//   '/icons/presention-chart.png',
//   '/icons/people.png',
//   '/icons/description.png',
//   '/icons/calendar-today.png',
//   '/icons/rate-review.png',
// ];
export default function CampaignCreator() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState<Schedule>({} as Schedule);
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
    schedule: null,
    // {      
    //   frequency: '',
    //   time: '09:00',
    //   startDate:  new Date(new Date().setDate(new Date().getDate() + 1)),
    //   endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    // },
    status: "Draft",
    openRate: 0,
    ctr: 0,
    delivered: 0,
  });
  const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);

  const navigate = useNavigate();
  // useUnsavedChangesWarning(!isFormSaved);
  const handleExit = () => {
      // const leave = window.confirm('You have unsaved changes. Do you really want to leave?');
      // if (!leave) return;
    navigate('/'); 
  };

  let steps = [], stepIcons: React.ElementType[] = [];
  if(campaignData.type === "Real Time"){  
     steps = ['Campaign Type', 'Audience', 'Template', 'Review & Launch'];
     stepIcons = [TvIcon, PeopleIcon, DescriptionIcon, RateReviewIcon];
  }
  else{    
       steps = ['Campaign Type', 'Audience', 'Template', 'Schedule', 'Review & Launch'];
       stepIcons = [TvIcon, PeopleIcon, DescriptionIcon, CalendarTodayIcon, RateReviewIcon];
  }

  const { id } = useParams<{id: string}>();
  console.log("id: ", id);
  const campaignFromStore = useSelector((state: RootState) => state.campaign.selectedCampaign); 
  //Edited Mode Data Updates: 
  useEffect(() => {
    if (id) {
      dispatch(fetchCampaignById(id));
      setIsEditMode(true);
    }
  }, [id, dispatch]);

  // Update local state when the store updates
  useEffect(() => {
    if (campaignFromStore) {
      setCampaignData({
        ...campaignFromStore,
        schedule: campaignFromStore.schedule ? { ...campaignFromStore.schedule } : null,
      });
    }
  }, [campaignFromStore]);

  const resetState = () => {
    setCampaignData({
      _id: "",
      name: '',
      type: "",
      audience: null,
      template: null,
      schedule: null,
      // {      
      //   frequency: '',
      //   time: '09:00',
      //   startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      //   endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      // },
      status: "Draft",
      openRate: 0,
      ctr: 0,
      delivered: 0,
    });
  };
  
  useEffect(() => {
    if (!id) resetState();
  }, [id]);


  // useEffect(() => {
  //   if (campaignFromStore) {
  //     setCampaignData(campaignFromStore);
  //   }
  // }, [campaignFromStore]); 

  useEffect(() => {
    if (campaignData.type === "Real Time") {
      // Backup current schedule if it's not already null
      if (campaignData.schedule !== null) {
        setBackupSchedule(campaignData.schedule);
      }
      setCampaignData(prevData => ({
        ...prevData,
        schedule: null,
      }));
    } else {
      // Restore schedule when type changes back
      if (campaignData.schedule === null && backupSchedule) {
        setCampaignData(prevData => ({
          ...prevData,
          schedule: backupSchedule,
        }));
      }
    }
    console.log("Schedule: ", campaignData.schedule);
  }, [campaignData.type, campaignData.schedule, backupSchedule]); 

  const handleNextStep = async() => {
  let errors: string[] = [];

  switch(activeStep) {    
    case 0:
      if (!campaignData.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(campaignData.name)) {
        errors.push("Campaign name should be 3-50 characters and contain only letters, numbers, and spaces. ");
      }
      if (!campaignData.name || /^copy/i.test(campaignData.name.trim())) {
        errors.push("Campaign name should not start with 'Copy' ");
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
      if(campaignData.type !== "Real Time"){
        if (campaignData.type === "Criteria Based" && !campaignData.schedule?.frequency) {
          errors.push("Schedule frequency is required.");
        }
        if (campaignData.type === "Criteria Based" && !campaignData.schedule?.endDate) {
          errors.push("Valid End Date is required.");
        }
        if (!campaignData.schedule?.time) {
          errors.push("Time is required.");
        }
        
        if (!campaignData.schedule?.startDate) {
          errors.push("Start date is required.");
        } else {
          const startDate = new Date(campaignData.schedule?.startDate);
          const today = new Date();
          startDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
        
          if (startDate < today) {
            errors.push("Start date must be today or a future date.");
          } else if (startDate.getTime() === today.getTime() && campaignData.schedule?.time) {
            // Check time if it's today
            const [hours, minutes] = campaignData.schedule.time.split(":").map(Number);
            const selectedTime = new Date();
            selectedTime.setHours(hours, minutes, 0, 0);
        
            if (selectedTime < new Date()) {
              errors.push("Time must be in the future.");
            }
          }
        }
        
        if ( campaignData.schedule?.startDate && campaignData.schedule?.endDate && new Date(campaignData.schedule?.startDate) > new Date(campaignData.schedule?.endDate)) {
          errors.push("End date must be after start date.");
        }
        // if ( campaignData.schedule?.startDate && new Date(campaignData.schedule?.startDate) < new Date()) {
        //   errors.push("The start date cannot be earlier than today");
        // }
      }      
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
        const updatedData = { ...campaignData, status: "Scheduled" };
        
        if(isEditMode){
          const result = await dispatch(updateCampaign({ campaignId: String(id), updatedData })).unwrap();           
          console.log('Submitting final data: ', result);
          }
        else{
          const result = await dispatch(createCampaign(updatedData)).unwrap();
          console.log('Submitting final data: ', result);
        }        
        setOpen(true);
        setIsEditMode(false);
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
          ...(prevData.schedule || {}),
          [name]: name === "startDate" ? new Date(value) : value,
        },
      }));
    } else {
      setCampaignData((prevData) => ({
        ...prevData,
        [name]:
          name === "openRate" || name === "ctr" || name === "delivered"
            ? Number(value)
            : name === "createdAt"
            ? new Date(value).toISOString()
            : value,
      }));
    }
  };

 const handleDateChange = (
  value: Dayjs | null,
  type: "startDate"| "endDate",
  context: { validationError: any }
) => {  if (value) {
  setCampaignData((prev) => {
    if (type === "endDate" && prev?.schedule?.startDate && value.isBefore(dayjs(prev?.schedule?.startDate))) {
      // errors.push("End Date should be after Start Date");

      // alert("End date cannot be before start date!");
      return prev; // Do not update state
    }

    return {
      ...prev,
      schedule: {
        ...prev.schedule,
        [type]: value.toDate(), // Dynamically update startDate or endDate
      },
    };
  });
}
};

  console.log('campaignData: ', campaignData);
  console.log("isEditMode", isEditMode);
  const renderStepContent = (step: number) => {
    let adjustedStep = step;
    if(campaignData.type === "Real Time" && step >= 3){
      adjustedStep = step + 1;
    }
    switch (adjustedStep) {
      case 0:
        return <Step0CampaignType handleChange={handleChange} campaignData={campaignData} />;
      case 1:
        return <Step1Audience handleChange={handleChange}  campaignData={campaignData} audienceName={audienceName} setAudienceName={setAudienceName}  />
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
    <Container sx={{ display:'flex', flexDirection:'column', flexGrow:10, py: 4, bgcolor: '#F8F9FE', maxWidth: {xs: '100%',}, }}>
      <Typography sx={{ fontSize: "26px", }} gutterBottom>
        Create a New Campaign
      </Typography>
      
      {validationErrors.length > 0 &&(
        <Alert variant='outlined' severity="warning" sx={{mb:1}}>
          {validationErrors[0]}
        </Alert>
      )}

      <DeleteModal
        open={isDeleteModalopen}
        handleClose={() => setIsDeleteModalopen(false)}
        handleConfirm={handleExit}
        title="Exit Campaign"
        message="You have unsaved changes. Do you really want to leave?"
        btntxt = "Discard"
        icon = { { type: "cancel" } as DynamicIconProps }
        color = "warning"
      />

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
                            width: { xs: '35px',},
                            height: { xs: '35px',},
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
            <Box
          sx={{
            minwidth: '100%',
            minHeight: { xs: '300px', md: '400px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
            {renderStepContent(activeStep)}
            </Box>
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
                          <Button onClick={()=>setIsDeleteModalopen(true)} color="error" variant="contained" sx={{mr:1.5}}>exit</Button>
                  
                
                  <Button sx={{ bgcolor: "#0057D9" }} variant="contained" onClick={handleNextStep}>
                    {(activeStep === steps.length - 1) ? 'Launch Campaign' : activeStep === 0 ? 'Next' : 'Save & Continue'}
                  </Button>
                  <SuccessModal open={open} onClose={() => setOpen(false)}
                  title={id? "Campaign Updated Successfully" : "Campaign Created Successfully"}
                  message={`"${campaignData.name}" Campaign Saved Successfully`} />                    
                </Grid>
              </Grid>
              
            </SpacedBox>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
 
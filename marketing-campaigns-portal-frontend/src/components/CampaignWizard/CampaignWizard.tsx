import React, { useState } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Step1CampaignDetails from "./Step1CampaignDetails";
import Step2AudienceSelection from "./Step2AudienceSelection";
import Step3TemplateSelection from "./Step3TemplateSelection";
import Step4Scheduling from "./Step4Scheduling";
import Step5ReviewLaunch from "./Step5ReviewLaunch";


const steps = ["Campaign Details", "Audience Selection", "Template Selection", "Scheduling", "Review & Launch"];

const CampaignWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [campaignData, setCampaignData] = useState<any>({});

  const handleNext = (data?: any) => {
    if (data) setCampaignData({ ...campaignData, ...data });
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>🚀 Campaign Creation Wizard</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ marginTop: 4 }}>
        {activeStep === 0 && <Step1CampaignDetails onNext={handleNext} />}
        {activeStep === 1 && <Step2AudienceSelection onNext={handleNext} onBack={handleBack} />}
        {activeStep === 2 && <Step3TemplateSelection onNext={handleNext} onBack={handleBack} />}
        {activeStep === 3 && <Step4Scheduling onNext={handleNext} onBack={handleBack} />}
        {activeStep === 4 && <Step5ReviewLaunch data={campaignData} onBack={handleBack} />}
      </Box>
    </Box>
  );
};

export default CampaignWizard;

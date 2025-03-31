import React, { useState } from 'react'
import ChooseTemplateModal from './ChooseTemplateModal'
import { Container } from '@mui/material'


const TemplateManagement = () => {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(true);
    const [selectedTemplate, setSelectedTemplate] = useState<"email" | "sms">("email");
    const handleSelect = (template: "email" | "sms") => {
      setSelectedTemplate(template);
    };
  
    const handleConfirm = () => {
      console.log("Confirmed template:", selectedTemplate);
      setIsTemplateModalOpen(false);
    };
    console.log("template:", selectedTemplate);
  return (
    <Container>
    <div>TemplateManagement</div>

    <ChooseTemplateModal open={isTemplateModalOpen} onClose={()=>setIsTemplateModalOpen(false)}
      selectedTemplate={selectedTemplate}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      />
    </Container>
  )
}

export default TemplateManagement
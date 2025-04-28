import 
// React,
 { useState } from 'react'
import ChooseTemplateModal from './ChooseTemplateModal'
import { Container } from '@mui/material'
import {useNavigate } from 'react-router-dom';

const CreateTemplate = () => {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(true);
    const [selectedTemplate, setSelectedTemplate] = useState<"email" | "sms">("email");
    const handleSelect = (template: "email" | "sms") => {
      setSelectedTemplate(template);
    };
    const navigate = useNavigate();
  
    const handleConfirm = () => {
      console.log("Confirmed template:", selectedTemplate);
      if(selectedTemplate === "email"){
        navigate('/build-template');
      }
      else if(selectedTemplate === "sms"){
        navigate('/build-sms');
      }
      else{
        console.log('Type Not Found');
      }
      setIsTemplateModalOpen(false);
    };
    console.log("template:", selectedTemplate);
  return (
    <Container>
    <div>Create Template</div>

    <ChooseTemplateModal open={isTemplateModalOpen} onClose={()=>setIsTemplateModalOpen(false)}
      selectedTemplate={selectedTemplate}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      />
    </Container>
  )
}

export default CreateTemplate;
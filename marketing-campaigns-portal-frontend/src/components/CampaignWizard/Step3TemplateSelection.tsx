import React, { useEffect, useState } from "react";
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import  { getTemplates } from "../../api/apiClient";

const Step3TemplateSelection= ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getTemplates();
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates", error);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <Box>
      <Typography variant="h6">✉️ Choose a Template</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Select a Template</InputLabel>
        <Select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
          {templates.map((template) => (
            <MenuItem key={template._id} value={template._id}>{template.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={() => onNext({ template: selectedTemplate })} disabled={!selectedTemplate}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step3TemplateSelection;

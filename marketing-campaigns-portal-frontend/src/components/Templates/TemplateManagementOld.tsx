import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import  { createTemplate, getTemplates, deleteTemplate } from "../../api/apiClient";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await getTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates", error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!name || !subject || !content) return alert("All fields are required!");
    try {
      await createTemplate({ name, subject, content });
      alert("🎉 Template created successfully!");
      setName("");
      setSubject("");
      setContent("");
      fetchTemplates();
    } catch (error) {
      alert("❌ Error creating template");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      alert("🗑️ Template deleted!");
      fetchTemplates();
    } catch (error) {
      alert("❌ Error deleting template");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">📄 Template Management</Typography>

      <Box sx={{ mt: 3 }}>
        <TextField label="Template Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email Subject" fullWidth sx={{ mb: 2 }} value={subject} onChange={(e) => setSubject(e.target.value)} />
        <TextField label="Content" multiline rows={4} fullWidth sx={{ mb: 2 }} value={content} onChange={(e) => setContent(e.target.value)} />
        <Button variant="contained" onClick={handleCreateTemplate}>Save Template</Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">📂 Saved Templates</Typography>
        <List>
          {templates.map((template) => (
            <ListItem key={template._id} sx={{ borderBottom: "1px solid #ddd" }}>
              <ListItemText primary={template.name} secondary={`Subject: ${template.subject}`} />
              <IconButton onClick={() => handleDeleteTemplate(template._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TemplateManagement;

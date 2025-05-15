import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid2 as Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Chip,
  Autocomplete,
  Typography,
  InputBase,
  Dialog,
  IconButton,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import { useParams, useNavigate } from 'react-router-dom';

import { RootState } from "../../redux/store";
import {useAppDispatch} from '../../redux/hooks'
import { createTemplateThunk, getTemplateById, updateTemplate } from "../../redux/slices/templateSlice";
import { Template } from 'types/template';
import CloseIcon from '@mui/icons-material/Close';
import AllModal from '../Modals/DeleteModal';
import { useSelector } from "react-redux" ;

type TemplateType = 'Email' | 'SMS' | 'Basic' | 'Designed' | 'Custom';
type CategoryType =
  | 'Promotional'
  | 'Transactional'
  | 'Event Based'
  | 'Update'
  | 'Announcement'
  | 'Action'
  | 'Product'
  | 'Holiday';

const VARIABLE_OPTIONS = [
  'FirstName',
  'LastName',
  'FullName',
  'DiscountCode',
  'OrderID',
  'OrderStatus',
  'DeliveryDate',
  'StoreName',
  'ProductName',
];

interface TemplateEditorProps {
  template?: Template;
  campaigns?: string[];
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  campaigns = [],
}) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [form, setForm] = useState<Template>({
    _id: template?._id || '',
    name: template?.name || '',
    subject: template?.subject || '',
    type: template?.type || 'SMS',
    category: template?.category || 'Transactional',
    tags: template?.tags || [],
    senderId: template?.senderId || '',
    campaign: template?.campaign || '',
    includeOptOut: template?.includeOptOut ?? false,
    content: { message: template?.content.message || '' },
    layout: template?.layout || 'Custom',
    createdAt: template?.createdAt || '',
    lastModified: template?.lastModified || '',
    // approved: template?.approved ?? false,
    // approvedBy: template?.approvedBy || '',
    // approvedAt: template?.approvedAt || '',
    favorite: template?.favorite ?? false,
    isDeleted: template?.isDeleted ?? false,
    version: template?.version ?? 1,
  });
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const [form, setForm] = useState<Template>({
  //   name: template?.name || '',
  //   subject: template?.subject || '',
  //   type: template?.type || 'SMS',
  //   category: template?.category || 'Transactional',
  //   tags: template?.tags || [],
  //   senderId: template?.senderId || '',
  //   campaign: template?.campaign || '',
  //   includeOptOut: template?.includeOptOut ?? false,
  //   content: { message: template?.content.message || '' },
  // });

  const dispatch = useAppDispatch();

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = <K extends keyof Template>(field: K, value: Template[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (value: string) => {
    setForm((prev) => ({ ...prev, content: { message: value } }));
  };

  const insertVariable = (variable: string) => {
    const textarea = messageRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const token = `{{${variable}}}`;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const newValue = before + token + after;
    handleContentChange(newValue);
    // restore cursor after token
    setTimeout(() => {
      const pos = selectionStart + token.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(()=>{
      setError(null);
    }, 7000)
    if (!form.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(form.name)) {
      setError("Template name should be 3-50 characters and contain only letters, numbers, and spaces.");
      return;
    }  
    if (/^copy/i.test(form.name.trim())) {
      setError("Name Cannot Start from 'Copy'");
      return;
    }  

    if (!form.category) {
      setError("Category is Required");      
      return;
    }  
    if (!form.subject) {
      setError("Subject is Required");      
      return;
    }  
    if (!form.content.message || !/^[\s\S]{3,1500}$/.test(form.content.message)) {
      setError("Message should be 3-1500 characters");
      return;
    }  
    
    try {
      if (isEditMode) {
        await dispatch(updateTemplate({ id: form._id, data: form }) as any);
      } else {
        const newForm = form.includeOptOut
          ? { ...form, content: { message: form.content.message + '\n"Reply STOP to unsubscribe"' } }
          : form;
  
        await dispatch(createTemplateThunk(newForm));
      }
  
      setIsOpenSuccess(true);
      console.log('Submitting template:', form);
    } catch (error) {
      console.error(error);
    }

    if(form.includeOptOut){
      const newForm = {...form, content : form.content.message + '/n "Reply STOP to unsubscribe")'}
      await dispatch(createTemplateThunk(newForm));
    }
    else{
      await dispatch(createTemplateThunk(form));
    }
    setIsOpenSuccess(true);
    console.log('Submitting template:', form);
    console.log('Form Submitted')
    // TODO: send `form` to your API
  };

  console.log("content: ", form.content.message);

  //edit
  
  const resetState = () => {
    setForm({
      _id: '',
      name: '',
      subject: '',
      type: 'SMS',
      category: 'Promotional',
      tags: [],
      senderId: '',
      campaign: '',
      includeOptOut: false,
      content: { message: '' },
      layout: 'Custom',
      createdAt: '',
      lastModified: '',
      favorite: false,
      isDeleted: false,
      version: 1,
    });
  }
  const { id } = useParams<{id: string}>();

  const templateFromApi = useSelector((state: RootState) => state.template.selectedTemplate as Template || null);

  // const id = '68220f25c305eea6017e4104';
  console.log('id', id);
  useEffect(() => {
      if (!id) resetState();
    }, [id]);

  // Remove the standalone resetState effect and the standalone populate effect.
// Replace with one effect:

useEffect(() => {
  if (id) {
    // we're editing: fetch & then populate
    dispatch(getTemplateById(id) as any)
      .then((action : any) => {
        const tpl = (action.payload as Template) || null;
        if (tpl) {
          setIsEditMode(true);
          setForm({
            ...tpl,
            tags: tpl.tags ?? [],
          });
        }
      });
  } else {
    // we're creating: clear out any stale API data AND form
    // (optionally dispatch an action to clear selectedTemplate)
    resetState();
  }
}, [id, dispatch]);


       
    useEffect(() => {
      if (templateFromApi && isEditMode) {
        setForm((prev) => ({
          ...prev,
          ...templateFromApi,
          tags: templateFromApi.tags ?? [],
        }));
    
      }
    }, [templateFromApi]);
    

  return (
    <Box sx={{
          p: 3, bgcolor: '#F8F9FE', maxWidth: '100%', overflow: 'hidden',
          // '& *': { color: '#495057' }
        }}>
        <Box component="form" onSubmit={handleSubmit} >

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      > 
                    
      <Typography variant="h4" component="h1"sx={{mb:1, mr:1}} >
      SMS Template Creater
      </Typography>
        <Box>
        
          <Button  variant="outlined" sx={{ minWidth: '160px',p: 1, m:1,bgcolor: 'white', color: '#0057D9',  '&:hover': { bgcolor: '#e6e6e6',  }, }}>
            <SendIcon />&nbsp; Send&nbsp;Test
          </Button>
          <Button  variant="contained" sx={{ minWidth: '160px',bgcolor: '#0057D9', color: '#fff  ', p: 1, m:1, ":hover": { bgcolor: '#2068d5' } }}
          onClick={() => setOpen(true)}>
          <VisibilityIcon /> &nbsp; Preview
          </Button>
          
          <Button type="submit" variant="contained"  color="success" sx={{ minWidth: '180px',  p: 1, m:1, ":hover": { bgcolor: 'green' } }}>
           <SaveIcon /> &nbsp; {isEditMode? 'Update Template' : 'Save Template'}
          </Button>
        </Box>   
      </Box>   

      <Box  p={3} bgcolor="background.paper"
      // <Box component="form" onSubmit={handleSubmit} p={3} bgcolor="background.paper"
      sx={{
        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, 
          '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
      }}
      >
        <Grid container spacing={2}>
          {/* Template Name */}
          <Grid size={12}>
          {error && 
            <Alert severity="error" sx={{ mb: 2, width:'100%' }}>{error}</Alert>
            }
          </Grid>
          <Grid size={{xs:12, sm:6}} >
            {/* <TextField
              label="Template Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
            /> */}
            
            <FormControl variant="outlined" size="medium" sx={{ minWidth: {xs:'100%'}, bgcolor: "#F8F9FA", borderRadius: "6px", p:1 }}>
              <InputLabel htmlFor="status-select" sx={{ }}>
              Template Name
              </InputLabel>        
              <InputBase
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              name="search"
              sx={{
                
                width: "100%",
                pt:0.5,          
              }}
              required
              fullWidth
            />      
            </FormControl>
          </Grid>

          {/* Subject (only for Email types) */}
          {form.type === 'SMS' && (
            <Grid size={{xs:12, sm:6}} >
              {/* <TextField
                label="Subject"
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                fullWidth
              /> */}
              <FormControl variant="outlined" size="medium" sx={{ minWidth: {xs:'100%'}, bgcolor: "#F8F9FA", borderRadius: "6px", p:1 }}>
                <InputLabel htmlFor="status-select" sx={{ }}>
                Subject
                </InputLabel>        
                <InputBase
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                name="subject"
                sx={{
                  
                  width: "100%",
                  pt:0.5,          
                }}
                required
                fullWidth
              />      
            </FormControl>
            </Grid>
          )}

          {/* Message Content */}
          <Grid size={{xs:12}}>
            {/* <TextField
              label="Message Content"
              multiline
              minRows={4}
              value={form.content.message}
              onChange={(e) => handleContentChange(e.target.value)}
              inputRef={messageRef}
              required
              fullWidth
            /> */}
            <FormControl variant="outlined" size="medium" sx={{ minWidth: {xs:'100%'}, bgcolor: "#F8F9FA", borderRadius: "6px", p:1 }}>
              <InputLabel htmlFor="status-select" >
              Message Content
              </InputLabel>        
              <InputBase
              value={form.content.message}
              // value={isEditMode ? form.content.message : form.content}
              onChange={(e) => handleContentChange(e.target.value)}
              name="message"
              sx={{
                fontSize: "14px",
                width: "100%",
                pt:0.5,          
              }}
              required
              fullWidth
              multiline
              minRows={5}
              inputRef={messageRef}
            />      
            </FormControl>
            <Box mt={1}>
              <Typography variant="caption">Insert Variables: </Typography>
              {VARIABLE_OPTIONS.map((v) => (
                <Chip
                  key={v}
                  label={v}
                  onClick={() => insertVariable(v)}
                  size="small"
                  sx={{ mr: 1, mt: 1, cursor: 'pointer', borderRadius: '4px', color:'grey', bgcolor: '##EFEFEF', '&:hover': { bgcolor: '#CED4DA' } }}
                />
              ))}
            </Box>
          </Grid>

          {/* Sender ID */}
          {/* <Grid size={{xs:12, sm:6}} >
            <TextField
              label="Sender ID"
              value={form.senderId}
              onChange={(e) => handleChange('senderId', e.target.value)}
              sx={{ bgcolor: "#F8F9FA", borderRadius: "6px", }}
              required
              fullWidth
            />
          </Grid> */}

          {/* Campaign Select */}
          {/* <Grid size={{xs:12, sm:6}} >
            <FormControl fullWidth sx={{bgcolor: "#F8F9FA", borderRadius: "6px", }} variant="outlined" size="medium">
              <InputLabel>Campaign</InputLabel>
              <Select
                value={form.campaign}
                label="Campaign"
                onChange={(e) => handleChange('campaign', e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {campaigns.map((c) => (
                  <MenuItem key={c} value={c} sx={{ color: "#6D6976", }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Category Select */}
          <Grid size={{xs:12, sm:6}} >
            <FormControl fullWidth variant="outlined" size="medium" sx={{ minWidth: 200,  bgcolor: "#F8F9FA", borderRadius: "6px", }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={(e) => handleChange('category', e.target.value as CategoryType)}
                required
                sx={{  color: "#6D6976",    }}
              >
                {[
                  '',
                  'Promotional',
                  'Transactional',
                  'Event Based',
                  'Update',
                  'Announcement',
                  'Action',
                  'Product',
                  'Holiday',
                ].map((c) => (
                  <MenuItem key={c} value={c} sx={{ color: "#6D6976", }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Tags Autocomplete */}
          <Grid size={{xs:12, sm:6}} >
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.tags}
              onChange={(_, v) => handleChange('tags', v)}
              sx={{ bgcolor: "#F8F9FA", borderRadius: "6px", }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add tag" fullWidth />
              )}
            />
          </Grid>

          {/* Opt-Out Checkbox */}
          <Grid size={{xs:12}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.includeOptOut}
                  onChange={(e) => handleChange('includeOptOut', e.target.checked)}
                />
              }
              label='Include opt-out text ("Reply STOP to unsubscribe")'
            />
          </Grid>

          {/* Footer */}
          {/* <Grid size={{xs:12}} display="flex" justifyContent="space-between" alignItems="center">
            <Typography>
              Approval Status:{' '}
              <Typography component="span" color="warning.main">
                Pending
              </Typography>
            </Typography>
            <Button type="submit" variant="contained">
              Submit for Approval
            </Button>
          </Grid> */}
        </Grid>
      </Box>
      </Box>
      <AllModal
              open={isOpenSuccess}
              handleClose={()=>{setIsOpenSuccess(false)}}
              handleConfirm= {()=>{navigate('/templates')}}
              title= "Success"
              message= {isEditMode ? "This SMS Template Has Been Updated Successfully" : "This SMS Template Has Been Saved Successfully"}
              btntxt = "Ok"
              icon={{ type: "success" }}
              color = "primary"
            />
      {/* Preview */}
       <Dialog
            open={open}
            onClose={()=>setOpen(false)}
            fullWidth
            // maxWidth="sm"
            sx={{
              '& .MuiDialog-paper': {
                width: '80vw',
                maxWidth: '500px',
                maxHeight: '100vh',
                borderRadius: '10px',
              },
            }}
          >
            <Box
              sx={{
                bgcolor: '#0057D9',
                // width: '100%',
                // height: 35,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
              }}
            >
              <Typography sx={{ color: 'white' }}>{form.name}</Typography>
              <IconButton onClick={()=>setOpen(false)}>
                <CloseIcon sx={{ color: 'white' }} />
              </IconButton>
            </Box>

            <Box sx={{minHeight:'350px', p:2}}>
              {form.content.message}<br/>
              {form.includeOptOut ? '"Reply STOP to unsubscribe"' : ''}
            </Box>

          </Dialog>
    </Box>
  );
};

export default TemplateEditor;

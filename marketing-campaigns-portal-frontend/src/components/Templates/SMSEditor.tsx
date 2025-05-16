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
import CryptoJS from 'crypto-js';
import { RootState } from "../../redux/store";
import { useAppDispatch } from '../../redux/hooks'
import { createTemplateThunk, getTemplateById, updateTemplate } from "../../redux/slices/templateSlice";
import { Template } from 'types/template';
import CloseIcon from '@mui/icons-material/Close';
import AllModal from '../Modals/DeleteModal';
import { useSelector } from "react-redux";

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
    category: template?.category || '',
    tags: template?.tags || [],
    includeOptOutText: Boolean(template?.includeOptOutText) ?? false,
    content: '',
  });
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = <K extends keyof Template>(field: K, value: Template[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    console.log('form', form);
  };
  console.log('includeOptOutText', form.includeOptOutText)
  const handleContentChange = (value: string) => {
    setForm((prev) => ({ ...prev, content: value }));
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
    setTimeout(() => {
      const pos = selectionStart + token.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
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
    if (!form.content || !/^[\s\S]{3,1500}$/.test(form.content)) {
      setError("Message should be 3-1500 characters");
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updateTemplate({ id: form._id, data: form }) as any);
      } else {
        await dispatch(createTemplateThunk(form));
      }

      setIsOpenSuccess(true);
      console.log('Submitting template:', form);
    } catch (error) {
      console.error(error);
    }

    setIsOpenSuccess(true);
    console.log('Submitting template:', form);
    console.log('Form Submitted')
  };

  const resetState = () => {
    setForm({
      _id: '',
      name: '',
      subject: '',
      type: 'SMS',
      category: '',
      tags: [],
      includeOptOutText: false,
      content: '',
    });
  }
  const { id: encryptedId } = useParams();
  const [id, setId] = useState<string | null>(null);
  const secretKey = (process.env.REACT_APP_ENCRYPT_SECRET_KEY as string);

  useEffect(() => {
    if (encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
        setId(decryptedId);
        console.log("Decrypted ID:", decryptedId);
      } catch (error) {
        console.error("Failed to decrypt ID:", error);
        setId(null);
      }
    }
  }, [encryptedId, secretKey]);

  useSelector((state: RootState) => state.template.selectedTemplate as Template || null);

  console.log('id', id);
  useEffect(() => {
    if (!id) resetState();
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(getTemplateById(id) as any)
        .then((action: any) => {
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
      resetState();
    }
  }, [id, dispatch]);

  return (
    <Box sx={{
      p: 3, bgcolor: '#F8F9FE', maxWidth: '100%', overflow: 'hidden',
    }}>
      <Box component="form" onSubmit={handleSubmit} >

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >

          <Typography variant="h4" component="h1" sx={{ mb: 1, mr: 1 }} >
            SMS Template Creater
          </Typography>
          <Box>

            <Button variant="outlined" sx={{ minWidth: '160px', p: 1, m: 1, bgcolor: 'white', color: '#0057D9', '&:hover': { bgcolor: '#e6e6e6', }, }}>
              <SendIcon />&nbsp; Send&nbsp;Test
            </Button>
            <Button variant="contained" sx={{ minWidth: '160px', bgcolor: '#0057D9', color: '#fff  ', p: 1, m: 1, ":hover": { bgcolor: '#2068d5' } }}
              onClick={() => setOpen(true)}>
              <VisibilityIcon /> &nbsp; Preview
            </Button>

            <Button type="submit" variant="contained" color="success" sx={{ minWidth: '180px', p: 1, m: 1, ":hover": { bgcolor: 'green' } }}>
              <SaveIcon /> &nbsp; {isEditMode ? 'Update Template' : 'Save Template'}
            </Button>
          </Box>
        </Box>

        <Box p={3} bgcolor="background.paper"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              {error &&
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>
              }
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              {/* Template Name */}
              <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
                <InputLabel htmlFor="status-select" sx={{}}>
                  Template Name
                </InputLabel>
                <InputBase
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  name="search"
                  sx={{

                    width: "100%",
                    pt: 0.5,
                  }}
                  required
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
                <InputLabel htmlFor="status-select" sx={{}}>
                  Subject
                </InputLabel>
                <InputBase
                  value={form.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  name="subject"
                  sx={{
                    width: "100%",
                    pt: 0.5,
                  }}
                  required
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
                <InputLabel htmlFor="status-select" >
                  Message Content
                </InputLabel>
                <InputBase
                  value={form.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  name="message"
                  sx={{
                    fontSize: "14px",
                    width: "100%",
                    pt: 0.5,
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
                    sx={{ mr: 1, mt: 1, cursor: 'pointer', borderRadius: '4px', color: 'grey', bgcolor: '##EFEFEF', '&:hover': { bgcolor: '#CED4DA' } }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Category Select */}
            <Grid size={{ xs: 12, sm: 6 }} >
              <FormControl fullWidth variant="outlined" size="medium" sx={{ minWidth: 200, bgcolor: "#F8F9FA", borderRadius: "6px", }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) => handleChange('category', e.target.value as CategoryType)}
                  required
                  sx={{ color: "#6D6976", }}
                >
                  {[
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
            <Grid size={{ xs: 12, sm: 6 }} >
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
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.includeOptOutText}
                    onChange={(e) => { console.log('checked', e.target.checked); handleChange('includeOptOutText', e.target.checked as boolean) }}
                  />
                }
                label='Include opt-out text ("Reply STOP to unsubscribe")'
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AllModal
        open={isOpenSuccess}
        handleClose={() => { setIsOpenSuccess(false) }}
        handleConfirm={() => { navigate('/templates') }}
        title="Success"
        message={isEditMode ? `"${form.name}" Has Been Updated Successfully` : `"${form.name}" Has Been Saved Successfully`}
        btntxt="Ok"
        icon={{ type: "success" }}
        color="primary"
      />
      {/* Preview */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
          }}
        >
          <Typography sx={{ color: 'white' }}>{form.name}</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>

        <Box sx={{ minHeight: '350px', p: 2 }}>
          {form.content}<br />
          {form.includeOptOutText ? '"Reply STOP to unsubscribe"' : ''}
        </Box>

      </Dialog>
    </Box>
  );
};

export default TemplateEditor;

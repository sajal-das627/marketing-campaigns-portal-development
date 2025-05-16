import React, {useState} from "react";
import {Button, ButtonGroup, Menu, MenuItem} from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useDocument } from '../../documents/editor/EditorContext';
import { Template } from 'types/template';
import { useAppDispatch } from "../../../../redux/hooks";
import { createTemplateThunk, updateTemplate } from "../../../../redux/slices/templateSlice";
import AllModal from "../../../../components/Modals/DeleteModal";
import { useNavigate } from "react-router-dom";
interface TemplateEditorProps {
  TemplateDetails : Template;
  isEdit: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SaveButton ({TemplateDetails, isEdit, setError, setIsEditMode}: TemplateEditorProps){

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const options = [
    {
      label: 'Save Template & Exit',
      onClick: () => {
        // handleSave();
        //redirect 
        console.log('🔥 Saving & Exiting');
        // Your logic here
      },
    },
    {
      label: 'Save as New Template',//
      onClick: () => {
        console.log('💾 Saving as New');
        // Your logic here
      },
    },
    {
      label: 'Close the Editor',
      onClick: () => {
        console.log('❌ Closing Editor');
        // Your logic here
      },
    },
  ];
  

  // const document = useDocument();
    
  // const handleSave = () => { 
  //   const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
  //   console.log('html', html);
  //   saveTemplate({
  //     name: "Welcome Email",
  //     html: html,
  //     design: document,
  //   });
  // };

  // const saveTemplate = async (payload: { name: string; html: string; design: object }) => {
  const saveTemplate = async () => {
    setTimeout(()=>{
      setError(null);
    }, 7000)
    if (!TemplateDetails.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(TemplateDetails.name)) {
      setError("Template name should be 3-50 characters and contain only letters, numbers, and spaces.");
      return;
    }  
    if (!TemplateDetails.category) {
      setError("Category is Required");
      return;
    }  
    if (!TemplateDetails?.content?.root?.data?.childrenIds || TemplateDetails.content?.root?.data.childrenIds.length === 0) {
      setError("Template Design is Required");
      return;
    }  
    if (/^copy/i.test(TemplateDetails?.name.trim())) {
      setError("Name Cannot Start from 'Copy'");
      return;
    } 

    try {
      if(isEdit){
        await dispatch(updateTemplate({ id: TemplateDetails._id, data: TemplateDetails }) as any);
      }
      else{
        await dispatch(createTemplateThunk(TemplateDetails));
      }
      setOpen(true);
      setIsEditMode(false);
      console.log('form Submitted', TemplateDetails);
    } catch (err) {
      console.error('Save failed:', err);
    }
       
  };

    return(
      <>
        <Button variant="contained" color='primary'
        onClick={saveTemplate}
        sx={{bgcolor:'#0057D9', borderRadius:'6px', minWidth:'80px'}}
        > {isEdit ? 'Update' : 'Save'}</Button>

        <AllModal
          open={open}
          handleClose={() => {setOpen(false)}}
          handleConfirm={() => {navigate('/email-templates')}}
          
          title="Success"
          message="Template is Saved Successfully"
          btntxt="Yes"
          icon={{ type: "success" }}
          color="primary"
      />

        {/* <ButtonGroup variant="contained" >
        <Button onClick={() => (options[0].onClick())} sx={{bgcolor:'#0057D9', borderRadius:'6px'}}>Save As</Button>
        <Button
          size="small"
          onClick={handleMenuClick} sx={{bgcolor:'#0057D9', borderRadius:'6px'}}

        >
          <ArrowDropDownIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {options.map((option) => (
            <MenuItem 
                key={option.label} 
                onClick={() =>{
                    option.onClick();
                    handleMenuClose();
            }}>{option.label}
            </MenuItem>
          ))}
        </Menu>
      </ButtonGroup> */}

      </>
    )
}
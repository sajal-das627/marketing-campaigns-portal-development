import React, {useState} from "react";
import {Button,} from '@mui/material'
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
          handleConfirm={() => {navigate('/templates')}}
          
          title="Success"
          message="Template is Saved Successfully"
          btntxt="Yes"
          icon={{ type: "success" }}
          color="primary"
      />

      </>
    )
}
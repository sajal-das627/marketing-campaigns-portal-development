import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFilterById, updateFilter } from "../../api/apiClient"; // ✅ ensure getFilterById exists
import FilterBuilder from "./FilterBuilder";
import DeleteModal from '../Modals/DeleteModal';
import {DynamicIconProps} from '../../types/modal';
import CryptoJS from 'crypto-js'

const EditFilter: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState<any>(null);

 const [modalData, setModalData] = useState<{ 
    open: boolean; 
    handleConfirm: () => void | ((id: string) => void) | (() => void); 
    title:string; message:string;
    btntxt:string; 
    icon: DynamicIconProps | undefined; 
    color: string; handleClose: () => void;
  }>({
    open: false,
    handleConfirm: () => {},
    title: '',
    message: '',
    btntxt: '',
    icon: undefined,
    color: '',
    handleClose: () => {},
  });

  
    const { id : encryptedId } = useParams();
    const [id, setId] = useState<string | null>(null);
    // const { id } = useParams<{id: string}>();
    const secretKey =  (process.env.REACT_APP_ENCRYPT_SECRET_KEY as string);
    
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
  
  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await getFilterById(id as string);
        console.log("Fetched filter data 1:", response);
        setFilterData(response);
      } catch (error) {
        console.error("Failed to load filter:", error);
        alert("Failed to load filter data");
        navigate("/filters");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilter();
  }, [id, navigate]);

  const handleSave = async (updatedData: any) => {
    try {
      await updateFilter(id as string, updatedData);
      // alert("Filter updated successfully!");
      handleSuccess();
      // navigate("/filters");
    } catch (error) {
      console.error("Failed to update filter:", error);
      alert("Update failed.");
    }
  };

  const handleClose = () => {
    setModalData(prev => ({...prev, open: false}))
  }


  const handleDiscard = () => {
    setModalData({
      open: true,
      handleConfirm: handleExit, 
      title: 'Exit Filters',
      message: 'You have unsaved changes. Do you really want to leave?',
      handleClose: handleClose,        
      btntxt: "Discard",
      icon: { type: "cancel" } as DynamicIconProps,
      color: "warning"
    });
  };
  const handleExit = () => {
    navigate("/filters");
  }
  const handleSuccess = () => {
    setModalData({
      open: true,
      handleConfirm: handleExit, 
      title: 'Filter Updated Successfully',
      message: `"${filterData.name}" Filter Updated Successfully`,
      handleClose: handleClose,           
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  if (loading) return <div>Loading filter...</div>;

  return (
    <>
    <FilterBuilder
      mode="edit"
      initialData={filterData}
      onSave={handleSave}
      onDiscard={handleDiscard}
    />
    <DeleteModal
        open={modalData.open}
        handleClose={modalData.handleClose}
        handleConfirm={modalData.handleConfirm}
        title= {modalData.title}
        message= {modalData.message}
        btntxt = {modalData.btntxt}
        icon = {modalData.icon}
        color = {modalData.color}
      />
    </>
  );
};

export default EditFilter;

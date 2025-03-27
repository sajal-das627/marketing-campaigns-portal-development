import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { loadCampaigns, pauseResumeCampaign, duplicateCampaign, deleteCampaign } from "../redux/slices/campaignSlice";
import { RootState } from "../redux/store";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Card, Typography, TextField, MenuItem, IconButton, TableContainer, Paper,
Box, InputAdornment, useMediaQuery, useTheme,FormControl, InputLabel, Select, OutlinedInput, Input, InputBase, styled ,Container,
 } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from "@mui/icons-material/Search";
import { ThemeContext } from "@emotion/react";
import { CampaignData } from "types/campaign";
import EditCampaignModal from "./EditCampaignModal";
import DeleteConfirmationModal from "./CampaignWizard/DeleteModal";
// import { Types } from "mongoose";
import { updateCampaignList } from '../redux/slices/campaignSlice'; 
interface CampaignProp {

}

const Campaigns: React.FC<CampaignProp> = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);
  const { campaigns, loading, error, pagination } = useSelector((state: RootState) => state.campaign);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string|null>(null);
  const [filters, setFilters] = useState<{
    search: string;
    status: string;
    type: string;
    startDate: Date | null;
    endDate: Date | null;
    sortBy: string;
    page: number;
    limit: number;
  }>({
    search: "",
    status: "",
    type: "",
    startDate: null,
    endDate: null,
    sortBy: "",
    page: 1,
    limit: 10,
  });
  const dispatch = useAppDispatch();

  const navigation = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null); // ✅ Ref for table section

  // ✅ First API call (Fetch all campaigns once on mount)
  // useEffect(() => {
  //   dispatch(loadCampaigns({ page: 1, limit: 10 })); // ✅ Runs only once when component mounts
  // }, []);

  // ✅ Fetch campaigns only when filters (excluding pagination) change
  useEffect(() => {
    const handler = setTimeout(() => {
    // if (filters.search || filters.status || filters.type || filters.startDate || filters.endDate || filters.sortBy) {
      dispatch(loadCampaigns(filters)); // ✅ Runs only when filters change
    },300);

    return()=> clearTimeout(handler);
  }, [filters.search, filters.status, filters.type, filters.startDate, filters.endDate, filters.sortBy, dispatch]);

  // ✅ Separate API call for Pagination
  useEffect(() => {
    dispatch(loadCampaigns({ page: filters.page, limit: filters.limit })); // ✅ Fetch only paginated data
  }, [filters.page, filters.limit, dispatch]);


  // ✅ Handle Input Changes
  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ Pagination Controls
  const nextPage = () => {
    if (filters.page < pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100); // ✅ Smooth scroll back to the table
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100); // ✅ Smooth scroll back to the table
    }
  };

  const handlePauseResume = async (campaignId: string, campaignStatus: string) => {
    try {
      if(campaignStatus === 'Paused' || campaignStatus === 'On Going'){
        await dispatch(pauseResumeCampaign(campaignId)).unwrap();
      }
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

   // ✅ Handle Edit Button Click
   const handleEditClick = (campaign: CampaignData) => {
    setSelectedCampaign({ ...campaign }); // ✅ Ensures the type remains consistent
    setEditModalOpen(true);
  };
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalopen(true);
  };
  const handleConfirmDelete = () => {
    if (selectedId) {
      dispatch(deleteCampaign(selectedId));
    }
    setIsDeleteModalopen(false);
  };

  const theme = useTheme();
  
  // const handleDuplicate = async (campaignId: string) => {
  //   // Dispatch the async thunk
  //   const action = await dispatch(duplicateCampaign(campaignId));
  
  //   if (duplicateCampaign.fulfilled.match(action)) {
  //     const newCampaign = action.payload; // Extract duplicated campaign data
  //     if (newCampaign?._id) {
  //       // Use setTimeout with a callback function
       
  //         setHighlightedId(newCampaign._id);
  //         console.log('Campaign ID:', newCampaign._id, 'Highlighted ID:', highlightedId);
       
  //     }
  //   }
  // };
  const handleDuplicate = async (campaignId: string) => {
    const action = await dispatch(duplicateCampaign(campaignId));
  
    if (duplicateCampaign.fulfilled.match(action)) {
      const newCampaign = action.payload;
      if (newCampaign?._id) {
        setHighlightedId(newCampaign._id);
        
        // Find the index of the original campaign
        const originalIndex = campaigns.findIndex(c => c._id === campaignId);
        if (originalIndex === -1) {
          // If not found, append at the end
          dispatch(updateCampaignList([...campaigns, newCampaign]));
        } else {
          // Insert the duplicate right after the original campaign
          const updatedCampaigns = [...campaigns];
          updatedCampaigns.splice(originalIndex + 1, 0, newCampaign);
          dispatch(updateCampaignList(updatedCampaigns));
        }
      }
    }
  };
  
  
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  // if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{py: 4, bgcolor: '#F8F9FE',  maxWidth: '80vw',}}>
      <Typography sx={{ fontSize: "26px", }} gutterBottom>
              Manage Campaign
            </Typography>
    
    <TableContainer component={Paper} ref={tableRef} sx={{ margin: '20px auto', pl:2, pr:2,borderRadius: '10px', overflow: 'x'  }}>
      
    {/* <Card sx={{ padding: 2 }} > ✅ Apply the ref here */}
       {/* Filters */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", flexDirection:"row", gap: "10px", mt:2,         
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, 
          '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
        }}>         
         
      <FormControl variant="outlined" size="small" sx={{ minWidth: 225, bgcolor: "#F8F9FA", borderRadius: "6px", marginRight:"auto" }}>
        <InputLabel htmlFor="status-select" sx={{ fontSize: "14px", boxSizing:"border-box", display: "flex", alignItems: "center", }}>
          <SearchIcon />&nbsp;Search for campaigns here...
        </InputLabel>        
        <InputBase
        value={filters.search}
        onChange={handleChange}
        name="search"
        sx={{
          fontSize: "14px",
          width: "100%",
          pt:0.5,          
        }}
      />      
      </FormControl>
         
    <FormControl variant="outlined" size="small" sx={{ minWidth: 80, maxWidth: 100, bgcolor: "#F8F9FA", borderRadius: "6px", }}>
        <InputLabel htmlFor="status-select" sx={{ fontSize: "14px" }}>
          Status
        </InputLabel>
        <Select
          id="status-select"
          name="status"
          label="Status"
          value={filters.status}
          onChange={handleChange}
          sx={{ fontSize: "14px", color: "#6D6976",    }}
        >
          <MenuItem value="" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            All
          </MenuItem>
          <MenuItem value="On Going" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            On Going
          </MenuItem>
          <MenuItem value="Draft" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Draft
          </MenuItem>
          <MenuItem value="Expired" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Expired
          </MenuItem>
          <MenuItem value="Completed" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Completed
          </MenuItem>
          <MenuItem value="Not Yet Started" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Not Yet Started
          </MenuItem>
        </Select>
      </FormControl>

      {/* Type Dropdown */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 80, maxWidth: 120,  bgcolor: "#F8F9FA", borderRadius: "6px", }}>
        <InputLabel htmlFor="type-select" sx={{ fontSize: "14px",   }}>
          Type
        </InputLabel>
        <Select
          id="type-select"
          name="type"
          label="Type"
          value={filters.type}
          onChange={handleChange}
          sx={{ fontSize: "14px", }}
        >
          <MenuItem value="" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            All
          </MenuItem>
          <MenuItem value="Criteria Based" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Criteria Based
          </MenuItem>
          <MenuItem value="Real Time" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Real Time
          </MenuItem>
          <MenuItem value="Scheduled" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Scheduled
          </MenuItem>
          <MenuItem value="Not Yet Started" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Not Yet Started
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 60, maxWidth: 120 }}>
      {/* <InputLabel sx={{ fontSize: "14px",   }}>
      {isSmallScreen ? "Start" : "Start Date"}
        </InputLabel> */}
        {/* <InputLabel sx={{ fontSize: "14px",   }}>
      {filters.startDate ? filters.startDate.toString() : "Start Date"}
        </InputLabel> */}
 <DatePicker
        label={isSmallScreen ? "Start" : "Start Date"}
        value={filters.startDate}
        onChange={(date: Date | null) =>
          setFilters((prev) => ({ ...prev, startDate: date }))
        }
        slotProps={{
          textField: {
            size: "small",
            variant: "outlined",
            sx: {
              bgcolor: "#F8F9FA",
              borderRadius: "6px",
              "& .MuiOutlinedInput-root": { borderRadius: "6px", boxShadow: "none", },
              fontSize: "12px",
              minWidth: 80, 
              
            },
          },
        }}
      />

         </FormControl>
         <FormControl variant="outlined" size="small" sx={{ minWidth: 60, maxWidth: 115 }}>

      {/* End DatePicker */}
      {/* <InputLabel sx={{ fontSize: "14px",   }}>
      {isSmallScreen ? "End" : "End Date"}
        </InputLabel> */}
      <DatePicker
        label={isSmallScreen ? "End" : "End Date"}
        value={filters.endDate}
        onChange={(date: Date | null) =>
          setFilters((prev) => ({ ...prev, endDate: date }))
        }
        slotProps={{
          textField: {
            size: "small",
            variant: "outlined",
            sx: {
              bgcolor: "#F8F9FA",
              borderRadius: "6px",
              "& .MuiOutlinedInput-root": { borderRadius: "6px", boxShadow: "none", },
              fontSize: "12px",
              minWidth: 80, 
              
            },
          },
        }}
      />
   </FormControl>   
   <FormControl variant="outlined" size="small" sx={{ minWidth: 85, maxWidth: 120, bgcolor: "#F8F9FA", borderRadius: "6px",  }}>
        <InputLabel htmlFor="sort-select" sx={{ fontSize: "14px", }}>
          Sort By
        </InputLabel>
        <Select
        id="sort-select"
          name="sortBy"
          label="Sort By"
          value={filters.sortBy}
          onChange={handleChange}
          sx={{ fontSize: "14px",  }}
        >
          <MenuItem value="" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Newest
          </MenuItem>
          <MenuItem value="Oldest" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Oldest
          </MenuItem>
          <MenuItem value="A-Z" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Name (A to Z)
          </MenuItem>
          <MenuItem value="Z-A" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
            Name (Z to A)
          </MenuItem>
        </Select>
      </FormControl>
        </Box>
      </LocalizationProvider>
<Box sx={{p:1}}></Box>
      <Table sx={{
        // borderCollapse: 'separate', borderSpacing: '0 10px',
          }}>
        <TableHead>
          <TableRow sx={{bgcolor: '#F3F3F3', borderRadius:'10px',}}>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >NAME</TableCell>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >STATUS</TableCell>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >TYPE</TableCell>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >OPEN&nbsp;RATE</TableCell>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >CTR</TableCell>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >DELIVERED</TableCell>
            <TableCell  sx={{color: '#495057', textAlign:"center", fontWeight:"semi-bold" }} >ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {(campaigns ?? []).length > 0 ? (
    (campaigns ?? []).map((campaign) => (
      <React.Fragment key={campaign._id}>
        <TableRow
          sx={{
            // border: campaign._id === highlightedId ? '2px solid #ff9800' :'2px solid blue' ,
            borderRadius: '6px',
            pb:0.5,
            // border: campaign._id === highlightedId ? '5px solid #ff9800' : '2px solid #F2F7FF',
            // boxShadow: campaign._id === highlightedId ? '0px 0px 2px 3px #ff9800' : 'none',
            boxShadow: campaign._id === highlightedId
        ? 'inset 0px 0px 10px #ff9800'
        : 'inset 0px 0px 10px #DCE0F9',
            '& td, & th': { padding: '10px 10px', },
          }}
        >
          <TableCell>
            <Button sx={{ color: "#0057D9", bgcolor: "#F2F7FF", fontSize: "12px" }}>
              {campaign._id}
            </Button>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px", pt: 0.25, pb: 0.25 }}>
              {campaign.name}
            </Typography>
            <Typography sx={{ color: "#626262", fontSize: "12px",  pt: 0.25, pb: 0.25 }}>
              <DoneIcon sx={{ fontSize: "11px",  pt: 0.25, pb: 0.25 }} /> Published on&nbsp;
              {campaign.createdAt?.toString().split('-').join(' ').slice(0,10)}
              {/* publihshed date should be added instead of crea */}
            </Typography>
          </TableCell>
          <TableCell>
            <Button
              sx={{
                color:
                  campaign.status === 'Expired'
                    ? '#F83738'
                    : campaign.status === 'Completed'
                    ? '#0057D9'
                    : campaign.status === 'Draft'
                    ? '#c0b000'
                    : campaign.status === 'Paused'
                    ? '#a7690b'
                    : '#52B141',
                bgcolor:
                  campaign.status === 'Expired'
                    ? '#F8DDDD'
                    : campaign.status === 'Completed'
                    ? '#E2ECFC'
                    : campaign.status === 'Draft'
                    ? '#f9f7e2'
                    : campaign.status === 'Paused'
                    ? '#f8e3c5'
                    : '#E6F5E3',
                fontSize: '12px',
                fontWeight: 'semi-bold',
                minWidth: '78px',
              }}
            >
              {campaign.status}
            </Button>
          </TableCell>
          <TableCell sx={{ color: '#6D6976', textAlign:"center"}}>{campaign.type}</TableCell>
          <TableCell sx={{ color: '#6D6976', textAlign:"center"}}>{campaign.openRate}%</TableCell>
          <TableCell>
            <Typography sx={{ color: '#6D6976', textAlign:"center" }}>
              {campaign.ctr}%
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ color: '#6D6976', textAlign: "center" }}>
              {campaign.delivered}
            </Typography>
          </TableCell>
          <TableCell>
          <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                gap: {xs:1, lg:0.25},
                alignItems: "center",
                justifyContent: "center",
              }}
            >
    
            <IconButton sx={{ borderRadius: '25px' }}
            // onClick={() => handleEditClick(campaign)}
            onClick={()=> navigation(`/create-campaign/${campaign._id}`)}
            >
              <EditIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
            </IconButton>
            <IconButton sx={{ borderRadius: '25px' }} onClick={() => handlePauseResume(campaign._id, campaign.status)}>
              {campaign.status === "Paused" ? (
                <PlayArrowIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
              ) : (
                <PauseIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
              )}
            </IconButton>
            <IconButton sx={{ borderRadius: '25px' }} onClick={() => handleDuplicate(campaign._id)}>
              <ContentCopyIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
            </IconButton>
            <IconButton sx={{ borderRadius: '25px' }} onClick={() => handleDeleteClick(campaign._id)}>
              <DeleteIcon sx={{ fontSize: '25px', color: 'white', bgcolor: '#F83738', p: 0.5, borderRadius: '4.5px' }} />
            </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        
        <TableRow key={`${campaign._id}-spacer`}>
          <TableCell colSpan={7} sx={{ padding: 0, height: '10px' }} />
        </TableRow>
      </React.Fragment>
    ))
  ) : loading ? (<>
  <TableRow>
        <TableCell colSpan={3} align="center">
          <Typography variant="body2">Loading...</Typography>
        </TableCell>
      </TableRow>
  </>)
  
  :(
    <Typography>No campaigns found.</Typography>
  )}
</TableBody>
      </Table>
      <DeleteConfirmationModal
        open={isDeleteModalopen}
        handleClose={() => setIsDeleteModalopen(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
      />
      
      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p:1, mb:1 }}>
        <Button onClick={prevPage} disabled={filters.page <= 1}>Previous</Button>
        <Typography>Page {pagination.page || 1} of {pagination.totalPages || 1}</Typography>
        <Button onClick={nextPage} disabled={filters.page >= (pagination.totalPages || 1)}>Next</Button>
      </Box>    

      {selectedCampaign && (
              <EditCampaignModal
                open={isEditModalOpen}
                handleClose={() => setEditModalOpen(false)}
                campaign={selectedCampaign}
              />
            )}

    </TableContainer>
    </Container>
  );
};

export default Campaigns;

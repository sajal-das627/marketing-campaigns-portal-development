import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { loadCampaigns, pauseResumeCampaign, duplicateCampaign, deleteCampaign } from "../redux/slices/campaignSlice";
import { RootState } from "../redux/store";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Card, Typography, TextField, MenuItem, IconButton, TableContainer, Paper,
Box,
 } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useAppDispatch } from "../redux/hooks";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CampaignProp {

}

const Campaigns: React.FC<CampaignProp> = () => {
  const dispatch = useAppDispatch();
  const { campaigns, loading, error, pagination } = useSelector((state: RootState) => state.campaign);

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


  const tableRef = useRef<HTMLDivElement>(null); // ✅ Ref for table section

  // ✅ First API call (Fetch all campaigns once on mount)
  useEffect(() => {
    dispatch(loadCampaigns({ page: 1, limit: 10 })); // ✅ Runs only once when component mounts
  }, []);

  // ✅ Fetch campaigns only when filters (excluding pagination) change
  useEffect(() => {
    if (filters.search || filters.status || filters.type || filters.startDate || filters.endDate || filters.sortBy) {
      dispatch(loadCampaigns(filters)); // ✅ Runs only when filters change
    }
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

  const handlePauseResume = async (campaignId: string) => {
    try {
      //
      await dispatch(pauseResumeCampaign(campaignId)).unwrap();
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleDuplicate = async (campaignId: string) => {
    await dispatch(duplicateCampaign(campaignId));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!campaigns || campaigns.length === 0) return <Typography>No campaigns found.</Typography>;

  return (
    <TableContainer component={Paper} ref={tableRef} sx={{ margin: '20px auto', maxWidth: '80vw', pl:2, pr:2,borderRadius: '10px', overflow: 'x'  }}>
            <Typography variant="h6" align="center" sx={{ margin: '20px 0', }}>
              Campaigns Management
            </Typography>

    {/* <Card sx={{ padding: 2 }} > ✅ Apply the ref here */}
       {/* Filters */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <TextField label="Search Campaigns" name="search" value={filters.search} onChange={handleChange} />
          <TextField select label="Status" name="status" value={filters.status} onChange={handleChange} sx={{minWidth:"100px"}} >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="On Going">On Going</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Not Yet Started">Not Yet Started</MenuItem>
          </TextField>
          <TextField select label="Type" name="type" value={filters.type} onChange={handleChange}sx={{minWidth:"100px"}}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Criteria Based">Criteria Based</MenuItem>
            <MenuItem value="Real Time">Real Time</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
          </TextField>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date: Date | null) => setFilters((prev) => ({ ...prev, startDate: date }))}
          />

          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date: Date | null) => setFilters((prev) => ({ ...prev, endDate: date }))}
          />

          <TextField select label="Sort By" name="sortBy" value={filters.sortBy} onChange={handleChange} sx={{minWidth:"100px"}}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="A-Z">Name (A to Z)</MenuItem>
            <MenuItem value="Z-A">Name (Z to A)</MenuItem>
          </TextField>
        </Box>
      </LocalizationProvider>

      <Table sx={{borderCollapse: 'separate', borderSpacing: '0 10px', }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Open Rate</TableCell>
            <TableCell>CTR</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {(campaigns ?? []).length > 0 ? (
    (campaigns ?? []).map((campaign) => (
      <React.Fragment key={campaign._id}>
        <TableRow
          sx={{
            borderRadius: '10px',
            boxShadow: '20px 20px 20px #DCE0F933',
            border: '2px solid #ECEEF6',
            '& td, & th': { padding: '3px 5px' },
          }}
        >
          <TableCell sx={{ m: 1 }}>
            <Button sx={{ color: "#0057D9", bgcolor: "#F2F7FF", fontSize: "12px" }}>
              {campaign._id}
            </Button>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px", pt: 0.25, pb: 0.25 }}>
              {campaign.name}
            </Typography>
            <Typography sx={{ color: "#626262", fontSize: "12px" }}>
              <DoneIcon sx={{ fontSize: "11px" }} /> Published on
              {campaign.createdAt}
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
                    ? '#c8b90e'
                    : campaign.status === 'Paused'
                    ? '#f7b654'
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
          <TableCell>{campaign.type}</TableCell>
          <TableCell>{campaign.openRate}%</TableCell>
          <TableCell>
            <Typography sx={{ color: '#6D6976' }}>
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
      gap: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    
            <IconButton onClick={() => console.log('Edit clicked', campaign._id)}>
              <EditIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
            </IconButton>
            <IconButton onClick={() => handlePauseResume(campaign._id)}>
              {campaign.status === "Paused" ? (
                <PlayArrowIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
              ) : (
                <PauseIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
              )}
            </IconButton>
            <IconButton onClick={() => handleDuplicate(campaign._id)}>
              <ContentCopyIcon sx={{ fontSize: '25px', color: '#6A7075', bgcolor: '#EFEFEF', p: 0.7, borderRadius: '4.5px' }} />
            </IconButton>
            <IconButton sx={{ m: '0px' }} onClick={() => dispatch(deleteCampaign(campaign._id))}>
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
  ) : (
    <Typography>No campaigns found.</Typography>
  )}
</TableBody>


      </Table>
      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p:1, mb:1 }}>
        <Button onClick={prevPage} disabled={filters.page <= 1}>Previous</Button>
        <Typography>Page {pagination.page || 1} of {pagination.totalPages || 1}</Typography>
        <Button onClick={nextPage} disabled={filters.page >= (pagination.totalPages || 1)}>Next</Button>
      </Box>

    
    </TableContainer>
  );
};

export default Campaigns;

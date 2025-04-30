import React, {useState, useEffect} from "react";
import { Typography, Box, Tabs, Tab, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Select, MenuItem, InputAdornment, IconButton, Menu,
  SelectChangeEvent, Snackbar, Alert,
  Divider, Modal,
 } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from '@mui/icons-material/Close';
import DeleteModal from "./Modals/DeleteModal";

import { fetchFilters, applyFilter, duplicateFilterAsync, deleteFilterAsync, updateFilterAsync  } from "../redux/slices/filterSlice";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import {useAppDispatch} from "../redux/hooks";
import { useNavigate } from "react-router-dom";

const ManageFilters = () => {
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // New state for debounced search
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  // const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);
  // const [tabValue, setTabValue] = useState<boolean>(false);///delete
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  const [menuAnchorEl, setMenuAnchorEl] = useState<Record<string, HTMLElement | null>>({});
    
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [activeSubTab, setActiveSubTab] = useState<"saved" | "drafts">("saved");
  const isDraft = activeSubTab === "drafts";

  const [modalData, setModalData] = useState<{open: boolean; handleConfirm: () => void | ((id: string) => void) | (() => void); title:string; message:string }>({
    open: false,
    handleConfirm: () => {},
    title: '',
    message: ''
  });

  const openDeleteSelectedModal = () => {
    setModalData({
      open: true,
      handleConfirm: handleDeleteSelectedFilters, 
      title: 'Delete Selected Filters',
      message: 'Are you sure you want to delete these filters?'
    });
  }

  const openDeleteOneModal = (filterId: string) => {
    setModalData({
      open: true,
      handleConfirm: () => handleDeleteFilter(filterId), 
      title: 'Delete This Item?',
      message: 'Are you sure you want to delete this thing?'
    });
  }

  const { filters, currentPage, totalPages, loading, error, appliedFilter } = useSelector(
    (state: RootState) => state.filter
  );
  // const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const checked = event.target.checked;
  //   setSelectAll(checked);
  
  //   // Select or deselect all filtered rows for the current page
  //   if (checked) {
  //     setSelectedRows(filters.map((filter) => filter._id)); // Select all filtered rows on current page
  //   } else {
  //     setSelectedRows([]); // Deselect all filtered rows
  //   }
  // };

  // // Function to toggle selection of individual rows
  // const handleRowSelect = (id: number) => {
  //   setSelectedRows((prevSelected) => {
  //     const newSelected = new Set(prevSelected);
  //     if (newSelected.has(id)) {
  //       newSelected.delete(id); // Deselect the row
  //     } else {
  //       newSelected.add(id); // Select the row
  //     }
  //     return Array.from(newSelected); // Convert Set back to array
  //   });
  // };

  
  const handleSelectFilter = (filterId: string) => {
    setSelectedFilters((prevSelected) =>
      prevSelected.includes(filterId)
        ? prevSelected.filter((id) => id !== filterId) // Deselect if already selected
        : [...prevSelected, filterId] // Select if not selected
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(filters.map((filter) => filter._id));
    }
    setSelectAll(!selectAll);
  };
  
  
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl((prev) => ({
      ...prev,
      [id]: event.currentTarget,
    }));
  };

  const handleClose = () => {
    setMenuAnchorEl({});
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: "saved" | "drafts") => {
    
    setActiveSubTab(newValue); 
    setPage(1);
  }


  //  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); 
    }, 400);   
    return () => clearTimeout(handler); // Cleanup function to clear timeout on every new keystroke
  }, [search]);

  useEffect(() => {
    dispatch(fetchFilters({ page, search: debouncedSearch, sortBy, order, isDraft }));
  }, [dispatch, page, debouncedSearch, sortBy, order, isDraft]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    const selectedSort = e.target.value;
    if (selectedSort === "name_asc") {
      setSortBy("name");
      setOrder("asc");
    } else if (selectedSort === "name_desc") {
      setSortBy("name");
      setOrder("desc");
    }
    setPage(1);
  };

  const handleApplyFilter = async (filterId: string) => {
    await dispatch(applyFilter(filterId));
    setOpenModal(true);
  };

  const handleDuplicateFilter = async (filterId: string) => {
    await dispatch(duplicateFilterAsync(filterId));
  };

  const handleDeleteFilter = (filterId: string) => {
    // if (window.confirm("Are you sure you want to delete this filter?")) {
      dispatch(deleteFilterAsync(filterId));
      setShowDeleteAlert(true);
      setModalData(prev => ({ ...prev, open: false }));
      setMenuAnchorEl({});
    // }
  };

  const handleEditFilter = (filter: any) => {
    setSelectedFilter(filter);
    setEditModalOpen(true);
    setMenuAnchorEl({});
  };
  
  const handleUpdateFilter = async () => {
    if (selectedFilter) {
      await dispatch(updateFilterAsync({ filterId: selectedFilter._id, updatedData: selectedFilter }));
      setEditModalOpen(false);
    }
  };

  
  const handleDeleteSelectedFilters = () => {
    if (selectedFilters.length === 0) {
      alert("No filters selected!");
      return;
    }

    // if (window.confirm(`Are you sure you want to delete ${selectedFilters.length} selected filters?`)) {
      selectedFilters.forEach((filterId) => dispatch(deleteFilterAsync(filterId)));
      setSelectedFilters([]);
      setSelectAll(false);
      setShowDeleteAlert(true);
      setModalData(prev => ({ ...prev, open: false })); // ✅ correct way to close modal
      // }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Filters
      </Typography>
      <Typography sx={{ marginBottom: "20px" }} variant="body2" color="textSecondary" gutterBottom>
        Save your current fiters for quick access and rouse. Revisit and edit draft filters anytime to refino your criteria. This fosture keeps your filters organized and within reach, streamining your workflow in one convenient place
      </Typography>

      <Snackbar
          open={showDeleteAlert}
          autoHideDuration={3000}
          onClose={() => setShowDeleteAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          // sx={{mt:8}}
        >
          <Alert severity="success" onClose={() => setShowDeleteAlert(false)} sx={{ width: '100%' }}>
            Campaign deleted successfully!
          </Alert>
        </Snackbar>

        {/* <DeleteModal open={modalData.open} handleClose={()=>setIsDeleteModalopen(false)} handleConfirm={handleDeleteSelectedFilters} title='Delete Selected Filters' message='Are you sure you want to delete these filters? This action cannot be undone.'  /> */}
        <DeleteModal open={modalData.open} 
                    handleClose={() => setModalData(prev => ({ ...prev, open: false }))} 
                    handleConfirm={modalData.handleConfirm} 
                    title={modalData.title} 
                    message={modalData.message} 
        />

      <Box bgcolor="white" boxShadow={2} borderRadius={2} padding={2}>
        <Tabs value={activeSubTab} onChange={handleTabChange}>
          <Tab value="saved"  /*onClick={() => { setActiveSubTab("saved"); setPage(1); }}*/ sx={{ fontWeight: "600" }} label="Saved Filters" />
          <Tab value="drafts" /*onClick={() => { setActiveSubTab("drafts"); setPage(1); }}*/ sx={{ fontWeight: "600" }} label="Drafts" />
        </Tabs>

        <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} bgcolor="white">

          <TextField
            variant="outlined"
            placeholder="Search Filters"
            size="small"            
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }} 
            sx={{ width: 250, backgroundColor: "#f5f5f5" }}
          />

          <Select
            displayEmpty
            defaultValue=""
            variant="outlined"
            size="small"
            IconComponent={ExpandMoreIcon}            
            value={sortBy === "name" ? `name_${order}` : sortBy}
            onChange={handleSortChange}
            sx={{ width: 120, backgroundColor: "#f5f5f5" }}
          >
          <MenuItem value="">Sort by</MenuItem>
          <MenuItem value="name_asc">Name (A to Z)</MenuItem>
          <MenuItem value="name_desc">Name (Z to A)</MenuItem>
          </Select>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
                <TableCell>FILTER NAME</TableCell>
                <TableCell>TAGS</TableCell>
                <TableCell>DESCRIPTION</TableCell>
                <TableCell sx={{ position: 'relative' }}>                  
                    ACTIONS 
                    <Button  variant="contained" color="error" size="small"
                      sx={{ position: 'absolute', top: 23, left: 86,}}
                      onClick={()=>openDeleteSelectedModal()}
                      // onClick={()=>setIsDeleteModalopen(true)}
                      disabled={selectedFilters.length === 0}
                    >
                      Delete Selected
                    </Button>
                </TableCell> 
              </TableRow>
            </TableHead>

            {loading ? (
        <Typography variant="body1">Loading filters...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
            <TableBody>
            {filters.length > 0 ? (
                    filters
                      .filter((filter) => filter && filter.name 
                      // && filter.isDraft == tabValue
                    )
                      .map((filter, index) => (
                <TableRow key={filter._id} sx={{              
                                      bgcolor: index%2 === 0? 'white' : '#FAFAFA', 
                }}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFilters.includes(filter._id)}
                      onChange={() => handleSelectFilter(filter._id)}
                    />
                  </TableCell>
                  <TableCell style={{ color: "#4170ba", fontWeight: "600" }}>{filter.name}</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>{filter.tags}</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>{filter.description}</TableCell>
                  <TableCell >
                    <Box sx={{ display: "flex" }}>
                      
                    <Button variant="contained" color="success" size="small" onClick={() => handleApplyFilter(filter._id)} style={{ marginRight: 8 }}>Apply</Button>
                    <Button variant="contained" color="warning" size="small" onClick={() => handleDuplicateFilter(filter._id)} >Duplicate</Button>
                    
                    <IconButton onClick={(e) => {handleClick(e, filter._id)}}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={menuAnchorEl[filter._id]}
                      open={Boolean(menuAnchorEl[filter._id])}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <MenuItem onClick={() => navigate(`/edit-filter/${filter._id}`)}>Edit</MenuItem>
                      <MenuItem onClick={() => handleDeleteFilter(filter._id)}>Delete</MenuItem>
                    </Menu>
                    </Box>
                  </TableCell>
                </TableRow>
               ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No filters found</TableCell>
                </TableRow>
              )}
            </TableBody>
            )}
          </Table>
        </TableContainer>         
      </Box>      
            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ marginRight: "10px" }}
              >
                Previous
              </Button>
              <Typography>
                Page <strong>{currentPage || page}</strong> of <strong>{totalPages || 1}</strong>
              </Typography>
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{ marginLeft: "10px" }}
              >
                Next
              </Button>
            </div>
      
            {/* Modal for Applied Filter */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 450,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}>
                  <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={() => setOpenModal(false)}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Saved Filters
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                {appliedFilter ? (
                  <div>
                    <Typography><strong>Filter Name:</strong> {appliedFilter.name}</Typography>
                    <Typography><strong>Description:</strong> {appliedFilter.description || "No description"}</Typography>
                    <Typography><strong>Tags:</strong> {appliedFilter.tags?.join(", ") || "N/A"}</Typography>
                    <Typography><strong>Last Used:</strong> {appliedFilter.lastUsed}</Typography>
                    <Typography><strong>CTR %:</strong> {appliedFilter.ctr}</Typography>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                      <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ marginRight: 1 }}>
                        Cancel
                      </Button>
                      <Button variant="contained" color="primary"  onClick={() => setOpenModal(false)}>
                        Reuse for New Campaign
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Typography>Loading filter details...</Typography>
                )}
              </Box>
            </Modal>
      
            {/* Edit Filter Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
              <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}>
                <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={() => setEditModalOpen(false)}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6">Edit Filter</Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <TextField
                  label="Filter Name"
                  fullWidth
                  value={selectedFilter?.name || ""}
                  onChange={(e) => setSelectedFilter({ ...selectedFilter, name: e.target.value })}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Description"
                  fullWidth
                  value={selectedFilter?.description || ""}
                  onChange={(e) => setSelectedFilter({ ...selectedFilter, description: e.target.value })}
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" onClick={handleUpdateFilter}>Update</Button>
              </Box>
            </Modal>
    </Box>
  );
};

export default ManageFilters;

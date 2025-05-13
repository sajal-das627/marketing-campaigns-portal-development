import React,{ useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  MenuItem,
  Select,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack, Modal, 
  TextareaAutosize,
  FormControl,
  InputLabel,
  InputBase,
  Card,
  Container,
  Menu,
  Button,
  // Dialog,
  // DialogActions,
  // DialogContent,
  Tooltip,
  Divider,
  Grid2 as Grid,
  Alert,
  Snackbar,

} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChecklistIcon from '@mui/icons-material/Checklist';
import GridViewIcon from '@mui/icons-material/GridView';
import { useDispatch, useSelector } from "react-redux";
import {
  getTemplates, getRecentlyUsedTemplates, toggleFavorite,
  getFavoriteTemplates, setFilters, setActiveTab, getTemplateById,
  clearSelectedTemplate, 
  updateTemplate,
  deleteTemplate, 
  restoreTemplate,
  duplicateTemplate,     
  setAllTemplates,
  setRecentTemplates,
  setFavoriteTemplates,
} from "../../redux/slices/templateSlice";
import { RootState } from "../../redux/store";
import { useDebounce } from "use-debounce";
import DeleteModal from "../Modals/DeleteModal";
import CloseIcon from '@mui/icons-material/Close';
import type { Template } from "../../redux/slices/templateSlice";
import CustomPreview from "./CustomPreview";

const TemplatesTable: React.FC = () => {
  
    // const [tab, setTab] = React.useState(0);
    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      // const openAnchor = Boolean(anchorEl);
  
    const dispatch = useDispatch();
    // const {
    //   allTemplates = [], recentTemplates = [], favoriteTemplates = [],
    //   filters, totalPages, activeTab, selectedTemplate,
    // } = useSelector((state: RootState) => state.template || {});

    const {
      allTemplates = [],
      recentTemplates = [],
      favoriteTemplates = [],
      filters = { page: 1, limit: 10, type: "", category: "", sortBy: "" },
      totalPages = 1,
      activeTab = "all",
      selectedTemplate = null,
    } = useSelector((state: RootState) => state.template || {});

    console.log(allTemplates)
    const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editContent, setEditContent] = useState("");
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [totalLocalFavorites, setTotalLocalFavorites] = useState(1);
    const [selectedId, setSelectedId] = useState<string | number>(1);
    // const [localTemplates, setLocalTemplates] = useState(allTemplates);
    const [menuAnchorEl, setMenuAnchorEl] = useState<Record<string, HTMLElement | null>>({});
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
      dispatch(setFilters({ page: 1 }));
    }, [debouncedSearch, filters.type, filters.category, filters.sortBy, dispatch]);
  
    useEffect(() => {
      if (selectedTemplate) {
        setEditName(selectedTemplate.name);
        setEditContent(JSON.stringify(selectedTemplate.content, null, 2));
      }
    }, [selectedTemplate]);

    const handleAnchorClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
      setMenuAnchorEl((prev) => ({
        ...prev,
        [id]: event.currentTarget,
      }));
    };
    
    const handleAnchorClose = (id: string) => {
      setMenuAnchorEl(({}));
      // setMenuAnchorEl(prev => ({ ...prev, [id]: null }));
    };
  
    const buildQuery = () => {
      const query: any = { page: filters.page, limit: filters.limit };
      if (debouncedSearch?.trim()) query.search = debouncedSearch.trim();
      if (filters.type) query.type = filters.type;
      if (filters.category) query.category = filters.category;
      switch (filters.sortBy || "newest") {
        case "newest": query.sortBy = "createdAt"; query.order = "desc"; break;
        case "oldest": query.sortBy = "createdAt"; query.order = "asc"; break;
        case "nameAsc": query.sortBy = "name"; query.order = "asc"; break;
        case "nameDesc": query.sortBy = "name"; query.order = "desc"; break;
      }
      return query;
    };
  
    const refreshActiveTab = () => {
      const query = buildQuery();
      if (activeTab === "all") dispatch(getTemplates(query) as any);
      else if (activeTab === "recent") dispatch(getRecentlyUsedTemplates(query) as any);
      else if (activeTab === "favorite") dispatch(getFavoriteTemplates(query) as any);
    };
  
    useEffect(() => {
      refreshActiveTab();
    }, [dispatch, activeTab, filters.page, filters.limit, debouncedSearch, filters.type, filters.category, filters.sortBy]);
  
    useEffect(() => {
      if (activeTab === "favorite") {
        setTotalLocalFavorites(totalPages || 1);
      }
    }, [favoriteTemplates, activeTab, totalPages]);
  
    const handleTabChange = (event: React.SyntheticEvent, tab: "all" | "recent" | "favorite") => {
      dispatch(setActiveTab(tab));
      dispatch(setFilters({ page: 1 }));
      setSearchTerm("");
    };
  
    const handleFavoriteToggle = async (templateId: string) => {
      await dispatch(toggleFavorite(templateId) as any);
      refreshActiveTab();
    };
  
    const handleViewTemplate = (templateId: string) => {
      dispatch(getTemplateById(templateId) as any);
      // setOpen(true);
      console.log("view template", templateId);
      setOpenIndex(templateId);
    };
  
    const handleClose = () => {
      setOpenIndex(null);

      // dispatch(clearSelectedTemplate());
      // refreshActiveTab();
    };
  
    const handleFilterChange = (e: any) => {
      dispatch(setFilters({ [e.target.name]: e.target.value, page: 1 }));
    };
  
    const handlePageChange = (direction: "next" | "prev") => {
      const newPage = direction === "next" ? filters.page + 1 : Math.max(filters.page - 1, 1);
      dispatch(setFilters({ page: newPage }));
    };
  
    const handleEditClick = async (id: string) => {
      await dispatch(getTemplateById(id) as any);
      setOpenEditModal(true);
    };
  
    const handleCloseEditModal = () => {
      setOpenEditModal(false);
      setEditName("");
      setEditContent("");
      dispatch(clearSelectedTemplate());
      refreshActiveTab();
    };
  
    const handleSaveEdit = async () => {
      if (selectedTemplate) {
        const updatedData = {
          ...selectedTemplate,
          name: editName,
          content: JSON.parse(editContent),
        };
        await dispatch(updateTemplate({ id: selectedTemplate._id, data: updatedData }) as any);
        setOpenEditModal(false);
        dispatch(clearSelectedTemplate());
        refreshActiveTab();
      }
    };
  
    const handleDeleteTemplate = async (id: string) => {
      // if (window.confirm("Are you sure you want to delete this template?")) {
      setSelectedId(id);
      setIsDeleteModalopen(true);
      setMenuAnchorEl(({}));
      
      // }
    };
    const handleConfirmDelete = async() => {
        if (selectedId) {
          // dispatch(deleteTemplate(selectedId) as any);
          await dispatch(deleteTemplate(String(selectedId)) as any);
          setIsDeleteModalopen(false);
          refreshActiveTab();
          // setShowDeleteAlert(true);
          
          setSuccessMessage("Template Deleted Successfully");
          setTimeout(() => setSuccessMessage(null), 3000);
        }
        setIsDeleteModalopen(false);
      };
  
    const handleRestoreTemplate = async (id: string) => {
      await dispatch(restoreTemplate(id) as any);
      refreshActiveTab();
    };
  const [highlightedId, setHighlightedId] = useState<string|null>(null);

 
  const handleDuplicateTemplate = async (id: string) => {
    const res: any = await dispatch(duplicateTemplate(id) as any);
    if (!duplicateTemplate.fulfilled.match(res)) return;
  
    // now this is the slice Template with `_id` etc.
    const duplicated: Template = res.payload.template;
  
    let newList: Template[];
  
    if (activeTab === "all") {
      const idx = allTemplates.findIndex((t) => t._id === id);
      newList = [...allTemplates];
      newList.splice(idx + 1, 0, duplicated);
      dispatch(setAllTemplates(newList));
  
    } else if (activeTab === "recent") {
      const idx = recentTemplates.findIndex((t) => t._id === id);
      newList = [...recentTemplates];
      newList.splice(idx + 1, 0, duplicated);
      dispatch(setRecentTemplates(newList));
  
    } else {
      const idx = favoriteTemplates.findIndex((t) => t._id === id);
      newList = [...favoriteTemplates];
      newList.splice(idx + 1, 0, duplicated);
      dispatch(setFavoriteTemplates(newList));
    }
  
    setHighlightedId(duplicated._id);
    setMenuAnchorEl(({}));
    setTimeout(() => setHighlightedId(null), 8000);
    setSuccessMessage("Template Cloned Successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };
    
    const templatesToShow =
      activeTab === "all" ? allTemplates :
      activeTab === "recent" ? recentTemplates :
      favoriteTemplates;
  
    // const isTemplateFavorite = (template: any) =>
    //   template.isFavorite === true || template.favorite === true;
  
    const isLoading = () =>
      (activeTab === "all" && allTemplates.length === 0) ||
      (activeTab === "recent" && recentTemplates.length === 0) ||
      (activeTab === "favorite" && favoriteTemplates.length === 0);
  

  return (    
    <Container sx={{py: 4, bgcolor: '#F8F9FE',  maxWidth:  {xs: '100%',}, }}>
      <Typography sx={{ fontSize: "26px", }} gutterBottom>
              Template Dashboard
            </Typography>
              <Snackbar
              open={successMessage? true : false}
              autoHideDuration={3000}
              onClose={() => setSuccessMessage(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              // sx={{mt:8}}
            >
               <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ width: '100%' }}>
                  {successMessage}
                </Alert>
            </Snackbar>
              

      <Card sx={{p:2}}>
             
      {/* Top Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Templates" value={"all"} />
        <Tab label="Recently Used" value={"recent"} />
        <Tab label="Favourites" value={"favorite"} />
      </Tabs>

      {/* Search and Filters */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2} sx={{justifyContent:'space-between',}}>
        <Box>
                  
              <FormControl variant="outlined" size="small" sx={{ minWidth: {xs: 40,md:225}, bgcolor: "#F8F9FA", borderRadius: "6px", marginRight:"auto" }}>
                <InputLabel htmlFor="status-select" sx={{ fontSize: "14px", boxSizing:"border-box", display: "flex", alignItems: "center", }}>
                  <SearchIcon />&nbsp;Search by templates or tags
                </InputLabel>        
                <InputBase
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="search"
                sx={{
                  fontSize: "14px",
                  width: "100%",
                  pt:0.5, 
                  pb:0.5,         
                }}
              />      
              </FormControl>
        </Box>
         
        <Box sx={{display:'flex', flexWrap:'nowrap'}}>
   
        {/* <FormControl >
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="list"
            name="view-mode"
            value={view}
            onClick={(e)=>setView((e.target as HTMLInputElement).value as 'list' | 'grid')}
            sx={{display:'flex', flexDirection:'row'}}
          >
            <FormControlLabel value="list" control={<Radio />} label={<ChecklistIcon />} />
            <FormControlLabel value="grid" control={<Radio />} label={<GridViewIcon />} />
          </RadioGroup>
        </FormControl> */}

        
        <Box sx={{ display: 'flex', gap: 0.5, mr:1, bgcolor:'#F8F9FA', borderRadius:'6px', height:'37px' }}>
          <Tooltip title="List View">
            <IconButton
              onClick={() => setView('list')}
              color={view === 'list' ? 'primary' : 'default'}
            >
              <ChecklistIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{height:'30px', width:'0.8px', mt:0.5, color:'#D6D6D6'}} />
          <Tooltip title="Grid View">
            <IconButton
              onClick={() => setView('grid')}
              color={view === 'grid' ? 'primary' : 'default'}
            >
              <GridViewIcon />
            </IconButton>
          </Tooltip>
        </Box>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, bgcolor: "#F8F9FA", borderRadius: "6px", mr:1}}>
            <InputLabel htmlFor="status-select" sx={{ fontSize: "14px" }}>
              Categories
            </InputLabel>
            <Select
              id="category-select"
              name="category"
              label="Category"
              value={filters.category || ""} onChange={handleFilterChange}
              sx={{ fontSize: "14px", color: "#6D6976",    }}
            >
              <MenuItem value="" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
              All Categories
              </MenuItem>
              <MenuItem value="Promotional" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Promotional
              </MenuItem>
              <MenuItem value="Event Based" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Event Based
              </MenuItem>
              <MenuItem value="Transactional" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Transactional
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 80, maxWidth: 100, bgcolor: "#F8F9FA", borderRadius: "6px", mr:1}}>
            <InputLabel htmlFor="status-select" sx={{ fontSize: "14px" }}>
              Type
            </InputLabel>
            <Select
              id="type-select"
              label="Type" name="type"
              value={filters.type || ""} onChange={handleFilterChange}
              sx={{ fontSize: "14px", color: "#6D6976",    }}
            >
              <MenuItem value="" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
              All Type
              </MenuItem>
              <MenuItem value="Email" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
              Email
              </MenuItem>
              <MenuItem value="SMS" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
              SMS
              </MenuItem>
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 90, maxWidth: 100, bgcolor: "#F8F9FA", borderRadius: "6px", }}>
            <InputLabel htmlFor="status-select" sx={{ fontSize: "14px" }}>
              Sort by
            </InputLabel>
            <Select
              id="sortby-select"
              name="sortBy"
              label="Sort by"
              value={filters.sortBy || ""} onChange={handleFilterChange}
              sx={{ fontSize: "14px", color: "#6D6976", }}
            >
              <MenuItem value="" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Sort by
              </MenuItem>
              <MenuItem value="newest" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Newest
              </MenuItem>
              <MenuItem value="oldest" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Oldest
              </MenuItem>
              <MenuItem value="nameAsc" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Name (A to Z)
              </MenuItem>
              <MenuItem value="nameDesc" sx={{ fontSize: "14px", padding: "2px 4px", color: "#6D6976", }}>
                Name (A to Z)
              </MenuItem>
            </Select>
          </FormControl>
          </Box>
       
      </Stack>

      
      {view === 'list' ? (
      
      <Table sx={{border:'2px solid #ECEEF6',}}>
        <TableHead>
          <TableRow sx={{bgcolor:'#F3F3F3', color:'#A3AABC'}}>
            <TableCell sx={{color:'#A3AABC', textAlign:'center'}}>TEMPLATE</TableCell>
            <TableCell sx={{color:'#A3AABC'}}>TYPE</TableCell>
            <TableCell sx={{color:'#A3AABC'}}>LAST MODIFIED</TableCell>
            <TableCell sx={{color:'#A3AABC'}}>CATEGORY</TableCell>
            <TableCell sx={{color:'#A3AABC'}}>TAGS</TableCell>
            <TableCell sx={{color:'#A3AABC'}}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templatesToShow.map((template:any, i) => (

            <TableRow key={template._id} sx={{
              bgcolor: i%2 === 0? 'white' : '#FAFAFA', 
              border: i%2 === 0 ? 'white' : '#ECEEF6',
              opacity: Boolean(template.isDeleted)? 0.4 : 1 ,
              boxShadow: template._id === highlightedId ?  'inset 0px 0px 10px #ff9800' :  'inset 0px 0px 10px #ffffff'
              // pointerEvents: template.isDeleted ? "none" : "auto",
              // "& .restore-btn": {
              //     pointerEvents: "auto",
              //     opacity: 1
              //   }
            }}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1} >
                  <IconButton onClick={() => handleFavoriteToggle(template._id)} sx={{cursor:'pointer'}}>
                  {template.favorite ? (
                    <StarIcon fontSize="small" color="warning" />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                  </IconButton>
                  <Typography color="primary" fontWeight="medium" sx={{ cursor: "pointer" }}>
                    {template.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>{template.type}</TableCell>
              {/* <TableCell>{template.lastModified?.split('T').join(', ').slice(0,17)}</TableCell> */}
              <TableCell>{new Date(template.lastModified)?.toLocaleString('en-US', {
                  timeZone: 'America/New_York', // or 'UTC' or whatever zone you want
                  hour12: true,
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</TableCell>
              <TableCell>
                <Chip
                  label={template.category}
                  size="small"
                  sx={{
                  color:
                  template.category === 'Promotional' 
                  ? '#2B8A3E'
                   : template.category === 'Transactional' 
                   ? '#FD7E14' 
                   : template.category === 'Event Based' 
                   ? '#0057D9'
                  : template.category === 'Announcement'
                  ? '#F83738'
                  : template.category === 'Action'
                  ? '#0057D9'
                  : template.category === 'Product'
                  ? '#c0b000'
                  : template.category === 'Update'
                  ? '#04dcd1'
                  : template.category === 'New'
                  ? '#a7690b'
                  : '#52B141',
              bgcolor:
                template.category === 'Promotional' 
                ? '#DFFFE5'
                 : template.category === 'Transactional' 
                 ? '#FFECDD' 
                 : template.category === 'Event Based' 
                 ? '#E0ECFF'
                : template.category === 'Announcement'
                ? '#F8DDDD'
                : template.category === 'Action'
                ? '#E2ECFC'
                : template.category === 'Product'
                ? '#f9f7e2'
                : template.category === 'Update'
                ? '#e2f6f9'
                : template.category === 'New'
                ? '#f8e3c5'
                : '#E6F5E3',
                    fontWeight: 500,
                  }}
                />
              </TableCell>
              <TableCell>
              {template.tags?.join(", ") || "—"}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} sx={{alignItems:'center',}}>
                  <IconButton onClick={() => handleViewTemplate(template._id)}>
                    <VisibilityIcon color="primary" fontSize="small" />
                  </IconButton>
                  <Typography sx={{color:"#0057D9", cursor:'pointer'}}  onClick={() => handleViewTemplate(template._id)}>View</Typography>

                  <IconButton onClick={(e) => handleAnchorClick(e, template._id)}>
                    <MoreVertIcon fontSize="small"  />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl[template._id]}
                    open={Boolean(menuAnchorEl[template._id])}
                    onClose={handleAnchorClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    {!template.isDeleted && (
                      <>
                      <MenuItem onClick={() => handleEditClick(template._id)}>Edit</MenuItem>
                      <MenuItem onClick={() => handleDuplicateTemplate(template._id)}>Duplicate</MenuItem>
                      </>
                    )}                   

                    {template.isDeleted ? (
                        <MenuItem color="success" onClick={() => handleRestoreTemplate(template._id)}>Restore</MenuItem>
                      ) : (
                        <MenuItem color="error" onClick={() => handleDeleteTemplate(template._id)}>Delete</MenuItem>
                      )}
                  </Menu>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    ) : (
        <Grid container sx={{display:'flex', justifyContent:'center', gap:2.5}}>
        {templatesToShow.map((template: any, i: number) => (
          <Grid size={{xs:5.5}}  >
          <Card
            key={template._id}
            sx={{
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              position: 'relative',
              opacity: Boolean(template.isDeleted) ? 0.4 : 1,
              boxShadow: template._id === highlightedId ? 'inset 0px 0px 10px #ff9800' : '0px 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => handleFavoriteToggle(template._id)} sx={{ cursor: 'pointer', p: 0.5 }}>
                  {template.favorite ? (
                    <StarIcon fontSize="small" color="warning" />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
                <Typography variant="subtitle1" fontWeight={600}>
                  {template.name}
                </Typography>
              </Stack>
              <Chip
                label={template.category}
                size="small"
                sx={{
                  color:
                    template.category === 'Promotional' 
                    ? '#2B8A3E'
                     : template.category === 'Transactional' 
                     ? '#FD7E14' 
                     : template.category === 'Event Based' 
                     ? '#0057D9'
                    : template.category === 'Announcement'
                    ? '#F83738'
                    : template.category === 'Action'
                    ? '#0057D9'
                    : template.category === 'Product'
                    ? '#c0b000'
                    : template.category === 'Update'
                    ? '#04dcd1'
                    : template.category === 'New'
                    ? '#a7690b'
                    : '#52B141',
                bgcolor:
                  template.category === 'Promotional' 
                  ? '#DFFFE5'
                   : template.category === 'Transactional' 
                   ? '#FFECDD' 
                   : template.category === 'Event Based' 
                   ? '#E0ECFF'
                  : template.category === 'Announcement'
                  ? '#F8DDDD'
                  : template.category === 'Action'
                  ? '#E2ECFC'
                  : template.category === 'Product'
                  ? '#f9f7e2'
                  : template.category === 'Update'
                  ? '#e2f6f9'
                  : template.category === 'New'
                  ? '#f8e3c5'
                  : '#E6F5E3',
                  fontWeight: 500
                }}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" mt={1}>
              <span style={{ color: '#999' }}>Type:</span> {template.type}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
              <span style={{ color: '#999' }}>Tags:</span> {template.tags?.join(', ')?? '-'}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
              <span style={{ color: '#999' }}>Last Modified:</span> {new Date(template.lastModified)?.toLocaleString('en-US', {
                timeZone: 'America/New_York',
                hour12: true,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Tooltip title="View">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                  onClick={() => handleViewTemplate(template._id)}
                >
                  <VisibilityIcon fontSize="small" sx={{ color: '#007BFF' }} />
                  <Typography variant="body2" color="#007BFF" fontWeight={500}>
                    View
                  </Typography>
                  
                  {/* <CustomPreview  key={template.id}  doc={template.design} html={template.html} open={openIndex === template.id} handleClose={handleClose}/> */}
                  {/* <CustomPreview doc={template.content} /> */}
                </Box>
              </Tooltip>
              <IconButton onClick={(e) => handleAnchorClick(e, template._id)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl[template._id]}
                open={Boolean(menuAnchorEl[template._id])}
                onClose={() => handleAnchorClose(template._id)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                {!template.isDeleted && (
                  <>
                    <MenuItem onClick={() => handleEditClick(template._id)}>Edit</MenuItem>
                    <MenuItem onClick={() => handleDuplicateTemplate(template._id)}>Duplicate</MenuItem>
                  </>
                )}
                {template.isDeleted ? (
                  <MenuItem color="success" onClick={() => handleRestoreTemplate(template._id)}>Restore</MenuItem>
                ) : (
                  <MenuItem color="error" onClick={() => handleDeleteTemplate(template._id)}>Delete</MenuItem>
                )}
              </Menu>
            </Stack>
          </Card>
          {/* {openIndex === template._id &&
          ( 
          <CustomPreview  key={selectedTemplate.id}  doc={selectedTemplate.design} html={selectedTemplate.html} open={openIndex === selectedTemplate.id} handleClose={handleClose}/>
          )} */}

          </Grid>
        ))}
        </Grid>
     
    )}
    
      <Box mt={3}>
              <Button onClick={() => handlePageChange("prev")} disabled={filters.page === 1}>
                Previous
              </Button>
              <span style={{ margin: "0 10px" }}>
                Page {filters.page} of {activeTab === "favorite" ? totalLocalFavorites : totalPages}
              </span>
              <Button
                onClick={() => handlePageChange("next")}
                disabled={
                  filters.page >= (activeTab === "favorite" ? totalLocalFavorites : totalPages ?? 1)
                }
              >
                Next
              </Button>
            </Box>
      </Card>

      { selectedTemplate && selectedTemplate._id === openIndex && (
                  <CustomPreview  key={selectedTemplate.id}  
                  doc={selectedTemplate.content} 
                  html={selectedTemplate.html} 
                  // open={openIndex === selectedTemplate.id ? true : false} 
                  open={true}
                  // handleClose={()=> setOpen(false)}/>
                  handleClose={handleClose}
                  />
      )}

      {/* <Modal open={open} onClose={handleClose}>
        <Dialog
              open={open}
              onClose={handleClose}
              fullWidth
              maxWidth="sm"
              aria-labelledby="filter-modal-title"
              sx={{borderRadius: "10px",
                "& .MuiPaper-root": {
                  // width: '100%',
                  // height: '100%',
                },
                "& .MuiDialog-paper": { width: "80vw", maxWidth: "500px" ,  maxHeight:"none"},
              }}
            >
              <Box sx={{ bgcolor: '#0057D9', width:'100%', height: 35, display:'flex', justifyContent:'space-between'}}> 
                  <Typography sx={{color: "white", ml:2,mt:0.5}}>Template Details</Typography> 
                    <IconButton onClick={handleClose}>
                    <CloseIcon sx={{color:"white"}} />
                    </IconButton>
                </Box>
          {selectedTemplate ? (
            <Box sx={{m:3}}>
              <DialogContent>       
              
                    <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "150px auto",
                      gap: "8px",
                      maxWidth: "500px",
                      m:1
                    }}
                  >
                    <Typography sx={{color:'#A3AABC'}}>Name -</Typography>
                    <Typography>{selectedTemplate.name}</Typography>
              
                    <Typography sx={{color:'#A3AABC'}}>Type -</Typography>
                    <Typography>{selectedTemplate.type}</Typography>
              
              
                    <Typography sx={{color:'#A3AABC'}}>Category -</Typography>
                    <Typography>{selectedTemplate.category}</Typography>
              
                    <Typography sx={{color:'#A3AABC'}}>Tags -</Typography>
                    <Typography>{selectedTemplate.tags.toString().split(",").join(", ")}</Typography>
              
                    <Typography sx={{color:'#A3AABC'}}>lastModified -</Typography>
                    <Typography>{new Date(selectedTemplate.lastModified).toLocaleString('en-US', {
                        timeZone: 'America/New_York', // or 'UTC' or whatever zone you want
                        hour12: true,
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</Typography>
                  </Box>

                  </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} variant="contained" color="primary">
                  Close
                </Button>
              </DialogActions>
            </Box>
          ) : (
            <Typography>Loading template...</Typography>
          )}
        </Dialog>
      </Modal> */}

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={{ p: 4, bgcolor: "background.paper", m: "auto", mt: 8, width: 500, borderRadius: 2 }}>
          {selectedTemplate ? (
            <>
              <Typography variant="h6" gutterBottom>Edit Template</Typography>
              <TextField
                fullWidth
                label="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextareaAutosize
                minRows={10}
                style={{ width: "100%", padding: 10, fontFamily: "inherit", fontSize: 14 }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseEditModal} sx={{ mr: 1 }}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
              </Box>
            </>
          ) : (
            <Typography>Loading template...</Typography>
          )}
        </Box>
      </Modal>

      <DeleteModal open={isDeleteModalopen} handleClose={()=>setIsDeleteModalopen(false)} handleConfirm={handleConfirmDelete} title='Delete This Template' message='Are you sure you want to delete this template?'  />


    </Container>
  );
};

export default TemplatesTable;

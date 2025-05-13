import React,{ Suspense, useEffect, useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import LoopIcon from '@mui/icons-material/Loop';

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
  
  //delete
    // const handleDuplicateTemplate = async (id: string) => {
    //   // dispatch the thunk and wait for the fulfilled action
    //   const res: any = await dispatch(duplicateTemplate(id) as any);
    
    //   // check that it actually succeeded
    //   if (duplicateTemplate.fulfilled.match(res)) {
    //     // extract the duplicated template from whatever your API returns
    //     const duplicated: Template = res.payload.template;
    
    //     let newList: Template[];
    
    //     if (activeTab === "all") {
    //       // find the original’s position
    //       const idx = allTemplates.findIndex((t) => t._id === id);
    //       newList = [...allTemplates];
    //       // insert the duplicate right after it
    //       newList.splice(idx + 1, 0, duplicated);
    //       dispatch(setAllTemplates(newList));
    
    //     } else if (activeTab === "recent") {
    //       const idx = recentTemplates.findIndex((t) => t._id === id);
    //       newList = [...recentTemplates];
    //       newList.splice(idx + 1, 0, duplicated);
    //       dispatch(setRecentTemplates(newList));
    
    //     } else {
    //       const idx = favoriteTemplates.findIndex((t) => t._id === id);
    //       newList = [...favoriteTemplates];
    //       newList.splice(idx + 1, 0, duplicated);
    //       dispatch(setFavoriteTemplates(newList));
    //     }
    
    //     // now highlight it
    //     setHighlightedId(duplicated._id);
    
    //     // clear the highlight after a couple seconds
    //     setTimeout(() => setHighlightedId(null), 3000);
    //   }
    // };
    
  // const handleDuplicateTemplate = async (id: string) => {
  //   const res: any = await dispatch(duplicateTemplate(id) as any);
  //   console.log("Duplicated response:", res.payload);
  //   if (res.payload) {
  //     const duplicated = res.payload.template;

  //     if (activeTab === "all") {
  //       // Add to the end of allTemplates
  //       const newList = [...allTemplates, duplicated];
  //       dispatch(setAllTemplates(newList));
  //     } else if (activeTab === "recent") {
  //       const newList = [...recentTemplates, duplicated];
  //       dispatch(setRecentTemplates(newList));
  //     } else if (activeTab === "favorite") {
  //       const newList = [...favoriteTemplates, duplicated];
  //       dispatch(setFavoriteTemplates(newList));
  //     }
  //   }
  // };

    // const handleDuplicateTemplate = async (id: string) => {
    //   const newTemplate = await dispatch(duplicateTemplate(id) as any).unwrap(); // 👈 get the result directly
    
    //   setLocalTemplates((prev) => {
    //     const index = prev.findIndex((tpl) => tpl._id === id);
    //     if (index === -1) return prev;
      
    //     const updated = [...prev];
    //     updated.splice(index + 1, 0, newTemplate); // insert right after
    //     return updated;
    //   });
      
    // };
    
    
  
    // const templatesToShow =
    //   activeTab === "all" ? allTemplates :
    //     activeTab === "recent" ? recentTemplates :
    //       favoriteTemplates;

  
    // const isTemplateFavorite = (template: any) =>
    //   template.isFavorite === true || template.favorite === true;
  
    const isLoading = () =>
      (activeTab === "all" && allTemplates.length === 0) ||
      (activeTab === "recent" && recentTemplates.length === 0) ||
      (activeTab === "favorite" && favoriteTemplates.length === 0);

      
  ///////////////
    const LazyReader = React.lazy(() => import('@usewaypoint/email-builder').then((module) => ({ default: module.Reader })));
      
     const [tabIndex, setTabIndex] = React.useState(0);
      const [topBarIndex, settopBarIndex] = React.useState<string>('All');
      // const [openIndex, setOpenIndex] = useState<string | null>(null);
      // const dispatch = useAppDispatch();
      const templates = useSelector(
        (state: RootState) => state.template.allTemplates
      );
    
      
          
      // Define params for fetching templates
      // const params = useMemo(() => ({
      //   search: "",
      //   type: "Email",
      //   page: 1,
      //   limit: 15,
      // }), []);
    
      // useEffect(() => {
      //   // dispatch(getTemplates(params));
      //   dispatch(getTemplates(params) as any);
      //   console.log('templates', templates)
    
      // }, [dispatch, params]);
    
      // useEffect(()=>{
      //   // const query = buildQuery();
      //     dispatch(getFavoriteTemplates(params) as any);
      //     console.log('favoriteTemplates: ', favoriteTemplates);
      // },[dispatch, params])
    
    
    
      // useEffect(() => {
      //   console.log(templates);
      // }, [templates])
      const navigate = useNavigate();
      const rootBlockId = 'root';
    
      const topBarTabs = ['All','Favorite', ...new Set(
        templates
        // .filter((temp)=>temp.type === 'Email')
        .map((temp) => temp.category)
        .filter(Boolean)
      )];

      const templatesToShow = useMemo(() => {
        const source =
          topBarIndex === 'Favorite' ? favoriteTemplates :
          topBarIndex === 'All' ? allTemplates :
          allTemplates.filter(template => template.category === topBarIndex);
      
        return source.filter(template => template.type === 'Email');
      }, [topBarIndex, allTemplates, favoriteTemplates]);
      

      // const templatesToShow = useMemo(() => {
      //   if (topBarIndex === 'All') return allTemplates;
      //   if (topBarIndex === 'Favorite') return favoriteTemplates;
      //   return allTemplates.filter(template => template.category === topBarIndex);
      // }, [topBarIndex, allTemplates, favoriteTemplates]);

      
      // const templatesToShow =
      // topBarIndex === "All" ? allTemplates :
      //   topBarIndex === "Favorite" ? favoriteTemplates :
      //    allTemplates.filter(template => template.category === topBarIndex);
      console.log('topBarIndex:', topBarIndex);

    console.log('last console fav', favoriteTemplates);
  return (    
    
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, p: 3 }} >
          {/* Left Sidebar 
          <Card
            sx={{
              width: { xs: '100%', md: 250, },
              p: 2,
              mr: 3,
              mb: 2,
              borderRight: "1px solid #ddd",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" mb={2}>
              Search Templates
            </Typography>
    
            <List>
              {topBarTabs.map((label, idx) => (
                <ListItemButton
                  key={label}
                  selected={topBarIndex === label}
                  onClick={() => settopBarIndex(label)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>
          </Card> */}
    
          {/* Main Content */}
          <Box flex={1}>
            <Typography variant="h4" mb={2}>
              Design Your Template
            </Typography>
            <Card>
              <Tabs
                value={tabIndex}
                onChange={(_, val) => setTabIndex(val)}
                aria-label="top tabs"
              >{topBarTabs.map((label, index) => (
                <Tab
                  key={label}
                  label={label}
                  value={index}
                  onClick={() => settopBarIndex(label)}
                />
              ))}
              {/* <Tab label="Basic Templates" /> */}
              </Tabs>
            </Card>
            <Card sx={{ mt: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ mr: 2, color: '#6D6976' }} >
                Start from scratch and design from a blank canvas
              </Typography>
              <Button variant="contained" sx={{ backgroundColor: '#0057D9' }} onClick={() => navigate('/build-template')}>
                Start From Scratch
              </Button>
            </Card>
    
            <Grid container spacing={3} mt={2}>
              {templatesToShow
                //   .filter((template)=>template.type === 'Email')
                // .filter((template) => 
                  // (topBarIndex === 'All' ? true : topBarIndex === 'Favorite' ? true : template.category === topBarIndex)
                  // && 
                  // (template.type === 'Email')
                // )
                .map((template: any) => (
                  <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 2.4 }} key={template._id} sx={{ textAlign: 'left', position: 'relative', }}>
                    <>
                      <Card sx={{
                        width: '200px',
                        height: '200px',
                        //  justifyContent:'center', alignItems:'center',
                        borderRadius: '10px',
                      }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 800,
                            height: 600,
                            '&:hover .hover-buttons': {
                              opacity: 1,
                              pointerEvents: 'auto',
                            },
                            '&:hover::after': {
                              content: '""',
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(0, 123, 255, 0.2)',
                              zIndex: 1,
                            },
                          }}
                        >
                          {/* Scaled Preview */}
                          
                          <Suspense fallback={<LoopIcon />} >
    
                          <Box
                            sx={{
                              transform: 'scale(0.25)',
                              transformOrigin: 'top left',
                              width: '800px',
                              // height: '2400px',
                              pointerEvents: 'none',
                            }}
                          >
                               {/* <Box sx={{ width: '100%', maxHeight: '60vh', overflow: 'auto' }}>
                                  {template.html &&
                                      <Box
                                      sx={{ width: '100%', height: '100%', overflow: 'hidden', p: 2, m: 2 }}
                                      dangerouslySetInnerHTML={{ __html: decodeHTML(template.html) }}
                                      />
                                  }
                                  </Box> */}
                                    <LazyReader document={template.content} rootBlockId={rootBlockId} />
                                  
                          </Box>
                          </Suspense>
    
                          {/* Buttons - Not Scaled, Stay in Normal Size */}
                          <Box
                            className="hover-buttons"
                            sx={{
                              position: 'absolute',
                              top: 55,
                              left: 65,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                              opacity: 0,
                              pointerEvents: 'none',
                              zIndex: 2,
                              transition: 'opacity 0.3s',
                            }}
                          >
                            <Button
                              size="medium"
                              variant="contained"
                              color="primary"
                              sx={{
                                bgcolor: '#0057D9',
                                '&:hover': {
                                  bgcolor: '#0040a5',
                                },
                              }}
                            >
                              Select
                            </Button>
                            <Button
                              size="medium"
                              variant="contained"
                              sx={{
                                bgcolor: 'white',
                                color: '#232232',
                                '&:hover': {
                                  bgcolor: '#e6e6e6',
                                },
                              }}
                              onClick={setOpenIndex.bind(null, template._id)}
                            >
                              preview
                            </Button>
                          </Box>
                        </Box>                  
    
                      </Card>
                      <Typography sx={{
                        color: '#6D6976', textAlign: 'center', margineRight: 'auto', maxWidth: '210px', mt:0.5, // position: 'absolute',bottom:-24, left:14, overflow: 'hidden',
                      }}>{template.name}</Typography>
                        { template && template._id === openIndex &&(           
                          <CustomPreview  key={template._id}  
                          doc={template.content} 
                          html={template.html} 
                          // open={openIndex === template.id} 
                          open={true}
                          handleClose={()=>setOpenIndex(null)}
                          />)
                        }
                    </>
                  </Grid>
                  
                ))}
            </Grid>
          </Box>
        </Box>
    
  );
};

export default TemplatesTable;

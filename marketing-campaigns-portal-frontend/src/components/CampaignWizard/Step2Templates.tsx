import React, {
  useState,
  useMemo, 
  useEffect,
  Suspense} from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { Types } from "mongoose";
import {
  IconButton,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  // Paper,
  Container,
  Grid2 as Grid,
  InputLabel,
  InputBase,
} from "@mui/material";
import { CampaignData } from '../../types/campaign';
import { Template } from '../../types/template';

import { useSelector, useDispatch } from "react-redux";
import { getTemplateById, getTemplates, setFilters } from '../../redux/slices/templateSlice';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import CustomPreview from "../../components/Templates/CustomPreview";
import LoopIcon from '@mui/icons-material/Loop';
import { useDebounce } from "use-debounce";


interface Step2TemplatesProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  campaignData: CampaignData;
  templateData: {name: string; type: string};
  setTemplateData:React.Dispatch<React.SetStateAction<{name: string; type: string}>>;
}

const Step2Templates: React.FC<Step2TemplatesProps> = ({ handleChange, campaignData, templateData, setTemplateData }) => {

    const [openIndex, setOpenIndex] = useState<string | null>(null);    
    const dispatch = useDispatch();
    // const dispatch = useAppDispatch();
  
    // const templates  = useSelector(
    //   (state: RootState) => state.template.allTemplates
    // );        
      // Define params for fetching templates
      // const params = useMemo(() => ({
      //     // search: "",
      //     // type: "",
      //     // category: "",
      //     // sortBy: "",
      //     page: 1,
      //     limit: 10,
      //   }), []);
    //   useEffect(() => {
    //     dispatch(getTemplates(params));
    //   }, []); 
      
    //    useEffect(() => {
    //      console.log(templates  );
    //    }, [templates])

    //new code for template fetch
    
    const {
          allTemplates = [],
          // recentTemplates = [],
          // favoriteTemplates = [],
          filters = { page: 1, limit: 10, type: "", category: "", sortBy: "" },
          totalPages = 1,
          activeTab = "all",
          selectedTemplate = null,
        } = useSelector((state: RootState) => state.template || {});
    
        console.log(allTemplates)
        const [searchTerm, setSearchTerm] = useState("");
        const [debouncedSearch] = useDebounce(searchTerm, 500);
        const [view, setView] = useState<'list' | 'grid'>('list');
      
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
  
    useEffect(() => {
      const query = buildQuery();
      dispatch(getTemplates(query) as any);
    }, [filters.page, debouncedSearch, filters.type, filters.category, filters.sortBy]);
    

    useEffect(() => {
      dispatch(setFilters({ page: 1 }));
    }, [debouncedSearch, filters.type, filters.category, filters.sortBy, dispatch]);
    
      
    const handleClose = () => {
      setOpenIndex(null);
    };

    const handleViewTemplate = (templateId: string) => {
      dispatch(getTemplateById(templateId) as any);
      // setOpen(true);
      console.log("view template", templateId);
      setOpenIndex(templateId);
    };

  // Filter templates based on the selected type
  const filteredTemplates = allTemplates.filter((template) => template.type === templateData.type);

  const isSelected = (selectVal: string | Types.ObjectId) => {
    return campaignData.template === selectVal ? '2px solid #007BFF' : '1px solid #ddd';
  };

  useEffect(() => {
    if (campaignData.template) {
      const selectedAudience = allTemplates.find(
        (template) => template._id?.toString() === campaignData.template?.toString()
      );  
      if (selectedAudience) {
        setTemplateData((prev) => {
          if (prev.name === selectedAudience.name && prev.type === selectedAudience.type) {
            return prev;
          }
          return {
            name: selectedAudience.name,
            type: selectedAudience.type,
          };
        });
      } else {
        console.warn("No matching template found for campaignData.template");
      }
    }
  }, [campaignData.template]);

  // const handlePageChange = (direction: "next" | "prev") => {
  //       const newPage = direction === "next" ? filters.page + 1 : Math.max(filters.page - 1, 1);
  //       dispatch(setFilters({ page: newPage }));
  //     };
  const handlePageChange = (direction: "next" | "prev") => {
        const newPage = direction === "next" ? filters.page + 1 : Math.max(filters.page - 1, 1);
        dispatch(setFilters({ page: newPage }));
      };

  const rootBlockId = 'root';

    const LazyReader = React.lazy(() => import('@usewaypoint/email-builder').then((module) => ({ default: module.Reader })));
  
  return (
    <Box sx={{ boxSizing: 'border-box' }}>
      <Box
        display="flex"
        sx={{
          justifyContent: { md: "space-between", xs: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", sm: "flex-start", md: "center" }
        }} mt={2} mb={2} >
        <Box>
          <Typography variant="h6" >Select  Template</Typography>
          <Typography sx={{ color: "#626262" }}>Choose from saved templates or create new template.</Typography>
        </Box>
        <Button variant="contained"
                  sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, mt:{xs:1, md:0}, ":hover": { bgcolor: '#2068d5' } }}> 
                  +&nbsp;Create&nbsp;New&nbsp;Template</Button>
            </Box>
      <Typography variant="h6">Choose Template</Typography>

      <FormControl variant="outlined" size="small" sx={{ minWidth: {xs: 225}, bgcolor: "#F8F9FA", borderRadius: "6px", marginRight:"auto", mt: 1}}>
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
                        pb:1,         
                      }}
                    />      
                    </FormControl>

      <Container maxWidth="lg" sx={{ p: 2 }}>
        {/* Notification Type Selector */}
        <Grid container spacing={2} border={2} borderColor="#ECEEF6" sx={{ border: '2px solid #ECEEF6', borderRadius: 1, p: 1, }}>
          <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: { xs: 'none', md: '2px solid #ECEEF6' }, borderColor: "#ECEEF6", pr: 2 }}>
            <Typography sx={{ borderBottom: '2px solid #ECEEF6', mb: 1, p: 1 }}>TYPE</Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup

                value={templateData.type}
                onChange={(e) => setTemplateData((prev) => ({
                  ...prev, type: e.target.value as "Email" | "SMS" | "Push Notifications",
                })
                )}
              >
                <FormControlLabel value="Email" control={<Radio />} label="Email" />
                <FormControlLabel value="SMS" control={<Radio />} label="SMS" />
                {/* <FormControlLabel value="Push Notifications" control={<Radio />} label="Push Notifications" /> */}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Display only filtered templates */}
            <Typography sx={{ borderBottom: '2px solid #ECEEF6', mb: 1.5, p: 1 }}>TEMPLATE</Typography>
            {filteredTemplates.map((template) => (
              <Card key={template._id?.toString()}
                onClick={() => {
                  handleChange({ target: { name: "template", value: template._id?.toString() } } as any);
                  setTemplateData({name: template.name, type: template.type})
                }}

                sx={{
                  border: isSelected(template._id.toString()),
                  display: "flex", mb: 2, p: 1, bgcolor: '#FAF9F9', shadow: 0, borderRadius: 1,
                  boxShadow: 'none', position:'relative',
                }}>
                <CardMedia
                  // component="img"
                  sx={{ width: { xs: 200, sm: 220 }, height: { xs: 80, sm: 120 }, color: '#626262', objectFit: 'cover', flexShrink: '0' }}
                  // image={template.image}
                  // alt={template.name}
                />
                <Suspense fallback={<LoopIcon />} >                
                  <Box
                    sx={{
                      transform: 'scale(0.25)',
                      transformOrigin: 'top left',
                      width: '800px',
                      // height: '2400px',
                      pointerEvents: 'none',
                      position: "absolute",
                      left:0,
                      top: 0,
                    }}
                  >
                    <LazyReader document={template.content} rootBlockId={rootBlockId} />                          
                  </Box>
                  </Suspense>

                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { sx: 'none', md: 'center' }, alignItems: { sx: 'none', md: 'center' } }}>
                    <Typography variant="h6" sx={{ fontSize: { xs: '14px', sm: '15px', md: '16px' } }} >{template.name}&nbsp; </Typography>
                    <Typography component="span" sx={{ fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px' }, color: '#ABABAB' }}>Created on {template.createdAt.split('T').join(' ').slice(0,19)}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#626262" }}>{template.category}</Typography>

                  <Typography sx={{ alignItems: "baseline", color: "#495057", fontSize: { xs: '12px', sm: '14px' }, }}>
                    <IconButton  onClick={(e) => {
                        e.stopPropagation();  
                        handleViewTemplate(template._id)
                      }} ><VisibilityIcon /></IconButton>View Template</Typography>

                </CardContent>
                  { template && template._id === openIndex &&(
                    <CustomPreview  key={template._id}  
                      doc={template?.content} 
                      html={template?.html} 
                      // open={openIndex === template.id} 
                      open={true}
                      handleClose={handleClose}
                      />)
                    }
              </Card>
            ))}
          </Grid>
        </Grid>
                
      </Container>
      <Box mt={3}>
        <Button onClick={() => handlePageChange("prev")} disabled={filters.page === 1}>
          Previous
        </Button>
        <span style={{ margin: "0 10px" }}>
          Page {filters.page} of { totalPages}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={
            filters.page >= ( totalPages ?? 1)
          } >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step2Templates;

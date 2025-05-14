import React, { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  // CardMedia,
  // CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemText,
  //   Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { getTemplates, getFavoriteTemplates, setFilters, duplicateTemplate } from '../../redux/slices/templateSlice';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import type { Template } from "../../redux/slices/templateSlice";
// import { Reader } from '@usewaypoint/email-builder';
import CustomPreview from "../../components/Templates/CustomPreview";
import LoopIcon from '@mui/icons-material/Loop';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useDocument } from '../EditorSample/documents/editor/EditorContext';
import { Template as TemplateType } from '../../types/template';
import { useDebounce } from "use-debounce";

// const topBarTabs = [
//   'All Basic Templates',
//   'Give an Update',
//   'Make an Announcement',
// ];

type EmailTemplateProps = {
  rootBlockId?: string;
}

export default function EmailTemplateGallery(props: EmailTemplateProps) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [topBarIndex, settopBarIndex] = React.useState<string>('All');
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  // const templates = useSelector(
  //   (state: RootState) => state.template.allTemplates
  // );

  const {
        allTemplates = [],
        recentTemplates = [],
        favoriteTemplates = [],
        filters = { page: 1, limit: 4, type: "", category: "", sortBy: "" },
        totalPages = 1,
        activeTab = "all",
        selectedTemplate = null,
      } = useSelector((state: RootState) => state.template || {});
  
      
  // Define params for fetching templates
  // const params = useMemo(() => ({
  //   search: "",
  //   type: "Email",
  //   page,
  //   limit: 20,
  // }), [page]);

  // useEffect(() => {
  //   // dispatch(getTemplates(params));
  //   dispatch(getTemplates(params) as any);
  //   console.log('templates', allTemplates)

  // }, [dispatch, params]);

  // useEffect(()=>{
  //   // const query = buildQuery();
  //     dispatch(getFavoriteTemplates(params) as any);
  //     console.log('favoriteTemplates: ', favoriteTemplates);
      
  // },[dispatch, params])
  
    const [debouncedSearch] = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (filters.page !== 1) {
      dispatch(setFilters({ ...filters, page: 1 }));
    }
  }, [debouncedSearch, filters.type, filters.category, filters.sortBy]);
      
  useEffect(() => {
    console.log('templates:', allTemplates, ' favoriteTemplates:', favoriteTemplates);
    // setLocalFav(favoriteTemplates);
  }, [allTemplates, favoriteTemplates])
  const navigate = useNavigate();
  const rootBlockId = 'root';

  const topBarTabs = ['All','Favorite', ...new Set(
    allTemplates
    // .filter((temp)=>temp.type === 'Email')
    .map((temp) => temp.category)
    .filter(Boolean)
  )];

  // const topBarTabs = ['All', 'Favorite', 'Promotional', 'Transactional', 'Event Based', 'Update', 'Announcement', 'Action', 'Product', 'Holiday']

  const templatesToShow =
  topBarIndex === "All" ? allTemplates :
  topBarIndex === "Favorite" ? favoriteTemplates :
  allTemplates.filter(template => template.category === topBarIndex);
        
  const LazyReader = React.lazy(() => import('@usewaypoint/email-builder').then((module) => ({ default: module.Reader })));
///

  const loaderRef = useRef(null);
  useEffect(() => {
    if (loading || !hasMore) return;
  
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });
  
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
  
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, hasMore]);


  // useEffect(() => {
  //   if (!hasMore) return;
  
  //   setLoading(true);
  //   dispatch(getTemplates({ page, type: "Email", limit: 4 }) as any).then((res: any) => {
  //     if (res?.payload?.length < 4) {
  //       setHasMore(false);
  //     }
  //     setLoading(false);
  //   });
  // }, [page]);

  // useEffect(() => {
  //   if (!hasMore) return;
  
  //   setLoading(true);
  //   dispatch(getFavoriteTemplates({ page, type: "Email", limit: 4 }) as any).then((res: any) => {
  //     if (res?.payload?.length < 4) {
  //       setHasMore(false);
  //     }
  //     setLoading(false);
  //   });
  // }, [page]);

  useEffect(() => {
    if (!hasMore) return;
  
    setLoading(true);
    setTimeout(() => {
      const fetchAction = topBarIndex === "Favorite"
        ? getFavoriteTemplates({ page, type: "Email", limit: 4, append: true })
        : getTemplates({ page, type: "Email", limit: 4, append: true });
  
      dispatch(fetchAction as any).then((res: any) => {
        const isShort = document.documentElement.scrollHeight <= window.innerHeight;
        const noMoreData = res?.payload?.length < 4;
  
        if (isShort || noMoreData) {
          setHasMore(false);
        }
  
        setLoading(false);
      });
    }, 200);
  }, [page, topBarIndex]);
  
  //select
  
    const handleSelect = async(id: string) =>{
      if(id){
        const res: any = await dispatch(duplicateTemplate(id) as any);
        console.log(res); 
      }// if (!duplicateTemplate.fulfilled.match(res)) return;
      // const duplicated: Template = res.payload.template;
      
  }
  
  
  
  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(getTemplates(params) as any).then((res: any) => {
  //     if (res?.payload?.length < 20) {
  //       setHasMore(false);
  //     }
  //     setLoading(false);
  //   });
  // }, [dispatch, params]);
  

  
  //imp!
  // const decodeHTML = (html: string) => {
  //     const txt = document.createElement("textarea");
  //     txt.innerHTML = html;
  //     return txt.value;
  // };

  // Infinte Scroll
  
  // const templatesToShow = useMemo(() => {
  //         const source =
  //           topBarIndex === 'Favorite' ? localFav :
  //           topBarIndex === 'All' ? allTemplates :
  //           allTemplates.filter(template => template.category === topBarIndex);
        
  //         return source
  //         // .filter(template => template.type === 'Email');
  //       }, [topBarIndex, allTemplates, favoriteTemplates]);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  //     if (bottom && !loading && hasMore) {
  //       setLoading(true);
  //       setPage((prev) => prev + 1);
  //     }
  //   };
  
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [loading, hasMore]);
  
  // useEffect(() => {
  //   const fetchTemplates = async () => {
  //     try {
  //       setLoading(true);
  //       const result = await dispatch(getTemplates(params) as any).unwrap();
  //       if (result.length < 15) setHasMore(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchTemplates();
  // }, [page, dispatch]);

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
          {(templatesToShow ?? [])
            //   .filter((template)=>template.type === 'Email')
            // .filter((template) => (topBarIndex === 'All' ? true : template.category === topBarIndex)
            //   && (template.type === 'Email')
            // )
            .filter((template) => {
              if (topBarIndex === 'All') return template.type === 'Email';
              if (topBarIndex === 'Favorite') return favoriteTemplates.some(fav => fav._id === template._id);
              return template.category === topBarIndex && template.type === 'Email';
            })
            
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
                          top: 57,
                          left: 57,
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
                          onClick={() => handleSelect(template._id) as any}
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
                    color: '#6D6976', textAlign: 'center', margineRight: 'auto', maxWidth: '210px', mt:0.5, overflowX:'hidden', // position: 'absolute',bottom:-24, left:14, overflow: 'hidden',
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
        <Grid size={12}>
          {loading && <Typography>Loading more templates...</Typography>}
          <div ref={loaderRef} />
        </Grid>

      </Box>
    </Box>
  );
}

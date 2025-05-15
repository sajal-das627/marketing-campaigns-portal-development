import React, { useState, useEffect, Suspense, } from 'react';
import {
  Box, Typography, Grid2 as Grid, Card, Button, Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import {
  getTemplates,
  getFavoriteTemplates,
  getTemplatesByCategory,
  duplicateTemplate
} from '../../redux/slices/templateSlice';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import CustomPreview from "../../components/Templates/CustomPreview";
import type { Template } from "../../redux/slices/templateSlice";
import AllModal from '../../components/Modals/DeleteModal';
import LoopIcon from '@mui/icons-material/Loop';

export default function EmailTemplateGallery() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rootBlockId = 'root';

  useSelector((state: RootState) => state.template || {});

  const [tabIndex, setTabIndex] = useState(0);
  const [topBarIndex, setTopBarIndex] = useState("All");
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [templates, setTemplates] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successIndex, setSuccessIndex] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const topBarTabs = ['All', 'Favorite', ...categories];

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      let res;
      if (topBarIndex === "All") {
        res = await dispatch(getTemplates({ page, limit: 12, type: "Email" }) as any);
        if (res?.payload?.data) {
          setTemplates(res.payload.data);
          setTotalPages(res.payload.totalPages);

          const extractedCategories = Array.from(
            new Set(res.payload.data.map((t: any) => t.category).filter(Boolean))
          ) as string[];

          setCategories(extractedCategories);
        }
      } else if (topBarIndex === "Favorite") {
        res = await dispatch(getFavoriteTemplates({ page, limit: 12, type: "Email" }) as any);
        if (res?.payload?.data) {
          setTemplates(res.payload.data);
          setTotalPages(res.payload.totalPages);
        }
      } else {
        res = await dispatch(getTemplatesByCategory({
          category: topBarIndex,
          type: "Email",
          page,
          limit: 12
        }) as any);
        if (res?.payload?.data) {
          setTemplates(res.payload.data);
          setTotalPages(res.payload.totalPages);
        }
      }
    } catch (err) {
      console.error("Template fetch failed:", err);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [topBarIndex]);

  useEffect(() => {
    fetchTemplates();
  }, [topBarIndex, page]);

  const handleSelect = async (id: string) => {
    if (id) {
      const res: any = await dispatch(duplicateTemplate(id) as any);
      console.log('res', res);

      if (!duplicateTemplate.fulfilled.match(res)) return;
      const duplicated: Template = res.payload.template._id;
      navigate(`/build-template/${duplicated}`);
      console.log('duplicateID:', duplicated);
    }
    else console.log("ID doesn't exist");
  }

  const LazyReader = React.lazy(() => import('@usewaypoint/email-builder').then((module) => ({ default: module.Reader })));

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, p: 3 }}>
      <Box flex={1}>
        <Typography variant="h4" mb={2}>
          Design Your Template
        </Typography>

        <Card>
          <Tabs
            value={tabIndex}
            onChange={(_, val) => {
              setTabIndex(val);
              setTopBarIndex(topBarTabs[val]);
            }}
            aria-label="template tabs"
          >
            {topBarTabs.map((label, index) => (
              <Tab key={label} label={label} value={index} />
            ))}
          </Tabs>
        </Card>

        <Card sx={{ mt: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ mr: 2, color: '#6D6976' }}>
            Start from scratch and design from a blank canvas
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0057D9' }}
            onClick={() => navigate('/build-template')}
          >
            Start From Scratch
          </Button>
        </Card>

        <Grid container spacing={3} mt={2}>
          {(templates ?? [])
            .filter((template) => template?.type === 'Email')
            .map((template: any) => (
              <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3, xl:2.4 }} key={template._id}>
                <Card sx={{ width: '200px', height: '200px', borderRadius: '10px' }}>
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
                        onClick={() => {setSuccessIndex(template._id) as any}}
                        // onClick={() => handleSelect(template._id) as any}
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

                <Typography sx={{ color: '#6D6976', textAlign: 'center', maxWidth: '210px', mt: 0.5 }}>
                  {template.name}
                </Typography>

                {template && template._id === openIndex && (
                  <CustomPreview
                    key={template._id}
                    doc={template.content}
                    html={template.html}
                    open={true}
                    handleClose={() => setOpenIndex(null)}
                  />
                )}
                
                 {template && template._id === successIndex && (
                <AllModal
                  open={true}
                  handleClose={() => {setSuccessIndex(null) }}
                  handleConfirm={() => handleSelect(template._id) as any}
                  
                  title="Do you want Select this template?"
                  message={`Copy and Update "${template.name}" as a New Template`}
                  btntxt="Yes"
                  icon={{ type: "success" }}
                  color="primary"
                />)}
              </Grid>
            ))}
        </Grid>

        <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Typography>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </Box>

        {loading && <Typography mt={2}>Loading templates...</Typography>}
      </Box>
    </Box>
  );
}

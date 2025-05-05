import React, {useState, useMemo, useEffect} from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemText,
//   Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
useDispatch,
 useSelector } from "react-redux";
import { getTemplates } from '../../redux/slices/templateSlice';


import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import type { Template } from "../../redux/slices/templateSlice";
import { Reader } from '@usewaypoint/email-builder';

// interface Template {
//   name: string;
//   image: string;
// }

// const templates: Template[] = [
//   { name: 'New Template', image: '/images/template1.png' },
//   { name: 'Fantastic Template', image: '/images/template2.png' },
//   { name: 'Intelligent Cotton Template', image: '/images/template3.png' },
//   { name: 'Generic Fresh Tuna Template', image: '/images/template4.png' },
// ];

const sidebarTabs = [
  'All Basic Templates',
  'Custom',
  'Give an Update',
  'Make an Announcement',
  'Request Action',
  'Sell Product',
];

type EmailTemplateProps = {
    rootBlockId?: string;

}

export default function EmailTemplateGallery(props: EmailTemplateProps) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [sidebarIndex, setSidebarIndex] = React.useState(0);
  const [doc, setDoc] = useState<any>();
    
  const dispatch = useAppDispatch();
//   const dispatch = useDispatch();

  const templates  = useSelector(
    (state: RootState) => state.template.allTemplates
  );
      
    // Define params for fetching templates
    const params = useMemo(() => ({
        // search: "",
        // type: "",
        // category: "",
        // sortBy: "",
        page: 1,
        limit: 65,
      }), []);

    // const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTemplates(params));
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      
    useEffect(() => {
        console.log(templates  );
    }, [templates])
    const navigate = useNavigate();
    const rootBlockId = 'root';

    const decodeHTML = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

  return (
    <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, p:3 }} >
      {/* Left Sidebar */}
      <Card
        sx={{width:{xs:'100%', md:250,},
            p:2,
        mr:3,
        mb:2,
        borderRight:"1px solid #ddd",
        display:"flex",
        flexDirection:"column"}}        
      >
        <Typography variant="h6" mb={2}>
          Search Templates
        </Typography>

        <List>
          {sidebarTabs.map((label, idx) => (
            <ListItemButton
              key={label}
              selected={sidebarIndex === idx}
              onClick={() => setSidebarIndex(idx)}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Card>

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
        >
          <Tab label="Basic Templates" />
          <Tab label="Designed Templates" />
          <Tab label="Layouts" />
          <Tab label="Past Campaigns" />
        </Tabs>
    </Card>
        <Card sx={{ mt:2, p: 2, display: 'flex', justifyContent:'space-between', alignItems: 'center' }}>
            <Typography sx={{mr:2, color:'#6D6976' }} >
            Start from scratch and design from a blank canvas
            </Typography>
          <Button variant="contained" sx={{backgroundColor:'#0057D9'}}  onClick={() => navigate('/build-template')}>
            Start From Scratch
          </Button>
        </Card>

        <Grid container spacing={3} mt={2}>
          {templates
        //   .filter((template)=>template.type === 'Email')
          .map((template: any) => (
            <Grid size={{xs:12, sm:6, md:3 }} key={template._id}>
              <Card>
              <Typography variant="h6">{template.name}</Typography>
              
                <Box sx={{ width: '100%', maxHeight: '60vh', overflow: 'auto' }}>
                {template.html &&

                    <Box
                    sx={{ width: '300px', height: '300px', overflow: 'auto', p: 2, m: 2 }}
                    dangerouslySetInnerHTML={{ __html: decodeHTML(template.html) }}
                    />
                }
                </Box>
        
                    {template.content && template.content['root'] ? (
                        <Reader document={template.content} rootBlockId="root" />
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                        — Invalid or Missing Document —
                        </Typography>
                    )}

                {/* <CardMedia
                  component="img"
                  height="240"
                //   image={template.image}
                  alt={template.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    {template.name}
                  </Typography>
                </CardContent> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

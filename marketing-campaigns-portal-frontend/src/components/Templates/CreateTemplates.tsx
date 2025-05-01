import 
// React,
 { useState, useEffect } from 'react'
import ChooseTemplateModal from './ChooseTemplateModal'
import { Container, Box, Typography } from '@mui/material'
import {useNavigate } from 'react-router-dom';
import { Template } from '../../types/template'
// import type { Template } from "../../redux/slices/templateSlice";
// import {
//   getTemplates, getRecentlyUsedTemplates, toggleFavorite,
//   getFavoriteTemplates, setFilters, setActiveTab, getTemplateById,
//   clearSelectedTemplate, 
//   updateTemplate,
//   deleteTemplate, 
//   restoreTemplate,
//   duplicateTemplate,     
//   setAllTemplates,
//   setRecentTemplates,
//   setFavoriteTemplates,
// } from "../../redux/slices/templateSlice";
// import { RootState } from "../../redux/store";
// import { useDispatch, useSelector } from "react-redux";
import {
  Reader,
  // renderToStaticMarkup,
  TReaderDocument
} from '@usewaypoint/email-builder';
import {
  // setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
  setSelectedMainTab  ,
  useSetDocument ,
  // useHtmlCode,
  // Editor,
} from '../EditorSample/documents/editor/EditorContext';
// import { useEditorStore } from '../EditorSample/documents/editor/EditorContext';

// } from '../../documents/editor/EditorContext';
import SingleTemplatePreview from './SingleTemplatePreview'
import TemplatePanel from '../EditorSample/App/TemplatePanel';

interface Props {
  templateId: string;
}

const CreateTemplate = () => {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(true);
    const [selectedTemplateModal, setSelectedTemplateModal] = useState<"email" | "sms">("email");
    const [doc, setDoc]       = useState<TReaderDocument | null>(null);
    const [error, setError]     = useState<string | null>(null);

    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    
    // const dispatch = useDispatch();
    // const {
    //   allTemplates = [], recentTemplates = [], favoriteTemplates = [],
    //   filters, totalPages, activeTab, selectedTemplate,
    // } = useSelector((state: RootState) => state.template || {});

    // useEffect(() => {
    //   ;(async () => {
    //     try {
    //       const res = await fetch('http://localhost:4000/api/templates/67e287d859e378e619ce5b4b')
    //       const data: Template[] = await res.json()
    //       console.log('fetched templates:', data)
    //       setTemplates(data)
    //     } catch (e) {
    //       console.error('Error fetching templates list:', e)
    //     } finally {
    //       setLoading(false)
    //     }
    //   })()
    // }, [])

    // useEffect(() => {
    //   (async () => {
    //     try {
    //       const res = await fetch(
    //         `http://localhost:4000/api/templates/6812762818503d4a11e06196`
    //       );
    //       if (!res.ok) throw new Error(res.statusText);
    //       const tpl: Template = await res.json();
    //       console.log('fetched template:', tpl);
    //       setDoc(tpl.content);          // <-- your JSON lives on `content`
    //     } catch (e: any) {
    //       console.error('fetch failed:', e);
    //       setError(e.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   })();
    // }, []);

    
  const setDocument = useSetDocument();
  // const setMainTab = useEditorStore((state: any) => state.setSelectedMainTab);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'http://localhost:4000/api/templates/6813330018503d4a11e061b7'
        );
        if (!res.ok) throw new Error(res.statusText);
        const tpl: Template = await res.json();

        // parse if your API returns JSON as a string
        const doc =
          typeof tpl.content === 'string'
            ? JSON.parse(tpl.content)
            : tpl.content;

        // ① inject into your EditorContext
        setDocument(doc);

        // ② flip into preview mode
        setSelectedMainTab('preview');
      } catch (e: any) {
        console.error('fetch failed:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [setDocument]);

    //modal--------------------------
    const handleSelect = (template: "email" | "sms") => {
      setSelectedTemplateModal(template);
    };
    const navigate = useNavigate();
  
    const handleConfirm = () => {
      console.log("Confirmed template:", selectedTemplateModal);
      if(selectedTemplateModal === "email"){
        navigate('/build-template');
      }
      else if(selectedTemplateModal === "sms"){
        navigate('/build-sms');
      }
      else{
        console.log('Type Not Found');
      }
      setIsTemplateModalOpen(false);
    };
    console.log("template:", selectedTemplateModal);

    //add +++++++++++++++++++
    // if (loading) return <div>Loading…</div>
    // if (!templates.length) return <div>No templates found.</div>
    const document = useDocument();
  
    return (
      <>
      <Reader document={document} rootBlockId="root" />
      
      <ChooseTemplateModal open={isTemplateModalOpen} onClose={()=>setIsTemplateModalOpen(false)}
      selectedTemplate={selectedTemplateModal}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      />
      </>
      // <TemplatePanel />
                     

    )
  }

  //   return (
  //     <div style={{ display: 'grid', gap: '2rem' }}>
  //       {templates.map(tpl => {
  //         // pull out the JSON blob you stored in Mongo
  //         const doc = tpl.content
  
  //         // sanity‐check in console
  //         console.log('rendering preview for', tpl._id, doc)
  
  //         // generate raw HTML if you want the iframe preview
  //         const html = renderToStaticMarkup(doc, { rootBlockId: 'root' })
  
  //         return (
  //           <div key={tpl._id} style={{ border: '1px solid #ddd', padding: '1rem' }}>
  //             <h4>Preview: {tpl.name || tpl._id}</h4>
  
  //             {/* React-rendered preview */}
  //             <div style={{ marginBottom: '1rem' }}>
  //               <Reader document={doc} rootBlockId="root" />
  //             </div>
  
  //             {/* HTML preview */}
  //             <iframe
  //               title={`html-preview-${tpl._id}`}
  //               srcDoc={html}
  //               style={{ width: '100%', height: '200px', border: '1px solid #ccc' }}
  //             />
  //           </div>
  //         )
  //       })}
  //     </div>
  //   )
  // }


  //modal
//   return (
//     <Container>
//       <Box sx={{
//           p: 3, bgcolor: '#F8F9FE', maxWidth: '100%', overflow: 'hidden',
//           // '& *': { color: '#495057' }
//         }}>
        
//         <Box
//           display="flex"
//           flexDirection={{ xs: 'column', md: 'row' }}
//           justifyContent="space-between"
//           alignItems="center"
//           mb={3}
//         >
//           <Typography variant="h4" component="h1" marginBottom={{ xs: 1 }} >
//           Create Template
//           </Typography>
//           </Box>
//           </Box>

//     <ChooseTemplateModal open={isTemplateModalOpen} onClose={()=>setIsTemplateModalOpen(false)}
//       selectedTemplate={selectedTemplateModal}
//       onSelect={handleSelect}
//       onConfirm={handleConfirm}
//       />
//     </Container>
//   )
// }

export default CreateTemplate;
// src/components/SingleTemplatePreview.tsx
import React, { useState, useEffect } from 'react';
import { Reader, TReaderDocument } from '@usewaypoint/email-builder';

interface TemplateResp {
  _id: string;
  name: string;
  content: TReaderDocument;    // your Mongo field
}

export default function SingleTemplatePreview({
  templateId,
}: {
  templateId: string;
}) {
  const [doc, setDoc] = useState<TReaderDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/templates/${templateId}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<TemplateResp>;
      })
      .then((tpl) => {
        console.log('Fetched template:', tpl);
        setDoc(tpl.content);
      })
      .catch((e) => {
        console.error('Load failed:', e);
        setError(e.message);
      });
  }, [templateId]);

  if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!doc)    return <div>Loading…</div>;

  return (
    <div style={{ border: '1px solid #CCC', padding: 16 }}>
      <h3>Preview for {templateId}</h3>
      <Reader document={doc} rootBlockId="root" />
    </div>
  );
}


// // src/components/SingleTemplatePreview.tsx
// import React, { useState, useEffect } from 'react';
// import { Reader, TReaderDocument } from '@usewaypoint/email-builder';
// import type { Template } from '../../types/template'; // wherever you keep that interface
// import {
//   // setSelectedScreenSize,
//   useDocument,
//   // useSelectedMainTab,
//   // useSelectedScreenSize,
//   // useSetDocument ,
//   // useHtmlCode,
// } from '../EditorSample/documents/editor/EditorContext';
// interface Props {
//   templateId: string;
// }

// export default function SingleTemplatePreview({ templateId }: Props) {
//   const [doc, setDoc]       = useState<TReaderDocument | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState<string | null>(null);

//   const document = useDocument();

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:4000/api/templates/${templateId}`
//         );
//         if (!res.ok) throw new Error(res.statusText);
//         const tpl: Template = await res.json();
//         console.log('fetched template:', tpl);
//         setDoc(tpl.content);          // <-- your JSON lives on `content`
//       } catch (e: any) {
//         console.error('fetch failed:', e);
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [templateId]);

// //   if (loading) return <div>Loading template…</div>;
// //   if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;
// //   if (!doc)    return <div>No template found.</div>;

//   return (
//     <div style={{ border: '1px solid #ddd', padding: '1rem' }}>
//       <h3>Preview for {templateId}</h3>
//       <Reader document={document} rootBlockId="root" />
//     </div>
//   );
// }

import React,{useState, useEffect} from 'react';
import {
    Reader,
    // renderToStaticMarkup,
    TReaderDocument
  } from '@usewaypoint/email-builder';
  
export default function MyEmailEditor() {
  const [doc, setDoc] = useState<TReaderDocument|null>(null);

  useEffect(() => {

    const fetchTemplates = async () => {
        try {
            await fetch('http://localhost:4000/api/templates/6808e0b62c7b8d65707e2001')           // your endpoint that returns the JSON
            
            .then(res => res.json())
            .then(json => {
                console.log('fetched template JSON:', json);

                setDoc(json)});
            }
        catch(error){
            console.error('Error fetching templates:', error);
        }
    }
    fetchTemplates();
  }, []);

  
  if (!doc) return <div>Loading…</div>;

  return (
    <Reader document={doc} rootBlockId="root" />

  );
}

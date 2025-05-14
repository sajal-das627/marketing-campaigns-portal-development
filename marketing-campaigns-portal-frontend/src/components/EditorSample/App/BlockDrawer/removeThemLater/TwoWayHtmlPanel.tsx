// src/App/TemplatePanel/TwoWayHtmlPanel.tsx
import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
import { useDocument, setDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

interface TwoWayHtmlPanelProps {
  htmlBlockId: string;
  rootBlockId?: string;
}

export default function TwoWayHtmlPanel({
  htmlBlockId,
  rootBlockId = 'root',
}: TwoWayHtmlPanelProps) {
  const doc = useDocument();

  // initial HTML from your JSON document
  const [html, setHtml] = useState(() =>
    renderToStaticMarkup(doc, { rootBlockId })
  );

  // if you drag/drop or edit in the inspector, re-sync the editor
  useEffect(() => {
    setHtml(renderToStaticMarkup(doc, { rootBlockId }));
  }, [doc, rootBlockId]);

  const onChange = (newHtml: string) => {
    setHtml(newHtml);

    // pull out your one block and update its `.data.props.contents`
    const original = doc[htmlBlockId];
    const updated = {
      ...original,
      data: {
        ...original.data,
        // HtmlPropsSchema says `.data.props?.contents` is where your raw HTML lives :contentReference[oaicite:0]{index=0}
        props: {
          ...((original.data as any).props || {}),
          contents: newHtml,
        },
      },
    };

    // setDocument merges your object on top of the existing document :contentReference[oaicite:1]{index=1}
    // TS will complain because we’re only passing one key, so we cast to any
    setDocument({ [htmlBlockId]: updated } as any);
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <CodeMirror
        value={html}
        options={{ mode: 'xml', lineNumbers: true, lineWrapping: true }}
        onBeforeChange={(_editor, _data, value) => {
          onChange(value);
        }}
      />
      <div
        style={{
          flex: 1,
          padding: 12,
          borderLeft: '1px solid #ddd',
          overflow: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

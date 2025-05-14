
import { v4 as uuid } from 'uuid';
import type { TEditorBlock, TEditorConfiguration } from '../../../documents/editor/core';

/**
 * Parse a raw HTML string into the EmailBuilder block configuration.
 */
export function parseHtmlToDocument(html: string): TEditorConfiguration {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  // Convert each DOM node into a block tuple
  const tuples: Array<{ id: string; block: TEditorBlock }> = [];
  body.childNodes.forEach((node) => {
    const t = nodeToBlock(node);
    if (t) tuples.push(t);
  });

  // Build configuration map
  const config: TEditorConfiguration = {};
  tuples.forEach(({ id, block }) => {
    config[id] = block;
  });

  // Wrap blocks in a root EmailLayout
  const childIds = tuples.map(({ id }) => id);
  config['root'] = {
    type: 'EmailLayout',
    data: {
      // EmailLayout expects childrenIds directly
      childrenIds: childIds,
    },
  };

  return config;
}

/**
 * Convert a DOM node into a block tuple, or null if empty/unsupported.
 */
function nodeToBlock(node: ChildNode): { id: string; block: TEditorBlock } | null {
  // Text node → Text block
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (!text) return null;
    return {
      id: uuid(),
      block: { type: 'Text', data: { props: { text }, style: {} } },
    };
  }

  // Only handle element nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const id = uuid();

  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
      return {
        id,
        block: {
          type: 'Heading',
          data: { props: { text: el.textContent || '', level: tag as any }, style: {} },
        },
      };

    case 'p':
      return {
        id,
        block: {
          type: 'Text',
          data: { props: { text: el.textContent || '' }, style: {} },
        },
      };

    case 'img':
      return {
        id,
        block: {
          type: 'Image',
          data: { props: { url: (el as HTMLImageElement).src }, style: {} },
        },
      };

    case 'a':
      return {
        id,
        block: {
          type: 'Button',
          data: {
            props: { text: el.textContent || '', url: (el as HTMLAnchorElement).href },
            style: {},
          },
        },
      };

    case 'hr':
      return {
        id,
        block: { type: 'Divider', data: { props: {}, style: {} } },
      };

    default:
      // Fallback to raw HTML
      return {
        id,
        block: {
          type: 'Html',
          data: { props: { contents: el.outerHTML }, style: {} },
        },
      };
  }
}



///new
// import { v4 as uuid } from 'uuid';
// import type { TEditorBlock, TEditorConfiguration } from '../../documents/editor/core';

// /**
//  * Parse a raw HTML string into the EmailBuilder block configuration.
//  * Returns a mapping of block IDs to TEditorBlock.
//  */
// export default function parseHtmlToDocument(html: string): TEditorConfiguration {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, 'text/html');
//   const body = doc.body;

//   // Gather all parsed blocks
//   const tuples: Array<{ id: string; block: TEditorBlock }> = [];
//   body.childNodes.forEach((node) => {
//     const tuple = nodeToBlock(node);
//     if (tuple) tuples.push(tuple);
//   });

//   // Build configuration map
//   const config: TEditorConfiguration = {};
//   tuples.forEach(({ id, block }) => {
//     config[id] = block;
//   });

//   // Wrap in a root container pointing to all top-level blocks
//   const childIds = tuples.map(({ id }) => id);
//   config['root'] = {
//     type: 'Container',
//     data: {
//       props: { childrenIds: childIds },
//       style: {},
//     },
//   };

//   return config;
// }

// /**
//  * Convert a DOM node into a block tuple (id + block data), or null if unsupported/empty.
//  */
// function nodeToBlock(node: ChildNode): { id: string; block: TEditorBlock } | null {
//   const id = uuid();

//   // TEXT NODE
//   if (node.nodeType === Node.TEXT_NODE) {
//     const text = node.textContent?.trim();
//     if (!text) return null;
//     const block: TEditorBlock = {
//       type: 'Text',
//       data: { props: { text }, style: {} },
//     };
//     return { id, block };
//   }

//   // ELEMENT NODE
//   if (node.nodeType !== Node.ELEMENT_NODE) {
//     return null;
//   }
//   const el = node as HTMLElement;
//   const tag = el.tagName.toLowerCase();

//   switch (tag) {
//     case 'h1':
//     case 'h2':
//     case 'h3': {
//       const block: TEditorBlock = {
//         type: 'Heading',
//         data: {
//           props: { text: el.textContent || '', level: tag as any },
//           style: {},
//         },
//       };
//       return { id, block };
//     }
//     case 'p': {
//       const block: TEditorBlock = {
//         type: 'Text',
//         data: { props: { text: el.textContent || '' }, style: {} },
//       };
//       return { id, block };
//     }
//     case 'img': {
//       const img = el as HTMLImageElement;
//       const block: TEditorBlock = {
//         type: 'Image',
//         data: { props: { url: img.src }, style: {} },
//       };
//       return { id, block };
//     }
//     case 'a': {
//       const a = el as HTMLAnchorElement;
//       const block: TEditorBlock = {
//         type: 'Button',
//         data: {
//           props: { text: a.textContent || '', url: a.href },
//           style: {},
//         },
//       };
//       return { id, block };
//     }
//     case 'hr': {
//       const block: TEditorBlock = {
//         type: 'Divider',
//         data: { props: {}, style: {} },
//       };
//       return { id, block };
//     }
//     default: {
//       // Fallback to raw HTML block
//       const block: TEditorBlock = {
//         type: 'Html',
//         data: { props: { contents: el.outerHTML }, style: {} },
//       };
//       return { id, block };
//     }
//   }
// }





//old
// import { TEditorConfiguration } from '../../documents/editor/core';
// import { v4 as uuidv4 } from 'uuid';

// export function convertHtmlToDocument(html: string, baseDocument: TEditorConfiguration): TEditorConfiguration {
//   try {
//     // Use the browser's built-in parser
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');
    
//     // Clone the base document
//     const newDocument = JSON.parse(JSON.stringify(baseDocument)) as TEditorConfiguration;
    
//     // Process the DOM into blocks
//     if (doc.body) {
//       newDocument.blocks = processDomIntoBlocks(doc.body, newDocument.blocks);
//     }
    
//     return newDocument;
//   } catch (error) {
//     console.error('Error converting HTML to document:', error);
//     throw new Error(`HTML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

// function processDomIntoBlocks(domNode: HTMLElement, originalBlocks: any) {
//   // Create a copy of the original blocks
//   const blocks = JSON.parse(JSON.stringify(originalBlocks));
  
//   // Keep track of the root block's children
//   const rootChildren: string[] = [];
  
//   // Process each child of the body element
//   Array.from(domNode.children).forEach(child => {
//     processDomNode(child, blocks, rootChildren);
//   });
  
//   // Update the root block's children
//   if (blocks.root) {
//     blocks.root.children = rootChildren;
//   }
  
//   return blocks;
// }

// function processDomNode(node: Element, blocks: any, parentChildren: string[]) {
//   // Generate a unique ID for this block
//   const blockId = uuidv4();
  
//   // Map the HTML tag to a block type
//   const blockType = mapElementToBlockType(node);
  
//   // Create the block with the required structure
//   blocks[blockId] = {
//     type: blockType,
//     data: {
//       style: extractElementStyles(node),
//       props: extractElementProps(node),
//       content: node.textContent || ''
//     }
//     // Add other required properties based on your schema
//   };
  
//   // Add this block to its parent's children
//   parentChildren.push(blockId);
  
//   // Process child elements recursively
//   const childrenIds: string[] = [];
//   Array.from(node.children).forEach(child => {
//     processDomNode(child, blocks, childrenIds);
//   });
  
//   // Set this block's children array
//   if (blocks[blockId].children) {
//     blocks[blockId].children = childrenIds;
//   }
// }

// function mapElementToBlockType(element: Element): string {
//   // Map HTML elements to your block types
//   const tagName = element.tagName.toLowerCase();
  
//   const mapping: Record<string, string> = {
//     div: 'Container',
//     p: 'Paragraph',
//     h1: 'Heading',
//     h2: 'Heading',
//     h3: 'Heading',
//     h4: 'Heading',
//     h5: 'Heading',
//     h6: 'Heading',
//     img: 'Image',
//     a: 'Link',
//     button: 'Button',
//     table: 'Table',
//     ul: 'List',
//     ol: 'List',
//     li: 'ListItem',
//     span: 'Text',
//     hr: 'Divider',
//     // Add more mappings as needed
//   };
  
//   return mapping[tagName] || 'Container';
// }

// function extractElementStyles(element: Element): any {
//   const styles: any = {};
  
//   // Extract style attributes
//   if (element.hasAttribute('style')) {
//     const styleString = element.getAttribute('style') || '';
//     const styleObj = parseInlineStyle(styleString);
    
//     // Copy relevant style properties to match your schema
//     if (styleObj.backgroundColor) styles.backgroundColor = styleObj.backgroundColor;
//     if (styleObj.color) styles.color = styleObj.color;
//     if (styleObj.fontSize) styles.fontSize = styleObj.fontSize;
//     if (styleObj.fontWeight) styles.fontWeight = styleObj.fontWeight;
//     if (styleObj.textAlign) styles.textAlign = styleObj.textAlign;
    
//     // Handle padding
//     if (styleObj.padding || styleObj.paddingTop || styleObj.paddingBottom || 
//         styleObj.paddingLeft || styleObj.paddingRight) {
//       styles.padding = {
//         top: parseInt(styleObj.paddingTop || styleObj.padding || '0', 10) || 0,
//         bottom: parseInt(styleObj.paddingBottom || styleObj.padding || '0', 10) || 0,
//         left: parseInt(styleObj.paddingLeft || styleObj.padding || '0', 10) || 0,
//         right: parseInt(styleObj.paddingRight || styleObj.padding || '0', 10) || 0
//       };
//     }
//   }
  
//   // You can also extract styles from class names if needed
//   // ...
  
//   return styles;
// }

// function extractElementProps(element: Element): any {
//   const props: any = {};
  
//   // Extract relevant attributes to match your schema
//   if (element.hasAttribute('href')) props.href = element.getAttribute('href');
//   if (element.hasAttribute('src')) props.src = element.getAttribute('src');
//   if (element.hasAttribute('alt')) props.alt = element.getAttribute('alt');
//   if (element.hasAttribute('title')) props.title = element.getAttribute('title');
//   if (element.hasAttribute('target')) props.target = element.getAttribute('target');
//   // Add more property mappings as needed
  
//   return props;
// }

// function parseInlineStyle(styleString: string): any {
//   const styleObject: any = {};
  
//   if (!styleString) return styleObject;
  
//   const styles = styleString.split(';');
//   styles.forEach(style => {
//     const parts = style.split(':');
//     if (parts.length === 2) {
//       const property = parts[0].trim();
//       const value = parts[1].trim();
      
//       // Convert kebab-case to camelCase
//       const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
//       styleObject[camelProperty] = value;
//     }
//   });
  
//   return styleObject;
// }
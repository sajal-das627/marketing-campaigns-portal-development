import { TEditorConfiguration } from '../../../documents/editor/core';
import { v4 as uuidv4 } from 'uuid';

export function convertHtmlToDocument(html: string, baseDocument: TEditorConfiguration): TEditorConfiguration {
  try {
    console.log("Starting HTML conversion. Input HTML:", html.substring(0, 100) + "...");
    console.log("Base document:", baseDocument ? "Exists" : "Undefined");
    
    // Validate inputs
    if (!html) {
      throw new Error("HTML input is empty or undefined");
    }
    
    if (!baseDocument) {
      throw new Error("Base document is undefined");
    }
    
    // Use the browser's built-in parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Clone the base document safely
    let newDocument;
    try {
      // Check if baseDocument is a valid object that can be stringified
      if (typeof baseDocument !== 'object' || baseDocument === null) {
        throw new Error(`Base document is not a valid object: ${typeof baseDocument}`);
      }
      
      const baseDocumentString = JSON.stringify(baseDocument);
      console.log("Base document successfully stringified");
      
      newDocument = JSON.parse(baseDocumentString);
      console.log("Base document successfully parsed back");
    } catch (jsonError) {
      console.error("Error cloning base document:", jsonError);
      throw new Error(`Failed to clone base document: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
    }
    
    // Process the DOM into blocks
    if (doc.body) {
      console.log("Processing body with children:", doc.body.children.length);
      newDocument.blocks = processDomIntoBlocks(doc.body, newDocument.blocks);
    } else {
      console.warn("No body element found in parsed HTML");
    }
    
    console.log("HTML conversion completed successfully");
    return newDocument;
  } catch (error) {
    console.error('Error converting HTML to document:', error);
    throw new Error(`HTML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processDomIntoBlocks(domNode: HTMLElement, originalBlocks: any) {
  try {
    console.log("Starting to process DOM into blocks");
    
    // Check if originalBlocks exists
    if (!originalBlocks) {
      console.error("Original blocks is undefined");
      throw new Error("Original blocks is undefined");
    }
    
    // Create a safe copy of the original blocks
    let blocks: typeof originalBlocks;
    try {
      const blocksString = JSON.stringify(originalBlocks);
      blocks = JSON.parse(blocksString);
      console.log("Original blocks cloned successfully");
    } catch (jsonError) {
      console.error("Failed to clone blocks:", jsonError);
      throw new Error(`Blocks cloning failed: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
    }
    
    // Keep track of the root block's children
    const rootChildren: string[] = [];
    
    // Process each child of the body element
    console.log(`Processing ${domNode.children.length} children`);
    Array.from(domNode.children).forEach((child, index) => {
      console.log(`Processing child ${index}:`, child.tagName);
      processDomNode(child, blocks, rootChildren);
    });
    
    // Update the root block's children
    if (blocks.root) {
      blocks.root.children = rootChildren;
      console.log("Root children updated:", rootChildren.length);
    } else {
      console.warn("No root block found in blocks object");
    }
    
    return blocks;
  } catch (error) {
    console.error("Error in processDomIntoBlocks:", error);
    // Return the original blocks if processing fails
    return originalBlocks;
  }
}

function processDomNode(node: Element, blocks: any, parentChildren: string[]) {
  try {
    // Generate a unique ID for this block
    const blockId = uuidv4();
    console.log(`Creating block with ID ${blockId} for ${node.tagName}`);
    
    // Map the HTML tag to a block type
    const blockType = mapElementToBlockType(node);
    
    // Create the block with the required structure based on your schema
    blocks[blockId] = {
      type: blockType,
      data: {
        style: extractElementStyles(node),
        props: extractElementProps(node),
        content: extractTextContent(node)
      }
    };
    
    // Add this block to its parent's children
    parentChildren.push(blockId);
    
    // Process child elements recursively
    const childrenIds: string[] = [];
    Array.from(node.children).forEach((child, index) => {
      console.log(`Processing child ${index} of ${node.tagName}:`, child.tagName);
      processDomNode(child, blocks, childrenIds);
    });
    
    // Set this block's children array if the property exists in your schema
    if ('children' in blocks[blockId]) {
      blocks[blockId].children = childrenIds;
    }
  } catch (error) {
    console.error(`Error processing DOM node ${node.tagName}:`, error);
  }
}

function extractTextContent(element: Element): string {
  let text = '';
  try {
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      }
    });
    return text.trim();
  } catch (error) {
    console.error("Error extracting text content:", error);
    return '';
  }
}

function mapElementToBlockType(element: Element): string {
  try {
    // Map HTML elements to your block types
    const tagName = element.tagName.toLowerCase();
    
    const mapping: Record<string, string> = {
      div: 'Container',
      p: 'Paragraph',
      h1: 'Heading',
      h2: 'Heading',
      h3: 'Heading',
      h4: 'Heading',
      h5: 'Heading',
      h6: 'Heading',
      img: 'Image',
      a: 'Link',
      button: 'Button',
      table: 'Table',
      tr: 'TableRow',
      td: 'TableCell',
      th: 'TableHeader',
      ul: 'List',
      ol: 'List',
      li: 'ListItem',
      span: 'Text',
      hr: 'Divider',
      br: 'LineBreak',
      // Add more mappings as needed
    };
    
    return mapping[tagName] || 'Container';
  } catch (error) {
    console.error("Error mapping element to block type:", error);
    return 'Container'; // Default to Container on error
  }
}

function extractElementStyles(element: Element): any {
  try {
    const styles: any = {};
    
    // Extract style attributes
    if (element.hasAttribute('style')) {
      const styleString = element.getAttribute('style') || '';
      const styleObj = parseInlineStyle(styleString);
      
      // Copy relevant style properties
      if (styleObj.backgroundColor) styles.backgroundColor = styleObj.backgroundColor;
      if (styleObj.color) styles.color = styleObj.color;
      if (styleObj.fontSize) styles.fontSize = styleObj.fontSize;
      if (styleObj.fontWeight) styles.fontWeight = styleObj.fontWeight;
      if (styleObj.textAlign) styles.textAlign = styleObj.textAlign;
      
      // Handle padding
      if (styleObj.padding || styleObj.paddingTop || styleObj.paddingBottom || 
          styleObj.paddingLeft || styleObj.paddingRight) {
        styles.padding = {
          top: parseInt(styleObj.paddingTop || styleObj.padding || '0', 10) || 0,
          bottom: parseInt(styleObj.paddingBottom || styleObj.padding || '0', 10) || 0,
          left: parseInt(styleObj.paddingLeft || styleObj.padding || '0', 10) || 0,
          right: parseInt(styleObj.paddingRight || styleObj.padding || '0', 10) || 0
        };
      }
    }
    
    // Extract class names if relevant to your editor's styling system
    if (element.hasAttribute('class')) {
      styles.className = element.getAttribute('class');
    }
    
    return styles;
  } catch (error) {
    console.error("Error extracting element styles:", error);
    return {}; // Return empty styles on error
  }
}

function extractElementProps(element: Element): any {
  try {
    const props: any = {};
    
    // Extract relevant attributes
    if (element.hasAttribute('href')) props.href = element.getAttribute('href');
    if (element.hasAttribute('src')) props.src = element.getAttribute('src');
    if (element.hasAttribute('alt')) props.alt = element.getAttribute('alt');
    if (element.hasAttribute('title')) props.title = element.getAttribute('title');
    if (element.hasAttribute('target')) props.target = element.getAttribute('target');
    
    // Handle form elements
    if (element.tagName.toLowerCase() === 'input') {
      if (element.hasAttribute('type')) props.type = element.getAttribute('type');
      if (element.hasAttribute('placeholder')) props.placeholder = element.getAttribute('placeholder');
      if (element.hasAttribute('value')) props.value = element.getAttribute('value');
    }
    
    return props;
  } catch (error) {
    console.error("Error extracting element props:", error);
    return {}; // Return empty props on error
  }
}

function parseInlineStyle(styleString: string): any {
  try {
    const styleObject: any = {};
    
    if (!styleString) return styleObject;
    
    const styles = styleString.split(';');
    styles.forEach(style => {
      const parts = style.split(':');
      if (parts.length === 2) {
        const property = parts[0].trim();
        const value = parts[1].trim();
        
        // Convert kebab-case to camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styleObject[camelProperty] = value;
      }
    });
    
    return styleObject;
  } catch (error) {
    console.error("Error parsing inline style:", error);
    return {}; // Return empty style object on error
  }
}
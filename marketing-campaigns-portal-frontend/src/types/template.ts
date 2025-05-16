import { TReaderDocument } from "@usewaypoint/email-builder"
export interface Template {
    _id: string
    name: string
    subject?: string
    type: 'Email' | 'SMS' | 'Basic' | 'Designed' | 'Custom'
    category: 'Promotional' | 'Transactional' | 'Event Based' | 'Update' | 'Announcement' | 'Action' | 'Product' | 'Holiday' | ''
    tags?: string[]
    layout?: 'Single Column' | 'Two Column' | 'Custom'
    createdAt?: string
    lastModified?: string
    lastUsed?: string | null
    favorite?: boolean
    isDeleted?: boolean
    deletedAt?: string | null
    version?: number;
    includeOptOutText? : boolean;
    content : any;

  }
// export interface Template {
//     _id: string;
//     name: string;
//     type: string;
//     category: string;
//     lastModified: string;
//     isFavorite: boolean;
//     favorite?: boolean;
//     [key: string]: any;
//   }
  
  export interface TemplateQuery {
    search?: string;
    type?: string;
    category?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }
  
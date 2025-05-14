import { TReaderDocument } from "@usewaypoint/email-builder"
export interface Template {
    _id: string
    name: string
    subject?: string
    type: 'Email' | 'SMS' | 'Basic' | 'Designed' | 'Custom'
    category: 'Promotional' | 'Transactional' | 'Event Based' | 'Update' | 'Announcement' | 'Action' | 'Product' | 'Holiday'
    tags?: string[]
    layout: 'Single Column' | 'Two Column' | 'Custom'
    createdAt: string
    lastModified: string
    lastUsed?: string | null
    favorite: boolean
    isDeleted: boolean
    deletedAt?: string | null
    version: number
  
    // ← this is the JSON blob you need
    // content: TReaderDocument

    //remove below later
    // approved : boolean;
    // approvedBy: string;
    // approvedAt: string;
    senderId : string;
    campaign : string;
    includeOptOut : boolean;
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
  

// export interface Template {
//     name: string;
//     subject: string;
//     type: string;
//     category: string;
//     tags?: string;
//     layout?: string;

    // createdAt: date
    // lastModified
    // lastUsed
    // favorite
    // content: Object;
    // isDeleted
    // deletedAt
    // version
// }

// const TemplateSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     subject: { type: String, required: false },
//     type: { type: String, enum: ["Email", "SMS", "Basic", "Designed", "Custom"], required: true },
//     category: { type: String, enum: ["Promotional", "Transactional", "Event Based", "Update", "Announcement", "Action", "Product", "Holiday"], required: true },
//     tags: [{ type: String }],
//     layout: { type: String, enum: ["Single Column", "Two Column", "Custom"], required: true },
//     createdAt: { type: Date, default: Date.now },
//     lastModified: { type: Date, default: Date.now },
//     lastUsed: { type: Date, default: null },
//     favorite: { type: Boolean, default: false },
//     content: { type: Object, required: true }, // Stores template design data
  
//     isDeleted: { type: Boolean, default: false }, // ✅ New Field for Soft Delete
//     deletedAt: { type: Date, default: null }, // ✅ Timestamp for Deletion
  
//     // ✅ Add versioning field
//     version: { type: Number, default: 1 },
//   });


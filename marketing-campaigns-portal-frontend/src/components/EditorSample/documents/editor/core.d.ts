import { z } from 'zod';
export declare const EditorBlock: any;
export declare const EditorBlockSchema: any;
export declare const EditorConfigurationSchema: any;
export type TEditorBlock = z.infer<typeof EditorBlockSchema>;
export type TEditorConfiguration = Record<string, TEditorBlock>;
//# sourceMappingURL=core.d.ts.map
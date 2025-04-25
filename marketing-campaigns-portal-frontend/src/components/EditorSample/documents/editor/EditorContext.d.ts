import { TEditorConfiguration } from './core';
type TValue = {
    document: TEditorConfiguration;
    selectedBlockId: string | null;
    selectedSidebarTab: 'block-configuration' | 'styles';
    selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
    selectedScreenSize: 'desktop' | 'mobile';
    inspectorDrawerOpen: boolean;
    samplesDrawerOpen: boolean;
};
export declare function useDocument(): any;
export declare function useSelectedBlockId(): any;
export declare function useSelectedScreenSize(): any;
export declare function useSelectedMainTab(): any;
export declare function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']): any;
export declare function useSelectedSidebarTab(): any;
export declare function useInspectorDrawerOpen(): any;
export declare function useSamplesDrawerOpen(): any;
export declare function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']): any;
export declare function setSidebarTab(selectedSidebarTab: TValue['selectedSidebarTab']): any;
export declare function resetDocument(document: TValue['document']): any;
export declare function setDocument(document: TValue['document']): any;
export declare function toggleInspectorDrawerOpen(): any;
export declare function toggleSamplesDrawerOpen(): any;
export declare function setSelectedScreenSize(selectedScreenSize: TValue['selectedScreenSize']): any;
export {};
//# sourceMappingURL=EditorContext.d.ts.map
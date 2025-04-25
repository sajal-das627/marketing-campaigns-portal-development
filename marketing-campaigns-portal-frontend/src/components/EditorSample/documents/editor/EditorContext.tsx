//EditorContext.tsx
import { create } from 'zustand';
import getConfiguration from '../../getConfiguration';
import { TEditorConfiguration } from './core';

type SidebarTab = 'block-configuration' | 'styles';
type MainTab = 'editor' | 'preview' | 'json' | 'html';
type ScreenSize = 'desktop' | 'mobile';

interface EditorState {
  // History stacks
  past:    TEditorConfiguration[];
  document: TEditorConfiguration;
  future:  TEditorConfiguration[];

  // UI state
  selectedBlockId:      string | null;
  selectedSidebarTab:   SidebarTab;
  selectedMainTab:      MainTab;
  selectedScreenSize:   ScreenSize;
  inspectorDrawerOpen:  boolean;
  samplesDrawerOpen:    boolean;

    // Raw HTML override
  htmlCode: string;
  isHtmlManual: boolean;

  setHtmlCode: (h: string) => void;
  setHtmlCodeAuto: (h: string) => void;
  setHtmlCodeManual: (h: string) => void;
  // History actions
  setDocument: (patch: Partial<TEditorConfiguration>) => void;
  undo:        () => void;
  redo:        () => void;
  canUndo:     () => boolean;
  canRedo:     () => boolean;

  // UI actions
  setSelectedBlockId:    (id: string | null) => void;
  setSidebarTab:         (tab: SidebarTab) => void;
  setSelectedMainTab:    (tab: MainTab) => void;
  setSelectedScreenSize: (size: ScreenSize) => void;
  toggleInspectorDrawerOpen: () => void;
  toggleSamplesDrawerOpen:   () => void;
  resetDocument:         (doc: TEditorConfiguration) => void;
}

export const editorStateStore = create<EditorState>((set, get) => ({
  // Initial history
  past:    [],
  document: getConfiguration(window.location.hash) as TEditorConfiguration,
  future:  [],

  // Initial UI
  selectedBlockId:     null,
  selectedSidebarTab:  'styles',
  selectedMainTab:     'editor',
  selectedScreenSize:  'desktop',
  inspectorDrawerOpen: true,
  samplesDrawerOpen:   true,

  // initialize htmlCode
  htmlCode: '',
  isHtmlManual: false,

  // History-enabled setter
  setDocument: (patch) => {
    set((state) => {
      const prev = state.document;
      const next = { ...prev, ...patch } as TEditorConfiguration;
      return {
        past:    [...state.past, prev],
        document: next,
        future:  [],
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.past.length === 0) return {};
      const previous = state.past[state.past.length - 1];
      return {
        past:    state.past.slice(0, -1),
        document: previous,
        future:  [state.document, ...state.future],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return {};
      const [next, ...rest] = state.future;
      return {
        past:    [...state.past, state.document],
        document: next,
        future:  rest,
      };
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  // UI setters
  setSelectedBlockId: (selectedBlockId) => {
    const selectedSidebarTab: SidebarTab =
      selectedBlockId === null ? 'styles' : 'block-configuration';
    const opts: Partial<EditorState> = { selectedSidebarTab };
    if (selectedBlockId !== null) opts.inspectorDrawerOpen = true;
    set({ selectedBlockId, ...opts });
  },

  setSidebarTab: (selectedSidebarTab) => set({ selectedSidebarTab }),

  setSelectedMainTab: (selectedMainTab) => {
    // console.log('selectedMainTab: ', selectedMainTab);
    set({ selectedMainTab });
  },

  setSelectedScreenSize: (selectedScreenSize) => set({ selectedScreenSize }),

  toggleInspectorDrawerOpen: () =>
    set((state) => ({ inspectorDrawerOpen: !state.inspectorDrawerOpen })),

  toggleSamplesDrawerOpen: () =>
    set((state) => ({ samplesDrawerOpen: !state.samplesDrawerOpen })),

  resetDocument: (document) =>
    set({
      past:    [],
      future:  [],
      document,
      selectedSidebarTab: 'styles',
      selectedBlockId: null,
    }),
    
    setHtmlCode: (html) => set({ htmlCode: html }),
    
    setHtmlCodeAuto: (html) => set({ htmlCode: html, isHtmlManual: false }),
    setHtmlCodeManual: (html) => set({ htmlCode: html, isHtmlManual: true }),
}));

// Convenience hooks

export const useHtmlCode = () => editorStateStore((s) => s.htmlCode);
export const setHtmlCode = (html: string) => editorStateStore.getState().setHtmlCode(html);


export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function usePast() {
  return editorStateStore((s) => s.past);
}

export function useFuture() {
  return editorStateStore((s) => s.future);
}

export function useCanUndo() {
  return editorStateStore((s) => s.canUndo());
}

export function useCanRedo() {
  return editorStateStore((s) => s.canRedo());
}

export function useUndo() {
  return editorStateStore((s) => s.undo);
}

export function useRedo() {
  return editorStateStore((s) => s.redo);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen() {
  return editorStateStore((s) => s.samplesDrawerOpen);
}

export function setSelectedBlockId(id: string | null) {
  return editorStateStore.getState().setSelectedBlockId(id);
}

export function setSidebarTab(tab: SidebarTab) {
  return editorStateStore.getState().setSidebarTab(tab);
}

export function setSelectedMainTab(tab: MainTab) {
  return editorStateStore.getState().setSelectedMainTab(tab);
}

export function setSelectedScreenSize(size: ScreenSize) {
  return editorStateStore.getState().setSelectedScreenSize(size);
}

export function toggleInspectorDrawerOpen() {
  return editorStateStore.getState().toggleInspectorDrawerOpen();
}

export function toggleSamplesDrawerOpen() {
  return editorStateStore.getState().toggleSamplesDrawerOpen();
}

export function resetDocument(doc: TEditorConfiguration) {
  return editorStateStore.getState().resetDocument(doc);
}

export function setDocument(patch: Partial<TEditorConfiguration>) {
  return editorStateStore.getState().setDocument(patch);
}

export const useIsHtmlManual = () => editorStateStore((s) => s.isHtmlManual);
export const setHtmlCodeManual = (html: string) => editorStateStore.getState().setHtmlCodeManual(html);
export const setHtmlCodeAuto = (html: string) => editorStateStore.getState().setHtmlCodeAuto(html);

export const useSetDocument = () =>
  editorStateStore((s) => s.setDocument);
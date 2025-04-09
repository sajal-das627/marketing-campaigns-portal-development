export interface DeleteModalProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
    title?: string;
    message?: string;
    btntxt?: string;
    icon?: DynamicIconProps;
    color?: string;
  }
  
  export interface DynamicIconProps {
    type: 'delete' | 'success' | 'error' | 'cancel';
    // Optional
    sx?: object;
  }
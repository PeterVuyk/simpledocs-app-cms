import { ReactNode } from 'react';

export interface MenuListDialog {
  dialogTitle: string;
  dialogContent: (key: string) => ReactNode;
  closeButtonText?: string;
  onSubmit?: (key: string) => string;
  submitButtonText?: string;
}

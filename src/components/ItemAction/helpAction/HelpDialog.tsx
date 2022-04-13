import React, { FC, ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogTransition from '../../dialog/DialogTransition';

interface Props {
  dialogTitle: string;
  children: ReactNode;
  openDialog: boolean;
  setOpenDialog: (showDialog: boolean) => void;
  dialogCharCount: number;
}

const HelpDialog: FC<Props> = ({
  dialogTitle,
  children,
  openDialog,
  setOpenDialog,
  dialogCharCount,
}) => {
  const handleClose = () => {
    setOpenDialog(false);
  };

  const getDialogWidth = (): 'sm' | 'md' => {
    if (dialogCharCount < 900) {
      return 'sm';
    }
    return 'md';
  };

  return (
    <Dialog
      maxWidth={getDialogWidth()}
      open={openDialog}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog;

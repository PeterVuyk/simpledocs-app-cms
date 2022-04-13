import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuListDialog } from './model/MenuListDialog';
import AlertBox from '../AlertBox';
import DialogTransition from '../dialog/DialogTransition';

interface Props {
  dialog: string;
  menuListDialog: MenuListDialog;
  onClose: () => void;
}

const MenuDialog: FC<Props> = ({ dialog, onClose, menuListDialog }) => {
  const [error, setError] = useState('');
  const handleSubmit = () => {
    if (!menuListDialog.onSubmit) {
      return;
    }
    const result = menuListDialog.onSubmit(dialog);
    if (result === '') {
      onClose();
    } else {
      setError(result);
    }
  };

  return (
    <Dialog
      open={dialog !== null}
      TransitionComponent={DialogTransition}
      keepMounted
      maxWidth="lg"
      onClose={onClose}
    >
      <DialogTitle id="alert-dialog-slide-title">
        {menuListDialog.dialogTitle}
      </DialogTitle>
      <DialogContent>
        {error && <AlertBox severity="error" message={error} />}
        {menuListDialog.dialogContent(dialog)}
      </DialogContent>
      <DialogActions>
        {menuListDialog.closeButtonText && (
          <Button onClick={onClose} color="primary" variant="contained">
            {menuListDialog.closeButtonText}
          </Button>
        )}
        {menuListDialog.submitButtonText && menuListDialog.onSubmit && (
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            {menuListDialog.submitButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MenuDialog;

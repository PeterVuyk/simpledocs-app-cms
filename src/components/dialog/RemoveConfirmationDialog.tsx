import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogTransition from './DialogTransition';

interface Props {
  dialogTitle: string;
  dialogText: string;
  openDialog: string;
  setOpenDialog: (openDialog: string) => void;
  onSubmit: (id: string) => void;
  onClose: () => void;
}

const RemoveConfirmationDialog: FC<Props> = ({
  dialogTitle,
  dialogText,
  openDialog,
  setOpenDialog,
  onSubmit,
  onClose,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const handleClose = () => {
    onClose();
    setOpenDialog('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(openDialog);
    setSubmitting(false);
    setOpenDialog('');
  };

  return (
    <Dialog
      open={openDialog !== null}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => !submitting && handleClose()}
    >
      <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={submitting}
          onClick={handleClose}
          color="primary"
          variant="contained"
        >
          Nee
        </Button>
        <Button
          disabled={submitting}
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
        >
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveConfirmationDialog;

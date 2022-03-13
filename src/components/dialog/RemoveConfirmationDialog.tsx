import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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

import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AlertBox from '../AlertBox';
import DialogTransition from './DialogTransition';

interface Props {
  dialogTitle: string;
  dialogText: string;
  openDialog: boolean;
  setOpenDialog: (showDialog: boolean) => void;
  onSubmit: (itemId: string) => Promise<void>;
  itemId?: string;
}

const ConfirmationDialog: FC<Props> = ({
  dialogTitle,
  dialogText,
  openDialog,
  setOpenDialog,
  onSubmit,
  itemId,
}) => {
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    onSubmit(itemId ?? '')
      .then(handleClose)
      .then(() => setLoading(false));
  };

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => !loading && handleClose()}
    >
      <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        {loading && <AlertBox severity="info" message="Een moment geduld..." />}
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Nee
        </Button>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          disabled={loading}
        >
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

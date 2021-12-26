import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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

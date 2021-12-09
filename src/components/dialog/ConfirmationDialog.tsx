import React, { FC, forwardRef, ReactElement, Ref, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import AlertBox from '../AlertBox';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      onClose={() => !loading && handleClose()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
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

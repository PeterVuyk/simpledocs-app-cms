import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import { Regulation } from '../../firebase/database/regulationRepository';

const Transition = React.forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  dialogTitle: string;
  dialogText: string;
  openDialog: Regulation | null;
  setOpenDialog: (regulation: Regulation | null) => void;
  onSubmit: (id: string) => void;
}

const RegulationDialog: React.FC<Props> = ({
  dialogTitle,
  dialogText,
  openDialog,
  setOpenDialog,
  onSubmit,
}) => {
  const handleClose = () => {
    setOpenDialog(null);
  };

  const handleSubmit = () => {
    onSubmit(openDialog?.id ?? '');
    setOpenDialog(null);
  };

  return (
    <div>
      <Dialog
        open={openDialog !== null}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
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
          <Button onClick={handleClose} color="primary" variant="contained">
            Nee
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegulationDialog;

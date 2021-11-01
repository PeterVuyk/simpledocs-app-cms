import React, { FC, forwardRef, ReactElement, ReactNode, Ref } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    if (dialogCharCount < 1000) {
      return 'sm';
    }
    return 'md';
  };

  return (
    <Dialog
      maxWidth={getDialogWidth()}
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
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

import React, { FC, forwardRef, ReactElement, Ref, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import Alert from '@material-ui/lab/Alert';
import { MenuListDialog } from './model/MenuListDialog';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {menuListDialog.dialogTitle}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
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

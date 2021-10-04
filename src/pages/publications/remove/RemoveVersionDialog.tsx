import React, { FC, forwardRef, ReactElement, Ref } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import { connect } from 'react-redux';
import { Versioning } from '../../../model/Versioning';
import logger from '../../../helper/logger';
import { NotificationOptions } from '../../../model/NotificationOptions';
import notification from '../../../redux/actions/notification';
import publishRepository from '../../../firebase/database/publishRepository';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  removeDialog: Versioning;
  setRemoveDialog: (removeDialog: Versioning | null) => void;
  onReloadPublications: () => void;
  onClose: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
  bookTitle: string;
}

const RemoveVersionDialog: FC<Props> = ({
  removeDialog,
  setRemoveDialog,
  setNotification,
  onReloadPublications,
  onClose,
  bookTitle,
}) => {
  const handleClose = () => {
    setRemoveDialog(null);
    onClose();
  };

  const handleSubmit = () => {
    publishRepository
      .removeVersion(removeDialog)
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'De versie is verwijderd.',
        })
      )
      .then(() => {
        handleClose();
        onReloadPublications();
      })
      .catch((error) => {
        logger.errorWithReason(
          `failed to remove version from publications handleSubmit for aggregate ${removeDialog.aggregate}`,
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het verwijderen van de versie is mislukt.`,
        });
      });
  };

  return (
    <Dialog
      open={removeDialog !== null}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Boek versie verwijderen
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {`Weet je zeker dat je het boek '${bookTitle}' met bookType identifier '${removeDialog.aggregate}' wilt verwijderen?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Annuleren
        </Button>
        <Button onClick={handleSubmit} color="secondary" variant="contained">
          Verwijderen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveVersionDialog);

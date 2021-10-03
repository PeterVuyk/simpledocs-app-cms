import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
  useRef,
  useState,
} from 'react';
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
import { TextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@material-ui/core';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import publishRepository from '../../firebase/database/publishRepository';
import { NotificationOptions } from '../../model/NotificationOptions';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
  onReloadPublications: () => void;
}

const PublishDialog: FC<Props> = ({
  openDialog,
  setOpenDialog,
  setNotification,
  onReloadPublications,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const versionRef = useRef<TextFieldProps>();

  const handleClose = () => {
    setOpenDialog(false);
  };

  const getNextVersion = useCallback((): string => {
    if (!openDialog) {
      setOpenDialog(false);
      return '';
    }
    const currentDate = new Date();
    return `${currentDate.getFullYear()}.${currentDate.getMonth() + 1}.1`;
  }, [openDialog, setOpenDialog]);

  const handleSubmit = () => {
    publishRepository
      .addVersion({
        version: getNextVersion(),
        aggregate: 'bla',
        status: 'published',
        //  TODO: Remove 'published' statuses
      })
      .then(() => {
        setLoading(false);
        setOpenDialog(false);
        onReloadPublications();
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'De nieuwe versie is toegevoegd',
        });
      })
      .catch(() => {
        logger.error('handleSubmit CreateVersionDialog failed');
        setError('Het updaten van de versie is mislukt');
        setLoading(false);
      });
  };

  return (
    <Dialog
      open={openDialog !== null}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Nieuwe versie toevoegen
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          Geef een bookType op, deze is te vinden in de app en cms configuratie:
        </DialogContentText>
        <TextField
          inputRef={versionRef}
          variant="outlined"
          margin="normal"
          error={error !== ''}
          helperText={error}
          required
          fullWidth
          id="version"
          label="booktype"
          name="version"
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Annuleren
        </Button>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          disabled={loading}
        >
          Toevoegen
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

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog);

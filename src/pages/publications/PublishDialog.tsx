import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import versioningRepository, {
  Versioning,
} from '../../firebase/database/versioningRepository';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';

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
  openDialog: Versioning | null;
  setOpenDialog: (versioning: Versioning | null) => void;
  onSubmit: (id: string) => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const PublishDialog: React.FC<Props> = ({
  dialogTitle,
  dialogText,
  openDialog,
  setOpenDialog,
  onSubmit,
  setNotification,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const versionRef = useRef<TextFieldProps>();
  const handleClose = () => {
    setOpenDialog(null);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (
      versionRef.current?.value === undefined ||
      versionRef.current.value === ''
    ) {
      setError('Geef een valide versie op van tenminste 8 karakters.');
      setLoading(false);
      return;
    }

    versioningRepository
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .updateVersion(openDialog, versionRef.current.value)
      .then(() => {
        onSubmit(openDialog?.aggregate ?? '');
        setLoading(false);
        setOpenDialog(null);
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `${openDialog?.aggregate} is gepubliceerd.`,
        });
      })
      .catch(() => {
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
      <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {dialogText}
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
          label="Nieuwe versie"
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
          Publiceren
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

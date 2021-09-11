import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
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
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import publishRepository from '../../firebase/database/publishRepository';
import { Versioning } from '../../model/Versioning';
import { NotificationOptions } from '../../model/NotificationOptions';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  onTranslation: (aggregate: string) => string;
  dialogTitle: string;
  dialogText: string;
  openDialog: Versioning | null;
  setOpenDialog: (versioning: Versioning | null) => void;
  onSubmit: (id: string) => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const PublishDialog: FC<Props> = ({
  onTranslation,
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

    publishRepository
      // @ts-ignore
      .updateVersion(openDialog, versionRef.current.value)
      .then(() => {
        onSubmit(openDialog?.aggregate ?? '');
        setLoading(false);
        setOpenDialog(null);
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `${onTranslation(
            openDialog?.aggregate ?? ''
          )} is gepubliceerd.`,
        });
      })
      .catch(() => {
        logger.error('Update version in PublishDialog.handleSubmit failed');
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

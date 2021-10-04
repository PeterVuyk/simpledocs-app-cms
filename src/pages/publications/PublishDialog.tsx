import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
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
import Alert from '@material-ui/lab/Alert';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import publishRepository from '../../firebase/database/publishRepository';
import { Versioning } from '../../model/Versioning';
import { NotificationOptions } from '../../model/NotificationOptions';
import useConfiguration from '../../configuration/useConfiguration';
import { AGGREGATE_CMS_CONFIGURATIONS } from '../../model/Aggregate';

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
  const { configuration } = useConfiguration();
  const handleClose = () => {
    setOpenDialog(null);
  };

  const getNextVersion = useCallback((): string => {
    if (!openDialog) {
      setOpenDialog(null);
      return '';
    }
    const currentDate = new Date();
    const monthLastRelease = parseInt(openDialog.version.split('.')[1], 10);
    const nextVersion = parseInt(openDialog.version.split('.')[2], 10) + 1;
    const releaseVersion =
      monthLastRelease === currentDate.getMonth() + 1 ? nextVersion : 1;
    return `${currentDate.getFullYear()}.${
      currentDate.getMonth() + 1
    }.${releaseVersion}`;
  }, [openDialog, setOpenDialog]);

  const handleSubmit = () => {
    setLoading(true);
    publishRepository
      // @ts-ignore
      .updateVersion(configuration, openDialog, getNextVersion())
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
      .then(() => {
        // If the cms configuration is updated, then we need to reload the page so the updated configuration can be reloaded.
        if (openDialog?.aggregate === AGGREGATE_CMS_CONFIGURATIONS) {
          window.location.reload();
        }
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
        {error && (
          <>
            <Alert severity="error">{error}</Alert>
            <br />
          </>
        )}
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          Weet je zeker dat je deze versie wilt updaten?
          <br />
          {dialogText} {getNextVersion()}.
        </DialogContentText>
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

import React, { FC, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import logger from '../../helper/logger';
import publishRepository from '../../firebase/database/publishRepository';
import { Versioning } from '../../model/Versioning';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import {
  AGGREGATE_APP_CONFIGURATIONS,
  AGGREGATE_CMS_CONFIGURATIONS,
} from '../../model/Aggregate';
import AlertBox from '../../components/AlertBox';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DialogTransition from '../../components/dialog/DialogTransition';

interface Props {
  onTranslation: (aggregate: string) => string;
  dialogTitle: string;
  dialogText: string;
  openDialog: Versioning | null;
  setOpenDialog: (versioning: Versioning | null) => void;
  onSubmit: (id: string) => void;
}

const PublishDialog: FC<Props> = ({
  onTranslation,
  dialogTitle,
  dialogText,
  openDialog,
  setOpenDialog,
  onSubmit,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { configuration } = useCmsConfiguration();
  const dispatch = useAppDispatch();

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
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `${onTranslation(
              openDialog?.aggregate ?? ''
            )} is gepubliceerd.`,
          })
        );
      })
      .then(() => {
        // If the cms configuration is updated, then we need to reload the page so the updated configuration can be reloaded.
        if (
          openDialog?.aggregate === AGGREGATE_CMS_CONFIGURATIONS ||
          openDialog?.aggregate === AGGREGATE_APP_CONFIGURATIONS
        ) {
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
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        {error && <AlertBox severity="error" message={error} />}
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
          Terug
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

export default PublishDialog;

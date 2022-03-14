import React, { FC, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MenuItem, TextField } from '@material-ui/core';
import logger from '../../helper/logger';
import publishRepository from '../../firebase/database/publishRepository';
import {
  UPDATE_ON_STARTUP,
  UPDATE_ON_STARTUP_READY,
  UpdateMoment,
  Versioning,
} from '../../model/Versioning';
import {
  AGGREGATE_APP_CONFIGURATIONS,
  AGGREGATE_CALCULATIONS,
  AGGREGATE_CMS_CONFIGURATIONS,
  AGGREGATE_DECISION_TREE,
} from '../../model/Aggregate';
import AlertBox from '../../components/AlertBox';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DialogTransition from '../../components/dialog/DialogTransition';
import useAppConfiguration from '../../configuration/useAppConfiguration';

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
  const [updateMoment, setUpdateMoment] = useState<UpdateMoment>(
    openDialog?.updateMoment ?? UPDATE_ON_STARTUP_READY
  );
  const { configuration } = useAppConfiguration();
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

  const showUpdateMomentSelect = () =>
    !openDialog?.isDraft &&
    ![
      AGGREGATE_APP_CONFIGURATIONS,
      AGGREGATE_CMS_CONFIGURATIONS,
      AGGREGATE_CALCULATIONS,
      AGGREGATE_DECISION_TREE,
    ].includes(openDialog?.aggregate ?? '');

  const getVersioning = () => {
    if (
      [
        AGGREGATE_APP_CONFIGURATIONS,
        AGGREGATE_CMS_CONFIGURATIONS,
        AGGREGATE_CALCULATIONS,
        AGGREGATE_DECISION_TREE,
      ].includes(openDialog?.aggregate ?? '')
    ) {
      return openDialog;
    }
    return {
      ...openDialog,
      updateMoment: openDialog?.isDraft ? UPDATE_ON_STARTUP : updateMoment,
    } as Versioning;
  };

  const handleSubmit = () => {
    setLoading(true);
    publishRepository
      // @ts-ignore
      .updateVersion(configuration, getVersioning(), getNextVersion())
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
        // Maybe later find a way to find a alternative.
        if (
          openDialog?.aggregate === AGGREGATE_CMS_CONFIGURATIONS ||
          openDialog?.aggregate === AGGREGATE_CALCULATIONS ||
          openDialog?.aggregate === AGGREGATE_DECISION_TREE ||
          openDialog?.aggregate === AGGREGATE_APP_CONFIGURATIONS
        ) {
          window.location.reload();
        }
      })
      .catch((reason) => {
        logger.errorWithReason(
          'Update version in PublishDialog.handleSubmit failed',
          reason
        );
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
          {openDialog?.isDraft &&
            "\n\nHet boek is nog in concept. De gepubliceerde pagina's worden in de app weergegeven zodra het boek gepubliceerd is. Dit kan via boeken beheer."}
          {[AGGREGATE_DECISION_TREE, AGGREGATE_CALCULATIONS].includes(
            openDialog?.aggregate ?? ''
          ) &&
            '\n\nLet op: Na het publiceren dien je indien gewenst ook de boeken te publiceren die van dit aangepaste onderdeel gebruik maken.'}
        </DialogContentText>
        {showUpdateMomentSelect() && (
          <TextField
            margin="normal"
            label="Update moment"
            fullWidth
            variant="outlined"
            select
            value={updateMoment}
            onChange={(event) =>
              setUpdateMoment(event.target.value as UpdateMoment)
            }
          >
            <MenuItem key={UPDATE_ON_STARTUP} value={UPDATE_ON_STARTUP}>
              Voor het opstarten
            </MenuItem>
            <MenuItem
              key={UPDATE_ON_STARTUP_READY}
              value={UPDATE_ON_STARTUP_READY}
            >
              Na het opstarten
            </MenuItem>
          </TextField>
        )}
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

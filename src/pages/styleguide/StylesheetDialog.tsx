import React, { FC, useCallback, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Highlight from 'react-highlight';
import FileDropzoneArea from '../../components/form/FileDropzoneArea';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import logger from '../../helper/logger';
import base64Helper from '../../helper/base64Helper';
import stylesheetHelper from '../../helper/stylesheetHelper';
import AlertBox from '../../components/AlertBox';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DialogTransition from '../../components/dialog/DialogTransition';
import { CONTENT_TYPE_CSS } from '../../model/ContentType';
import { Artifact } from '../../model/artifacts/Artifact';
// eslint-disable-next-line import/no-relative-packages
import '../../../node_modules/highlight.js/styles/a11y-dark.css';

interface Props {
  openStylesheetDialog: Artifact;
  oncloseDialog: () => void;
}

const StylesheetDialog: FC<Props> = ({
  openStylesheetDialog,
  oncloseDialog,
}) => {
  const [cssInput, setCSSInput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleUpdateFileFromBase64 = useCallback((file: string | null) => {
    setCSSInput(
      stylesheetHelper.makeCssStylesheetPretty(
        file ? base64Helper.getBodyFromBase64(file, CONTENT_TYPE_CSS) : ''
      )
    );
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    if (cssInput === null || cssInput === '') {
      setError('Het css bestand ontbreekt, deze is verplicht om te uploaden.');
      setLoading(false);
      return;
    }
    const updatedArtifact = openStylesheetDialog;
    updatedArtifact.content = cssInput;
    artifactsRepository
      .updateArtifact(updatedArtifact)
      .then(() => setLoading(false))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De stylesheet is gewijzigd.',
          })
        )
      )
      .then(oncloseDialog)
      .catch((reason) => {
        logger.errorWithReason(`Failed updating the css stylesheet`, reason);
        setError(
          'Het opslaan van de css stylesheet is mislukt, neem contact op met de beheerder.'
        );
      });
    setLoading(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={cssInput !== null}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={oncloseDialog}
    >
      <DialogTitle id="alert-dialog-slide-title">
        {openStylesheetDialog.title}
      </DialogTitle>
      <DialogContent>
        <div>
          {error && <AlertBox severity="error" message={error} />}
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item sm={8}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                CSS:
              </DialogContentText>
              <div style={{ width: '100%', marginBottom: -10 }}>
                {cssInput && <Highlight className="css">{cssInput}</Highlight>}
              </div>
            </Grid>
            <Grid item sm={4}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                Upload:
              </DialogContentText>
              <FileDropzoneArea
                allowedMimeTypes={['text/css']}
                allowedExtension="css"
                onUpdateFile={handleUpdateFileFromBase64}
                initialFile={base64Helper.getBase64FromFile(
                  openStylesheetDialog.content,
                  CONTENT_TYPE_CSS
                )}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={oncloseDialog} color="primary" variant="contained">
          Terug
        </Button>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          disabled={loading}
        >
          Stylesheet wijzigen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StylesheetDialog;

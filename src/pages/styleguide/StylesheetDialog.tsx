import React, { FC, useCallback, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Highlight from 'react-highlight';
import { makeStyles } from '@material-ui/core/styles';
import '../../../node_modules/highlight.js/styles/a11y-dark.css';
import FileDropzoneArea from '../../components/form/FileDropzoneArea';
import { Artifact, CONTENT_TYPE_CSS } from '../../model/artifacts/Artifact';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import logger from '../../helper/logger';
import base64Helper from '../../helper/base64Helper';
import stylesheetHelper from '../../helper/stylesheetHelper';
import AlertBox from '../../components/AlertBox';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DialogTransition from '../../components/dialog/DialogTransition';

const useStyles = makeStyles(() => ({
  highLightContainer: {
    width: '100%',
    marginBottom: -10,
  },
}));

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
  const classes = useStyles();
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
              <div className={classes.highLightContainer}>
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

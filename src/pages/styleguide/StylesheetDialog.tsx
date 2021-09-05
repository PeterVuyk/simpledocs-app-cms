import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
  useState,
} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import Highlight from 'react-highlight';
import { makeStyles } from '@material-ui/core/styles';
import '../../../node_modules/highlight.js/styles/a11y-dark.css';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import CopyToClipboardAction from '../../components/CopyToClipboardAction';
import FileDropzoneArea from '../../components/form/FileDropzoneArea';
import { Artifact } from '../../model/Artifact';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import { NotificationOptions } from '../../model/NotificationOptions';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import base64Helper from '../../helper/base64Helper';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 700,
    width: 375,
  },
  highLightContainer: {
    width: '100%',
    marginBottom: -10,
  },
  relativeContainer: {
    position: 'relative',
  },
  iframe: {
    border: 'none',
    width: 375,
    height: 700,
  },
}));

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  openStylesheetDialog: Artifact;
  oncloseDialog: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const StylesheetDialog: FC<Props> = ({
  openStylesheetDialog,
  oncloseDialog,
  setNotification,
}) => {
  const [cssInput, setCSSInput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const classes = useStyles();

  const handleUpdateFileFromBase64 = useCallback((file: string | null) => {
    setCSSInput(file ? base64Helper.getBodyFromBase64(file, 'css') : '');
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    if (cssInput === null || cssInput === '') {
      setError('Het css bestand ontbreekt, deze is verplicht om te uploaden.');
      setLoading(false);
      return;
    }
    const updatedArtifact = openStylesheetDialog;
    updatedArtifact.file = cssInput;
    artifactsRepository
      .updateArtifact(updatedArtifact)
      .then(() => setLoading(false))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'De stylesheet is gewijzigd.',
        })
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
      TransitionComponent={Transition}
      keepMounted
      onClose={oncloseDialog}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        <div className={classes.relativeContainer}>
          <CopyToClipboardAction textToCopy={cssInput!} />
        </div>
        {openStylesheetDialog.title}
      </DialogTitle>
      <DialogContent>
        <div>
          {error && (
            <Alert
              style={{ whiteSpace: 'pre-line', marginBottom: 8 }}
              severity="error"
            >
              {error}
            </Alert>
          )}
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item sm={8}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                CSS:
              </DialogContentText>
              <div className="highLightContainer">
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
                  openStylesheetDialog.file,
                  'css'
                )}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={oncloseDialog} color="primary" variant="contained">
          Annuleren
        </Button>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          disabled={loading}
        >
          Beslisboom uploaden
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

export default connect(mapStateToProps, mapDispatchToProps)(StylesheetDialog);

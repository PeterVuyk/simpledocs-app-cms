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
import { connect } from 'react-redux';
import Papa from 'papaparse';
import notification, {
  NotificationOptions,
} from '../../../redux/actions/notification';
import DecisionTreeDropzoneArea from './DecisionTreeDropzoneArea';
import ErrorTextTypography from '../../../components/text/ErrorTextTypography';
import decisionTreeRepository, {
  DecisionTreeStep,
} from '../../../firebase/database/decisionTreeRepository';

const Transition = React.forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  dialogText: string;
  setOpenUploadDialog: (openUploadDialog: boolean) => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
  loadDecisionTreeHandle: () => void;
}

const UploadDecisionTreeDialog: React.FC<Props> = ({
  dialogText,
  setOpenUploadDialog,
  setNotification,
  loadDecisionTreeHandle,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef<string>('');

  const readDecisionTreeCSVFile = (csvFile: string): DecisionTreeStep[] => {
    const base64String = csvFile.split('data:text/csv;base64,')[1];
    const csv = Papa.parse(atob(base64String), {
      header: true,
      dynamicTyping: true,
    });
    return (
      csv.data
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .filter((step) => step.id !== null)
        .map((step) => step as DecisionTreeStep)
    );
  };

  const handleClose = () => {
    setOpenUploadDialog(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (uploadRef.current === undefined || uploadRef.current === '') {
      setError('Opslaan is mislukt, upload een correct bestand.');
      setLoading(false);
      return;
    }
    decisionTreeRepository
      .updateDecisionTreeSteps(readDecisionTreeCSVFile(uploadRef.current))
      .then(() => {
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'beslisboom is gepubliceerd.',
        });
        setOpenUploadDialog(false);
        loadDecisionTreeHandle();
      })
      .catch(() => {
        setError('Het updaten van de beslisboom is mislukt');
        setLoading(false);
      });
  };

  return (
    <Dialog
      open
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Upload beslisboom</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {dialogText}
        </DialogContentText>
        <DecisionTreeDropzoneArea
          uploadRef={uploadRef}
          showError={false}
          allowedMimeTypes={['text/csv']}
        />
        {error !== '' && (
          <ErrorTextTypography>
            Upload een csv bestand of klik op annuleren.
          </ErrorTextTypography>
        )}
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
          Beslisboom updaten
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
)(UploadDecisionTreeDialog);

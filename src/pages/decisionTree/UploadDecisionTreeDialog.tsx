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
import { TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { TextFieldProps } from '@material-ui/core/TextField';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import FileDropzoneArea from '../../components/form/FileDropzoneArea';
import decisionTreeRepository, {
  DecisionTreeStep,
} from '../../firebase/database/decisionTreeRepository';

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
  const titleRef = useRef<TextFieldProps>();
  const csvUploadRef = useRef<string>('');
  const iconUploadRef = useRef<string>('');

  const readDecisionTreeCSVFile = (
    csvFile: string,
    title: string
  ): DecisionTreeStep[] => {
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
        .map((step) => {
          const result = step as DecisionTreeStep;
          result.title = title;
          return result;
        })
    );
  };

  const handleClose = () => {
    setOpenUploadDialog(false);
  };

  const addIconToFirstStep = (steps: DecisionTreeStep[]) => {
    const updatedSteps: DecisionTreeStep[] = steps;
    updatedSteps[0].iconFile = iconUploadRef.current;
    return updatedSteps;
  };

  const handleSubmit = () => {
    setLoading(true);
    if (
      titleRef.current?.value === undefined ||
      titleRef.current?.value === ''
    ) {
      setError('Geef een titel voor de beslisboom op');
      setLoading(false);
      return;
    }
    if (csvUploadRef.current === undefined || csvUploadRef.current === '') {
      setError('Opslaan is mislukt, upload een correct csv bestand.');
      setLoading(false);
      return;
    }
    if (iconUploadRef.current === undefined || iconUploadRef.current === '') {
      setError('Opslaan is mislukt, upload een correct svg bestand.');
      setLoading(false);
      return;
    }
    const steps = readDecisionTreeCSVFile(
      csvUploadRef.current,
      titleRef.current?.value as string
    );
    decisionTreeRepository
      .updateDecisionTreeSteps(addIconToFirstStep(steps))
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
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          inputRef={titleRef}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="decisionTreeTitle"
          label="Naamgeving beslisboom"
          name="Naamgeving beslisboom"
          autoFocus
        />
        <FileDropzoneArea
          uploadRef={csvUploadRef}
          allowedMimeTypes={['text/csv']}
          allowedExtension="csv"
        />
        <FileDropzoneArea
          uploadRef={iconUploadRef}
          allowedMimeTypes={['image/svg+xml']}
          allowedExtension="svg"
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
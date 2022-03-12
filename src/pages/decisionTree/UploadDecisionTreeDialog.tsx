import React, { FC, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Papa from 'papaparse';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import FileDropzoneArea from '../../components/form/FileDropzoneArea';
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';
import logger from '../../helper/logger';
import decisionTreeValidator from '../../validators/decisionTreevalidator';
import { DecisionTreeCsvRow } from '../../model/DecisionTree/DecisionTreeCsvRow';
import AlertBox from '../../components/AlertBox';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DialogTransition from '../../components/dialog/DialogTransition';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';

interface Props {
  dialogText: string;
  setOpenUploadDialog: (openUploadDialog: boolean) => void;
  onLoadDecisionTree: () => void;
}

const UploadDecisionTreeDialog: FC<Props> = ({
  dialogText,
  setOpenUploadDialog,
  onLoadDecisionTree,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const titleRef = useRef<TextFieldProps>();
  const csvUploadRef = useRef<string>('');
  const dispatch = useAppDispatch();

  const setCSVUploadRef = (file: string) => {
    csvUploadRef.current = file;
  };

  const readDecisionTreeCSVFile = (
    csvFile: string,
    title: string
  ): DecisionTree => {
    const base64String = csvFile.split('data:text/csv;base64,')[1];
    const csv = Papa.parse(decodeURIComponent(escape(atob(base64String))), {
      header: true,
      dynamicTyping: true,
    });
    const steps = csv.data
      // @ts-ignore
      .filter((row) => row.id !== null)
      .map((row) => {
        const result = row as DecisionTreeCsvRow;
        result.title = title;
        result.isDraft = true;
        return result;
      })
      .sort((a, b) => a.id - b.id);
    return {
      title: steps[0]?.title ?? '',
      isDraft: true,
      steps,
    } as DecisionTree;
  };

  const handleClose = () => {
    setOpenUploadDialog(false);
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
    const steps = readDecisionTreeCSVFile(
      csvUploadRef.current,
      titleRef.current?.value as string
    );

    const validationError = decisionTreeValidator.validate(steps);
    if (validationError !== '') {
      setError(validationError);
      setLoading(false);
      return;
    }
    decisionTreeRepository
      .updateDecisionTree(steps)
      .then(() => {
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'beslisboom is gepubliceerd.',
          })
        );
        setOpenUploadDialog(false);
        onLoadDecisionTree();
      })
      .catch(() => {
        logger.error(
          'Uploading decisionTree in UploadDecisionTreeDialog.handleSubmit failed.'
        );
        setError('Het updaten van de beslisboom is mislukt');
        setLoading(false);
      });
  };

  return (
    <Dialog
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-slide-title">Upload beslisboom</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {dialogText}
        </DialogContentText>
        {error && <AlertBox severity="error" message={error} />}
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
          onUpdateFile={setCSVUploadRef}
          allowedMimeTypes={['text/csv']}
          allowedExtension="csv"
        />
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
          Beslisboom uploaden
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDecisionTreeDialog;

import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikValues } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import { Theme } from '@mui/material/styles';
import DialogTransition from '../../components/dialog/DialogTransition';
import { NotificationContent } from '../../model/Notification/NotificationContent';
import TextField from '../../components/form/formik/TextField';
import SubmitButton from '../../components/form/formik/SubmitButton';
import sendNotification from '../../firebase/functions/sendNotification';
import AlertBox from '../../components/AlertBox';
import logger from '../../helper/logger';
import { notify } from '../../redux/slice/notificationSlice';
import { useAppDispatch } from '../../redux/hooks';
import SelectLinkBookPage from '../../components/form/formik/SelectLinkBookPage';
import omit from '../../helper/object/omit';

interface Props {
  onReload: () => Promise<void>;
  onCloseDialog: () => void;
}

const SendNotificationDialog: FC<Props> = ({ onReload, onCloseDialog }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>('');
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();

  /**
   * Maximum message size check, too large messages will be rejected by the expo server (data field is maximum 4096 bytes)
   */
  const maxSizeSucceeded = (values: NotificationContent): boolean => {
    return new Blob([JSON.stringify(values)]).size > 3500;
  };

  const handleSubmitForm = (values: FormikValues, formikHelpers: any) => {
    setCustomError('');
    if (maxSizeSucceeded(values)) {
      setCustomError(
        'Kort de notificatie in. Het totale bericht is groter dan toegestaan.'
      );
      formikHelpers.setSubmitting(false);
    }
    const notificationContent = omit(values, [
      'bookType',
      'bookPageId',
    ]) as NotificationContent;
    if (values.bookType !== '' && values.bookPageId !== '') {
      notificationContent.data = {
        navigate: { aggregate: 'bookType', id: values.bookPageId },
      };
    }
    sendNotification(notificationContent)
      .then(onCloseDialog)
      .then(onReload)
      .catch((reason) => {
        logger.errorWithReason(
          'Tried to send a notification but failed',
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het sturen van de notificatie is mislukt, ververs de pagina of probeer het later opnieuw`,
          })
        );
        formikHelpers.setSubmitting(false);
      });
  };

  const initialFormState = () => {
    return {
      title: '',
      body: '',
      bookType: '',
      bookPageId: '',
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string(),
    body: Yup.string().required('Geef het bericht inhoud op'),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...initialFormState() }}
      validationSchema={formValidation}
      onSubmit={handleSubmitForm}
    >
      {({ isSubmitting, dirty }) => (
        <Dialog
          fullWidth
          open
          TransitionComponent={DialogTransition}
          keepMounted
          onClose={() => !isSubmitting && onCloseDialog()}
        >
          <DialogTitle id="alert-dialog-slide-title">
            Verstuur notificatie
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ whiteSpace: 'pre-line' }}
              id="description"
            >
              Controleer{' '}
              <a
                target="_blank"
                href="https://status.expo.dev/#"
                rel="noreferrer"
              >
                de status
              </a>{' '}
              van de server voor het versturen van notificaties naar gebruikers.
              In de app geven we aan dat We ons best doen om alleen meldingen te
              sturen waarvan we denken dat de gebruiker deze wilt lezen. Krijgt
              hij onnodige of te vaak notificaties dan kan hij de voorkeuren
              aanpassen om de notificaties uit te zetten.
            </DialogContentText>
            {isSubmitting && (
              <AlertBox severity="info" message="Een moment geduld..." />
            )}
            {customError && <AlertBox severity="error" message={customError} />}
            <TextField
              sx={(theme: Theme) => ({
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
              })}
              autoFocus
              showError={showError}
              id="title"
              label="Titel"
              name="title"
            />
            <TextField
              sx={{ marginBottom: (theme: Theme) => theme.spacing(2) }}
              showError={showError}
              multiline
              minRows={3}
              maxRows={8}
              required
              id="body"
              label="Bericht"
              name="body"
            />
            <DialogContentText id="description">
              Maak hieronder de keuze naar welke pagina je de gebruiker wilt
              navigeren bij het aanklikken van de notificatie (optioneel).
              <br />
              <br />
              Let op! We adviseren alleen een link naar een pagina op te geven
              waarbij het update moment van het boek voor het opstarten gebeurd.
              Gebruikers die de app namelijk niet vaak gebruiken hebben mogelijk
              de pagina nog niet op hun telefoon staan.
            </DialogContentText>
            <SelectLinkBookPage formik={formikRef} showError={showError} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={onCloseDialog}
              color="primary"
              variant="contained"
              disabled={isSubmitting}
            >
              Terug
            </Button>
            <SubmitButton
              showInBottomBar={false}
              setShowError={setShowError}
              disabled={isSubmitting || !dirty}
              color="secondary"
              variant="contained"
            >
              Verstuur
            </SubmitButton>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};

export default SendNotificationDialog;

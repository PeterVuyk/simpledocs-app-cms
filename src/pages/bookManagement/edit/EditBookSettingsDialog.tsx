import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Dialog, FormLabel } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import SubmitButton from '../../../components/form/formik/SubmitButton';
import TextField from '../../../components/form/formik/TextField';
import { notify } from '../../../redux/slice/notificationSlice';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import AlertBox from '../../../components/AlertBox';
import updateUser from '../../../firebase/functions/updateUser';
import validateYupPassword from '../../../components/form/formik/validators/validateYupPassword';
import DialogTransition from '../../../components/dialog/DialogTransition';
import { BookSetting } from '../../../model/books/BookSetting';
import Select from '../../../components/form/formik/Select';
import ChapterDivisions from '../../../model/books/ChapterDivisions';
import CheckboxGroup from '../../../components/form/formik/CheckboxGroup';
import FileDropzoneArea from '../../../components/form/formik/FileDropzoneArea';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  bookSetting: BookSetting;
  oncloseDialog: () => void;
}

const EditBookSettingsDialog: FC<Props> = ({ oncloseDialog, bookSetting }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const handleSubmitForm = (values: FormikValues) => {
    updateUser(values.password)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De boekgegevens zijn gewijzigd.',
          })
        )
      )
      .then(oncloseDialog)
      .catch((error) => {
        logger.errorWithReason(
          'Failed updating the bookSettings in EditBookSettingsDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het wijzigen van de boekgegevens is mislukt.`,
          })
        );
      });
  };

  const initialFormState = () => {
    return bookSetting;
  };

  const formValidation = Yup.object().shape({
    password: validateYupPassword(),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...initialFormState() }}
      validationSchema={formValidation}
      onSubmit={handleSubmitForm}
    >
      {({ isSubmitting, dirty, values }) => (
        <Dialog
          open
          TransitionComponent={DialogTransition}
          keepMounted
          onClose={() => !isSubmitting && oncloseDialog()}
        >
          <DialogTitle id="alert-dialog-slide-title">
            Boekgegevens wijzigen
          </DialogTitle>
          <Form>
            <DialogContent>
              <DialogContentText
                style={{ whiteSpace: 'pre-line' }}
                id="description"
              >
                Wijzig hier de boekgegevens. Let hierbij op dat de gedane
                wijzigingen na bewerking gelijk doorgevoerd wordt.
              </DialogContentText>
              {isSubmitting && (
                <AlertBox severity="info" message="Een moment geduld..." />
              )}
              <TextField
                className={classes.textFieldStyle}
                showError={showError}
                autoFocus
                required
                id="title"
                label="Titel"
                name="title"
              />
              <TextField
                className={classes.textFieldStyle}
                showError={showError}
                multiline
                minRows={3}
                maxRows={3}
                required
                id="subTitle"
                label="Subtitel"
                name="subTitle"
              />
              <TextField
                className={classes.textFieldStyle}
                showError={showError}
                required
                id="index"
                label="Index"
                name="index"
              />
              <Select
                className={classes.textFieldStyle}
                name="tab"
                label="Weergave tab"
                showError={showError}
                options={{
                  firstBookTab: `Eerste tab`,
                  secondBookTab: `Tweede tab`,
                }}
              />
              <Select
                className={classes.textFieldStyle}
                name="isDraft"
                label="Concept / Gepubliceerd"
                showError={showError}
                options={{
                  false: `Gepubliceerd`,
                  true: `Concept`,
                }}
              />
              <CheckboxGroup
                name="chapterDivisionsInList"
                label="Hoofdstukindelingen tonen op primaire pagina"
                items={ChapterDivisions}
              />
              <CheckboxGroup
                name="chapterDivisionsInIntermediateList"
                label="Hoofdstukindelingen tonen op secundaire pagina"
                items={ChapterDivisions}
              />
              <FormLabel
                style={{ paddingBottom: 8, paddingTop: 8 }}
                component="legend"
              >
                Afbeelding
              </FormLabel>
              <FileDropzoneArea
                initialFile={values.imageFile}
                name="imageFile"
                showError={showError}
                formik={formikRef}
                allowedMimeTypes={['image/jpeg', 'image/jpg', 'image/png']}
                allowedExtension="png of jpg"
                dropzoneText="Klik hier of sleep de afbeelding hierheen"
                disabled={isSubmitting}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={oncloseDialog}
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
                Wijzigen
              </SubmitButton>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};

export default EditBookSettingsDialog;

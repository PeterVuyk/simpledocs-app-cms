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
import SubmitButton from '../../components/form/formik/SubmitButton';
import TextField from '../../components/form/formik/TextField';
import AlertBox from '../../components/AlertBox';
import DialogTransition from '../../components/dialog/DialogTransition';
import { BookSetting } from '../../model/books/BookSetting';
import Select from '../../components/form/formik/Select';
import ChapterDivisions from '../../model/books/ChapterDivisions';
import CheckboxGroup from '../../components/form/formik/CheckboxGroup';
import FileDropzoneArea from '../../components/form/formik/FileDropzoneArea';
import randomIdGenerator from '../../helper/text/randomIdGenerator';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  onSubmit: (values: FormikValues) => Promise<void>;
  bookSetting?: BookSetting;
  oncloseDialog: () => void;
}

const BookManagementForm: FC<Props> = ({
  oncloseDialog,
  bookSetting,
  onSubmit,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const classes = useStyles();

  const handleSubmitForm = (values: FormikValues) => {
    return onSubmit(values);
  };

  const initialFormState = () => {
    if (bookSetting) {
      return bookSetting;
    }
    return {
      title: '',
      subTitle: '',
      chapterDivisionsInList: ['chapter', 'section', 'subSection'],
      chapterDivisionsInIntermediateList: ['subSubSection', 'subHead'],
      imageFile: null,
      tab: 'firstBookTab',
      index: undefined,
      isDraft: true,
      bookType: randomIdGenerator('book-'),
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    subTitle: Yup.string().required('Subtitel is een verplicht veld.'),
    imageFile: Yup.mixed().required(
      'Het uploaden van een afbeelding is verplicht.'
    ),
    index: Yup.number()
      .integer()
      .positive()
      .required('index is een verplicht veld.'),
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
            {`Boekgegevens ${
              bookSetting === undefined ? 'toevoegen' : 'wijzigen'
            }`}
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
              {/* TODO: type="number" ook op andere indexes toepassen */}
              <TextField
                type="number"
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
                disabled={bookSetting === undefined}
                options={{
                  false: `Gepubliceerd`,
                  true: `Concept`,
                }}
              />
              <CheckboxGroup
                name="chapterDivisionsInList"
                label="Hoofdstukindelingen tonen op de primaire pagina"
                items={ChapterDivisions}
              />
              <CheckboxGroup
                name="chapterDivisionsInIntermediateList"
                label="Hoofdstukindelingen tonen op de secundaire pagina"
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
                {bookSetting === undefined ? 'Toevoegen' : 'Wijzigen'}
              </SubmitButton>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};

export default BookManagementForm;

import React, { FC, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Form, Formik, FormikValues } from 'formik';
import Grid from '@mui/material/Grid';
import * as Yup from 'yup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DialogContent } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import { Theme } from '@mui/material/styles';
import { PageInfo } from '../../../model/Page';
import TextField from '../../form/formik/TextField';
import validateBookChapter from '../../form/formik/validators/validateBookChapter';
import Select from '../../form/formik/Select';
import bookRepository from '../../../firebase/database/bookRepository';
import { notify } from '../../../redux/slice/notificationSlice';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import DialogTransition from '../../dialog/DialogTransition';
import useNavigate from '../../../navigation/useNavigate';
import useAppConfiguration from '../../../configuration/useAppConfiguration';

interface Props {
  bookType: string;
  page: PageInfo;
  onClose: () => void;
}

const CopyPageDialog: FC<Props> = ({ bookType, page, onClose }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const { getSortedBooks } = useAppConfiguration();
  const { history } = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmitForm = (values: FormikValues) => {
    bookRepository
      .createPage(values.bookType, {
        pageIndex: -Date.now(),
        chapter: values.chapter,
        chapterDivision: page.chapterDivision,
        title: page.title,
        subTitle: page.subTitle,
        searchText: page.searchText,
        content: page.content,
        contentType: page.contentType,
        iconFile: page.iconFile,
        isDraft: true,
      })
      .then(() => history.push(`/books/${values.bookType}`))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Pagina is succesvol gekopieerd.',
          })
        )
      )
      .then(onClose)
      .catch((error) => {
        logger.errorWithReason(
          'Copy page has failed in CopyPageDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het kopiëren van het artikel is mislukt, foutmelding: ${error.message}.`,
          })
        );
      });
  };

  const initialFormState = () => {
    return {
      chapter: page.chapter,
      bookType,
    };
  };

  const formValidation = Yup.object().shape({
    chapter: validateBookChapter(undefined, undefined),
    bookType: Yup.string()
      .required('Het opgeven van een boek is verplicht.')
      .test(
        'bookType',
        'Het opgegeven boek is onbekend',
        async (givenBookType) =>
          givenBookType !== undefined &&
          getSortedBooks().find((value) => value.bookType === givenBookType) !==
            undefined
      ),
  });

  const getBookOptions = () => {
    return getSortedBooks()
      .map((value) => ({ bookType: value.bookType, title: value.title }))
      .reduce(
        (obj, item) => Object.assign(obj, { [item.bookType]: item.title }),
        {}
      );
  };

  return (
    <Dialog
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle id="alert-dialog-slide-title">Pagina kopiëren</DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={{ ...initialFormState() }}
        validationSchema={formValidation}
        onSubmit={handleSubmitForm}
      >
        {({ isSubmitting, dirty, submitForm }) => (
          <>
            <DialogContent>
              <DialogContentText
                color="textPrimary"
                sx={{
                  marginBottom: (theme: Theme) => theme.spacing(2),
                  whiteSpace: 'pre-line',
                }}
                id="alert-dialog-slide-description"
              >
                Kopieer de pagina en geef een nieuw hoofdstuk op. De nieuwe
                pagina krijgt een nieuw ID toegewezen, Favorieten van gebruikers
                en verwijzingen in andere pagina&#39;s naar deze pagina blijft
                verwijzen naar de originele pagina. Na het kopiëren kan je via
                &#39;Pagina&#39;s sorteren&#39; de positie van de gekopieerde
                pagina bepalen.
              </DialogContentText>
              <Form>
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  direction="row"
                >
                  <Grid item xs={12}>
                    <TextField
                      showError={showError}
                      required
                      id="chapter"
                      label="Hoofdstuk"
                      name="chapter"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      name="bookType"
                      label="Boek"
                      showError={showError}
                      options={getBookOptions()}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary" variant="contained">
                Terug
              </Button>
              <Button
                disabled={isSubmitting || !dirty}
                onClick={() => submitForm().then(() => setShowError(true))}
                color="secondary"
                variant="contained"
              >
                Toevoegen
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default CopyPageDialog;

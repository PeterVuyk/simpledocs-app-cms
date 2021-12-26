import React, { FC, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Form, Formik, FormikValues } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { DialogContent } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import DialogContentText from '@material-ui/core/DialogContentText';
import { PageInfo } from '../../../model/Page';
import TextField from '../../form/formik/TextField';
import validatePageIndex from '../../form/formik/validators/validatePageIndex';
import validateBookChapter from '../../form/formik/validators/validateBookChapter';
import useCmsConfiguration from '../../../configuration/useCmsConfiguration';
import Select from '../../form/formik/Select';
import bookRepository from '../../../firebase/database/bookRepository';
import { notify } from '../../../redux/slice/notificationSlice';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import DialogTransition from '../../dialog/DialogTransition';

interface Props {
  bookType: string;
  page: PageInfo;
  onClose: () => void;
}

const CopyPageDialog: FC<Props> = ({ bookType, page, onClose }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const { configuration, getSlugFromBookType } = useCmsConfiguration();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleSubmitForm = (values: FormikValues) => {
    bookRepository
      .createPage(values.bookType, {
        pageIndex: values.pageIndex,
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
      .then(() =>
        history.push(`/books/${getSlugFromBookType(values.bookType)}`)
      )
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
      pageIndex: page.pageIndex,
      bookType,
    };
  };

  const formValidation = Yup.object().shape({
    chapter: validateBookChapter(undefined, undefined),
    pageIndex: validatePageIndex(undefined, undefined),
    bookType: Yup.string()
      .required('Het opgeven van een boek is verplicht.')
      .test(
        'bookType',
        'Het opgegeven type boek is niet bekend in het cms configuratie',
        async (givenBookType) =>
          givenBookType !== undefined &&
          Object.keys(configuration.books.bookItems).includes(givenBookType)
      ),
  });

  const getBookOptions = () => {
    const bookTypes = Object.keys(configuration.books.bookItems);
    return bookTypes
      .sort(
        (a, b) =>
          configuration.books.bookItems[a].navigationIndex -
          configuration.books.bookItems[b].navigationIndex
      )
      .map((value) => {
        return {
          bookType: value,
          title: configuration.books.bookItems[value].title,
        };
      })
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
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                Kopieer de pagina en geef een nieuw hoofdstuk en index op. De
                nieuwe pagina krijgt een nieuw ID toegewezen, Favorieten van
                gebruikers en verwijzingen in andere pagina&#39;s naar deze
                pagina blijft verwijzen naar de originele pagina.
              </DialogContentText>
              <Form>
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  direction="row"
                >
                  <Grid item xs={6}>
                    <TextField
                      showError={showError}
                      required
                      id="chapter"
                      label="Hoofdstuk"
                      name="chapter"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      showError={showError}
                      required
                      id="pageIndex"
                      label="Index"
                      name="pageIndex"
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

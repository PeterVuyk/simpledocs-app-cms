import React, { FC, useCallback, useEffect, useState } from 'react';
import { Form, useField } from 'formik';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AlertBox from '../../../../../AlertBox';
import SubmitButton from '../../../SubmitButton';
import Select from '../../../Select';
import bookRepository from '../../../../../../firebase/database/bookRepository';
import TextField from '../../../TextField';
import { Page } from '../../../../../../model/Page';
import useAppConfiguration from '../../../../../../configuration/useAppConfiguration';

const useStyles = makeStyles((theme: Theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  isSubmitting: boolean;
  dirty: boolean;
  formik: any;
  onCloseDialog: () => void;
}

const SelectLinkPageForm: FC<Props> = ({
  isSubmitting,
  dirty,
  formik,
  onCloseDialog,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [pages, setPages] = useState<Page[]>([]);
  const { getSortedBooks } = useAppConfiguration();
  const [bookTypeField] = useField('bookType');
  const [bookPageIdField] = useField('bookPageId');
  const [linkTextField] = useField('linkText');
  const classes = useStyles();

  const getBookOptions = useCallback(() => {
    return getSortedBooks()
      .map((value) => ({
        bookType: value.bookType,
        title: value.title,
      }))
      .reduce(
        (obj, item) => Object.assign(obj, { [item.bookType]: item.title }),
        {}
      );
  }, [getSortedBooks]);

  const getPageOptions = () => {
    return pages
      .filter((page) => !page.markedForDeletion)
      .map((page) => ({
        id: page.id,
        chapter: page.chapter,
        title: page.title,
      }))
      .reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.id!]: `${item.chapter} ${item.title}`,
          }),
        {}
      );
  };

  useEffect(() => {
    setPages([]);
    formik.current?.setFieldValue('bookPageId', '');
    if (bookTypeField.value !== '') {
      bookRepository.getAllPages(bookTypeField.value).then(setPages);
    }
  }, [bookTypeField.value, formik]);

  useEffect(() => {
    if (linkTextField.value !== '' || bookPageIdField.value === '') {
      return;
    }
    const page = pages
      .filter((value) => !value.markedForDeletion)
      .find((value) => value.id === bookPageIdField.value);
    if (page) {
      formik.current?.setFieldValue('linkText', page.title);
    }
  }, [bookPageIdField.value, formik, linkTextField.value, pages]);

  return (
    <Form>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          Kies het boek en bijbehorende hoofdstuk en klik op link maken.
        </DialogContentText>
        {isSubmitting && (
          <AlertBox severity="info" message="Een moment geduld..." />
        )}
        <Select
          required
          className={classes.textFieldStyle}
          name="bookType"
          label="Boek"
          showError={showError}
          options={getBookOptions()}
          autoFocus
        />
        <Select
          required
          className={classes.textFieldStyle}
          name="bookPageId"
          label="Pagina"
          showError={showError}
          options={getPageOptions()}
        />
        <TextField
          required
          showError={showError}
          id="linkText"
          label="Tekst in link"
          name="linkText"
        />
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
          Link maken
        </SubmitButton>
      </DialogActions>
    </Form>
  );
};

export default SelectLinkPageForm;

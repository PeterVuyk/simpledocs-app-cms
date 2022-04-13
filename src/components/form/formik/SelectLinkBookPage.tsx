import React, { FC, useCallback, useEffect, useState } from 'react';
import { useField } from 'formik';
import { Theme } from '@mui/material/styles';
import Select from './Select';
import bookRepository from '../../../firebase/database/bookRepository';
import TextField from './TextField';
import { Page } from '../../../model/Page';
import useAppConfiguration from '../../../configuration/useAppConfiguration';

interface Props {
  formik: any;
  showError: boolean;
  showAltTextField?: boolean;
  required?: boolean;
}

const SelectLinkBookPage: FC<Props> = ({
  required,
  formik,
  showError,
  showAltTextField,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const { getSortedBooks } = useAppConfiguration();
  const [bookTypeField] = useField('bookType');
  const [bookPageIdField] = useField('bookPageId');
  const [linkTextField] = useField('linkText');

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
    <>
      <Select
        required={required}
        sx={(theme: Theme) => ({
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        })}
        name="bookType"
        label="Boek"
        showError={showError}
        options={getBookOptions()}
      />
      <Select
        required
        sx={{ marginBottom: (theme: Theme) => theme.spacing(2) }}
        name="bookPageId"
        label="Pagina"
        showError={showError}
        options={getPageOptions()}
      />
      {showAltTextField && (
        <TextField
          required={required}
          showError={showError}
          id="linkText"
          label="Tekst in link"
          name="linkText"
        />
      )}
    </>
  );
};

export default SelectLinkBookPage;

import React, { FC, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import bookRepository from '../../../firebase/database/bookRepository';
import PageHeading from '../../../layout/PageHeading';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import BookPagesList from './BookPagesList';
import { EDIT_STATUS_DRAFT } from '../../../model/EditStatus';
import { PageInfo } from '../../../model/Page';
import DownloadBookPagesMenuButton from '../download/DownloadBookPagesMenuButton';
import useStatusToggle from '../../../components/hooks/useStatusToggle';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useCmsConfiguration from '../../../configuration/useCmsConfiguration';
import UpdateStylesheet from '../stylesheet/UpdateStylesheetButton';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  button: {
    marginLeft: 8,
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  title: string;
  bookType: string;
}

const BookPages: FC<Props> = ({ title, bookType }) => {
  const [pages, setPages] = useState<PageInfo[] | null>(null);
  const { editStatus, setEditStatus } = useStatusToggle();
  const classes = useStyles();
  const history = useHistory();
  const { getSlugFromBookType } = useCmsConfiguration();

  const loadPages = useCallback(() => {
    setPages(null);
    bookRepository
      .getPages(bookType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setPages(result));
  }, [bookType, editStatus]);

  useEffect(() => {
    loadPages();
  }, [bookType, editStatus, loadPages]);

  const getAddPagePath = () => {
    return {
      pathname: `/books/${getSlugFromBookType(bookType)}/add`,
      bookType,
    };
  };

  const handleStylesheetUpdate = () => {
    loadPages();
  };

  return (
    <>
      <PageHeading title={title}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {pages && pages.length !== 0 && (
          <>
            <UpdateStylesheet
              onStylesheetUpdate={handleStylesheetUpdate}
              bookType={bookType}
            />
            <DownloadBookPagesMenuButton
              pages={pages}
              bookType={bookType}
              editStatus={editStatus}
            />
          </>
        )}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(getAddPagePath())}
        >
          Pagina toevoegen
        </Button>
      </PageHeading>
      <BookPagesList
        editStatus={editStatus}
        onLoadPages={loadPages}
        pages={pages}
        bookType={bookType}
      />
      {pages === null && <LoadingSpinner />}
    </>
  );
};

export default BookPages;

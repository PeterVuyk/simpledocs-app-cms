import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
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
import useNavigate from '../../../navigation/useNavigate';

interface Props {
  title: string;
  bookType: string;
}

const BookPages: FC<Props> = ({ title, bookType }) => {
  const [pages, setPages] = useState<PageInfo[] | null>(null);
  const { editStatus, setEditStatus } = useStatusToggle();
  const { navigate } = useNavigate();
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

  const getAddPagePath = (): string =>
    `/books/${getSlugFromBookType(bookType)}/add`;

  const handleStylesheetUpdate = () => {
    loadPages();
  };

  return (
    <>
      <PageHeading title={title}>
        <ButtonGroup>
          <EditStatusToggle
            editStatus={editStatus}
            setEditStatus={setEditStatus}
          />
          {pages && pages.length !== 0 && (
            <UpdateStylesheet
              onStylesheetUpdate={handleStylesheetUpdate}
              bookType={bookType}
            />
          )}
          {pages && pages.length !== 0 && (
            <DownloadBookPagesMenuButton
              pages={pages}
              bookType={bookType}
              editStatus={editStatus}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => navigate(e, getAddPagePath())}
          >
            Pagina toevoegen
          </Button>
        </ButtonGroup>
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

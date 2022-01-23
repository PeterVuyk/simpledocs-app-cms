import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import { Tooltip } from '@material-ui/core';
import bookRepository from '../../../firebase/database/bookRepository';
import logger from '../../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { PageInfo } from '../../../model/Page';
import DownloadContentAction from '../../../components/ItemAction/DownloadContentAction';
import ViewContentAction from '../../../components/ItemAction/ViewContentAction';
import DeleteItemAction from '../../../components/ItemAction/DeleteItemAction';
import EditItemAction from '../../../components/ItemAction/EditItemAction';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';
import CopyPageAction from '../../../components/ItemAction/copyPageAction/CopyPageAction';
import ChapterDivisions from '../../../model/books/ChapterDivisions';
import DiffPageAction from '../../../components/ItemAction/diffAction/diffPageAction/DiffPageAction';

const useStyles = makeStyles({
  icon: {
    width: 45,
  },
  toolBox: {
    width: 230,
  },
});

interface Props {
  page: PageInfo;
  onLoadPages: () => void;
  editStatus: EditStatus;
  bookType: string;
  bookTypeSlug: string;
}

const BookPageListItem: FC<Props> = ({
  page,
  onLoadPages,
  editStatus,
  bookType,
  bookTypeSlug,
}) => {
  const [showMarkForDeletion, setShowMarkForDeletion] =
    useState<boolean>(false);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const getChapterDivision = (chapterDivision: string): string => {
    return chapterDivision in ChapterDivisions
      ? // @ts-ignore
        ChapterDivisions[chapterDivision]
      : '';
  };

  useEffect(() => {
    const markedForDeletionPageHasDraft = async () => {
      if (!page.markedForDeletion || editStatus !== EDIT_STATUS_DRAFT) {
        setShowMarkForDeletion(false);
        return;
      }

      const draft = await bookRepository.getPageById(
        bookType,
        `${page.id}-draft`
      );
      setShowMarkForDeletion(draft === null);
    };
    markedForDeletionPageHasDraft();
  }, [page.id, page.markedForDeletion, bookType, editStatus]);

  const onDelete = async (id: string): Promise<void> => {
    if (page.isDraft) {
      await bookRepository
        .deletePage(bookType, id)
        .then(onLoadPages)
        .then(() =>
          dispatch(
            notify({
              notificationType: 'success',
              notificationOpen: true,
              notificationMessage: 'Pagina is verwijderd.',
            })
          )
        )
        .catch((reason) =>
          logger.errorWithReason('Failed deleting page', reason)
        );
      return;
    }
    await bookRepository
      .markPageForDeletion(bookType, id)
      .then(onLoadPages)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Pagina is gemarkeerd voor verwijdering.',
          })
        )
      )
      .catch((reason) =>
        logger.errorWithReason('Failed marking page for deletion', reason)
      );
  };

  const undoMarkDeletion = async () => {
    await bookRepository
      .removeMarkForDeletion(bookType, page.id ?? '')
      .then(onLoadPages)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage:
              'De markering voor het verwijderen van het artikel is ongedaan gemaakt.',
          })
        )
      )
      .catch((reason) =>
        logger.errorWithReason(
          `Failed removing the mark for deletion from the page id${page.id}`,
          reason
        )
      );
  };

  const getEditUrl = () => `/books/${bookTypeSlug}/${page.id}`;

  const getDeleteTitle = () => {
    return editStatus === EDIT_STATUS_DRAFT
      ? 'Weet je zeker dat je dit artikel wilt verwijderen?'
      : 'Weet je zeker dat je dit artikel wilt markeren voor verwijdering?';
  };

  return (
    <>
      <TableCell component="th" scope="row">
        {page.chapter}
      </TableCell>
      <TableCell>{page.title}</TableCell>
      <TableCell>{getChapterDivision(page.chapterDivision)}</TableCell>
      <TableCell>
        {page.pageIndex
          .toString()
          .replace(/(.{2})/g, '$1•')
          .trim()}
      </TableCell>
      <TableCell>
        <img
          className={classes.icon}
          src={`${page.iconFile}`}
          alt={page.chapter}
        />
      </TableCell>
      <TableCell>{page.contentType}</TableCell>
      <TableCell>{page.id?.replaceAll('-draft', '') ?? ''}</TableCell>
      <TableCell align="right" className={classes.toolBox}>
        {!page.isNewCreatedPage && page.isDraft && (
          <DiffPageAction bookType={bookType} pageId={page.id!} />
        )}
        {!page.markedForDeletion && <EditItemAction urlSlug={getEditUrl()} />}
        <CopyPageAction bookType={bookType} page={page} />
        <DownloadContentAction
          content={page.content}
          contentType={page.contentType}
          fileName={page.chapter}
        />
        <ViewContentAction
          content={page.content}
          contentType={page.contentType}
        />
        {showMarkForDeletion && (
          <Tooltip title="Markering voor verwijdering opheffen">
            <RestoreFromTrashTwoToneIcon
              style={{ cursor: 'pointer', color: '#099000FF' }}
              onClick={() => undoMarkDeletion()}
            />
          </Tooltip>
        )}
        {!page.markedForDeletion && page.id && (
          <DeleteItemAction
            title={getDeleteTitle()}
            dialogText={`Hoofdstuk: ${page.chapter}\nTitel: ${
              page.title
            }\nHoofdstuk indeling: ${getChapterDivision(page.chapterDivision)}`}
            onSubmit={onDelete}
            itemId={page.id}
          />
        )}
      </TableCell>
    </>
  );
};

export default BookPageListItem;

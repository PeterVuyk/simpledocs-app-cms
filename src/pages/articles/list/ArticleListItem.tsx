import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import { Tooltip } from '@material-ui/core';
import articleRepository from '../../../firebase/database/articleRepository';
import logger from '../../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import DownloadContentAction from '../../../components/ItemAction/DownloadContentAction';
import ViewContentAction from '../../../components/ItemAction/ViewContentAction';
import DeleteItemAction from '../../../components/ItemAction/DeleteItemAction';
import EditItemAction from '../../../components/ItemAction/EditItemAction';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';
import CopyArticleAction from '../../../components/ItemAction/copyArticleAction/CopyArticleAction';

const useStyles = makeStyles({
  icon: {
    width: 35,
  },
  toolBox: {
    width: 230,
  },
});

interface Props {
  article: Article;
  onLoadArticles: () => void;
  editStatus: EditStatus;
  bookType: string;
  bookTypeSlug: string;
}

const ArticleListItem: FC<Props> = ({
  article,
  onLoadArticles,
  editStatus,
  bookType,
  bookTypeSlug,
}) => {
  const [showMarkForDeletion, setShowMarkForDeletion] =
    useState<boolean>(false);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const getChapterDivision = (chapterDivision: string): string => {
    const chapterDivisions = {
      chapter: 'Hoofdstuk',
      section: 'Paragraaf',
      subSection: 'Subparagraaf',
      subSubSection: 'Sub-subparagraaf',
      subHead: 'Tussenkop',
    };
    return chapterDivision in chapterDivisions
      ? // @ts-ignore
        chapterDivisions[chapterDivision]
      : '';
  };

  useEffect(() => {
    const markedForDeletionArticleHasDraft = async () => {
      if (!article.markedForDeletion || editStatus !== EDIT_STATUS_DRAFT) {
        setShowMarkForDeletion(false);
        return;
      }

      const draft = await articleRepository.getArticleById(
        bookType,
        `${article.id}-draft`
      );
      setShowMarkForDeletion(draft === null);
    };
    markedForDeletionArticleHasDraft();
  }, [article.id, article.markedForDeletion, bookType, editStatus]);

  const onDelete = async (id: string): Promise<void> => {
    if (article.isDraft) {
      await articleRepository
        .deleteArticle(bookType, id)
        .then(onLoadArticles)
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
          logger.errorWithReason('Failed deleting article', reason)
        );
      return;
    }
    await articleRepository
      .markArticleForDeletion(bookType, id)
      .then(onLoadArticles)
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
        logger.errorWithReason('Failed marking article for deletion', reason)
      );
  };

  const undoMarkDeletion = async () => {
    await articleRepository
      .removeMarkForDeletion(bookType, article.id ?? '')
      .then(onLoadArticles)
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
          `Failed removing the mark for deletion from the article id${article.id}`,
          reason
        )
      );
  };

  const getEditUrl = () => `/books/${bookTypeSlug}/${article.id}`;

  const getDeleteTitle = () => {
    return editStatus === EDIT_STATUS_DRAFT
      ? 'Weet je zeker dat je dit artikel wilt verwijderen?'
      : 'Weet je zeker dat je dit artikel wilt markeren voor verwijdering?';
  };

  return (
    <>
      <TableCell component="th" scope="row">
        {article.chapter}
      </TableCell>
      <TableCell>{article.title}</TableCell>
      <TableCell>{getChapterDivision(article.chapterDivision)}</TableCell>
      <TableCell>
        {article.pageIndex
          .toString()
          .replace(/(.{2})/g, '$1•')
          .trim()}
      </TableCell>
      <TableCell>
        <img
          className={classes.icon}
          src={`${article.iconFile}`}
          alt={article.chapter}
        />
      </TableCell>
      <TableCell>{article.contentType}</TableCell>
      <TableCell>{article.id?.replaceAll('-draft', '') ?? ''}</TableCell>
      <TableCell align="right" className={classes.toolBox}>
        {!article.markedForDeletion && (
          <EditItemAction urlSlug={getEditUrl()} />
        )}
        <CopyArticleAction bookType={bookType} article={article} />
        <DownloadContentAction
          content={article.content}
          contentType={article.contentType}
          fileName={article.chapter}
        />
        <ViewContentAction
          content={article.content}
          contentType={article.contentType}
        />
        {showMarkForDeletion && (
          <Tooltip title="Markering voor verwijdering opheffen">
            <RestoreFromTrashTwoToneIcon
              style={{ cursor: 'pointer', color: '#099000FF' }}
              onClick={() => undoMarkDeletion()}
            />
          </Tooltip>
        )}
        {!article.markedForDeletion && article.id && (
          <DeleteItemAction
            title={getDeleteTitle()}
            dialogText={`Hoofdstuk: ${article.chapter}\nTitel: ${
              article.title
            }\nHoofdstuk indeling: ${getChapterDivision(
              article.chapterDivision
            )}`}
            onSubmit={onDelete}
            itemId={article.id}
          />
        )}
      </TableCell>
    </>
  );
};

export default ArticleListItem;

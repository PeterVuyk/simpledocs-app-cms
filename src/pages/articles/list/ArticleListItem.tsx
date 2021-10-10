import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import { Tooltip } from '@material-ui/core';
import articleRepository from '../../../firebase/database/articleRepository';
import notification from '../../../redux/actions/notification';
import logger from '../../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import { NotificationOptions } from '../../../model/NotificationOptions';
import DownloadContentAction from '../../../components/ItemAction/DownloadContentAction';
import ViewContentAction from '../../../components/ItemAction/ViewContentAction';
import DeleteItemAction from '../../../components/ItemAction/DeleteItemAction';
import EditItemAction from '../../../components/ItemAction/EditItemAction';

const useStyles = makeStyles({
  icon: {
    width: 20,
  },
  toolBox: {
    width: 150,
  },
});

interface Props {
  article: Article;
  onLoadArticles: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
  editStatus: EditStatus;
  bookType: string;
  bookTypeSlug: string;
}

const ArticleListItem: FC<Props> = ({
  article,
  onLoadArticles,
  setNotification,
  editStatus,
  bookType,
  bookTypeSlug,
}) => {
  const classes = useStyles();

  const getLevel = (level: string): string => {
    const levels = {
      chapter: 'Hoofdstuk',
      section: 'Paragraaf',
      subSection: 'Subparagraaf',
      subSubSection: 'Sub-subparagraaf',
      subHead: 'Tussenkop',
      attachment: 'Bijlage',
      legislation: 'Wetgeving',
    };
    // @ts-ignore
    return level in levels ? levels[level] : '';
  };

  const onDelete = async (id: string): Promise<void> => {
    if (article.isDraft) {
      await articleRepository
        .deleteArticle(bookType, id)
        .then(onLoadArticles)
        .then(() =>
          setNotification({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Pagina is verwijderd.',
          })
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
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is gemarkeerd voor verwijdering.',
        })
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
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage:
            'De markering voor het verwijderen van het artikel is ongedaan gemaakt.',
        })
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
      <TableCell>{getLevel(article.level)}</TableCell>
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
      <TableCell align="right" className={classes.toolBox}>
        {!article.markedForDeletion && (
          <EditItemAction urlSlug={getEditUrl()} />
        )}
        <DownloadContentAction
          content={article.content}
          contentType={article.contentType}
          fileName={article.chapter}
        />
        <ViewContentAction
          content={article.content}
          contentType={article.contentType}
        />
        {article.markedForDeletion && editStatus === EDIT_STATUS_DRAFT && (
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
            }\nMarkering: ${getLevel(article.level)}`}
            onSubmit={onDelete}
            itemId={article.id}
          />
        )}
      </TableCell>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleListItem);

import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import { Tooltip } from '@material-ui/core';
import articleRepository from '../../../firebase/database/articleRepository';
import notification from '../../../redux/actions/notification';
import logger from '../../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { BookType } from '../../../model/BookType';
import { Article } from '../../../model/Article';
import { NotificationOptions } from '../../../model/NotificationOptions';
import bookTypeHelper from '../../../helper/bookTypeHelper';
import DownloadHtmlFileAction from '../../../components/ItemAction/DownloadHtmlFileAction';
import ViewHTMLFileAction from '../../../components/ItemAction/ViewHTMLFileAction';
import DeleteItemAction from '../../../components/ItemAction/DeleteItemAction';

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
  loadArticlesHandle: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
  editStatus: EditStatus;
  bookType: BookType;
}

const ArticleListItem: FC<Props> = ({
  article,
  loadArticlesHandle,
  setNotification,
  editStatus,
  bookType,
}) => {
  const classes = useStyles();
  const history = useHistory();

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

  const onDelete = (id: string): void => {
    if (article.isDraft) {
      articleRepository
        .deleteArticle(bookType, id)
        .then(() => loadArticlesHandle())
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
    articleRepository
      .markArticleForDeletion(bookType, id)
      .then(() => loadArticlesHandle())
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

  const undoMarkDeletion = () => {
    articleRepository
      .removeMarkForDeletion(bookType, article.id ?? '')
      .then(() => loadArticlesHandle())
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

  const getEditUrl = () =>
    `/books/${bookTypeHelper.bookTypeToDashedPath(bookType)}/${article.id}`;

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
      <TableCell align="right" className={classes.toolBox}>
        {!article.markedForDeletion && (
          <Tooltip title="Wijzigen">
            <EditTwoTone
              style={{ cursor: 'pointer' }}
              onClick={() => history.push(getEditUrl())}
            />
          </Tooltip>
        )}
        <DownloadHtmlFileAction
          htmlFile={article.htmlFile}
          fileName={article.chapter}
        />
        <ViewHTMLFileAction htmlFile={article.htmlFile} />
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

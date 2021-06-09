import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { connect } from 'react-redux';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import articleRepository, {
  Article,
} from '../../../firebase/database/articleRepository';
import ArticleDialog from '../../dialog/ArticleDialog';
import notification, {
  NotificationOptions,
} from '../../../redux/actions/notification';
import HtmlPreview from '../../dialog/HtmlPreview';
import fileHelper from '../../../helper/fileHelper';
import logger from '../../../helper/logger';

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
  editStatus: 'draft' | 'published';
}

const ArticleListItem: React.FC<Props> = ({
  article,
  loadArticlesHandle,
  setNotification,
  editStatus,
}) => {
  const [showHtmlPreview, setShowHtmlPreview] =
    React.useState<Article | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] =
    React.useState<Article | null>(null);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return level in levels ? levels[level] : '';
  };

  const onDelete = (id: string): void => {
    if (article.isDraft) {
      articleRepository
        .deleteArticle(id)
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
      .markArticleForDeletion(id)
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
      .removeMarkForDeletion(article.id ?? '')
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

  const closeHtmlPreviewHandle = (): void => {
    setShowHtmlPreview(null);
  };

  return (
    <>
      <TableCell component="th" scope="row">
        {article.chapter}
      </TableCell>
      <TableCell>{article.title}</TableCell>
      <TableCell>{getLevel(article.level)}</TableCell>
      <TableCell>{article.pageIndex}</TableCell>
      <TableCell>
        <img
          className={classes.icon}
          src={`${article.iconFile}`}
          alt={article.chapter}
        />
      </TableCell>
      <TableCell align="right" className={classes.toolBox}>
        {!article.markedForDeletion && (
          <EditTwoTone
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/regulations/${article.id}`)}
          />
        )}
        <GetAppIcon
          color="action"
          style={{ cursor: 'pointer' }}
          onClick={() =>
            FileSaver.saveAs(
              fileHelper.getBase64FromHtml(article.htmlFile),
              `${article.chapter}.html`
            )
          }
        />
        <FindInPageTwoToneIcon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowHtmlPreview(article)}
        />
        {article.markedForDeletion && editStatus === 'draft' && (
          <RestoreFromTrashTwoToneIcon
            style={{ cursor: 'pointer', color: '#099000FF' }}
            onClick={() => undoMarkDeletion()}
          />
        )}
        {!article.markedForDeletion && (
          <DeleteTwoToneIcon
            color="secondary"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenDeleteDialog(article)}
          />
        )}
        {showHtmlPreview && showHtmlPreview.chapter === article.chapter && (
          <HtmlPreview
            showHtmlPreview={showHtmlPreview.htmlFile}
            closeHtmlPreviewHandle={closeHtmlPreviewHandle}
          />
        )}
        {openDeleteDialog && openDeleteDialog.chapter === article.chapter && (
          <ArticleDialog
            dialogTitle="Weet je zeker dat je dit artikel wilt markeren voor verwijdering?"
            dialogText={`Hoofdstuk: ${article.chapter}\nTitel: ${
              article.title
            }\nMarkering: ${getLevel(article.level)}`}
            openDialog={openDeleteDialog}
            setOpenDialog={setOpenDeleteDialog}
            onSubmit={onDelete}
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
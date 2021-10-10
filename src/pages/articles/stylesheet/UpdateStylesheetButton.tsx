import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { connect } from 'react-redux';
import ConfirmationDialog from '../../../components/dialog/ConfirmationDialog';
import { Article } from '../../../model/Article';
import useHtmlModifier from '../../../components/hooks/useHtmlModifier';
import { CONTENT_TYPE_HTML } from '../../../model/Artifact';
import { NotificationOptions } from '../../../model/NotificationOptions';
import notification from '../../../redux/actions/notification';
import articleRepository from '../../../firebase/database/articleRepository';
import logger from '../../../helper/logger';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  bookType: string;
  onStylesheetUpdate: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const UpdateStylesheetButton: FC<Props> = ({
  bookType,
  onStylesheetUpdate,
  setNotification,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { modifyHtmlForStorage, modifyHtmlAfterUpload } = useHtmlModifier();
  const classes = useStyles();

  const updateStylesheetForAllArticles = async () => {
    const articles = await articleRepository.getAllArticles(bookType);
    const unchangedArticles = articles.filter(
      (article) => article.contentType !== CONTENT_TYPE_HTML
    );
    const updatedArticles = [...unchangedArticles];
    const articlesToEdit = articles.filter(
      (article) => article.contentType === CONTENT_TYPE_HTML
    );
    for (const article of articlesToEdit) {
      if (article.isDraft) {
        article.content = modifyHtmlForStorage(
          modifyHtmlAfterUpload(article.content)
        );
        updatedArticles.push(article);
        continue;
      }
      if (article.markedForDeletion) {
        updatedArticles.push(article);
        continue;
      }
      const newArticle = article;
      const draftArticle = { ...newArticle };
      draftArticle.isDraft = true;
      newArticle.markedForDeletion = true;
      updatedArticles.push(article);
      updatedArticles.push(draftArticle);
    }
    return updatedArticles;
  };

  const handleSubmit = async () => {
    // if marked for delete , then add it but don't change it.
    await articleRepository
      .updateArticles(bookType, await updateStylesheetForAllArticles())
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `De stylesheet voor de html pagina's zijn bijgewerkt.`,
        })
      )
      .then(() => onStylesheetUpdate())
      .catch((error) => {
        logger.errorWithReason(
          `Update articles with new stylesheet has failed for handleSubmit bookType ${bookType}`,
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het updaten van de html pagina's met de nieuwe stylesheet is mislukt, neem contact op met de beheerder.`,
        });
      });
  };

  return (
    <>
      <Tooltip title="Batch stylesheet updaten">
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          <SystemUpdateAltIcon color="action" />
        </Button>
      </Tooltip>
      <ConfirmationDialog
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        dialogText={`Weet je zeker dat je de stylesheet wilt updaten bij alle html pagina's?\n\nLet op: Gedane wijzigingen in de CSS stylesheet kan gevolgen hebben hoe de pagina wordt weergegeven in de app. Bekijk het resultaat voordat je het publiceert\n\nDeze wijziging wordt doorgevoerd bij zowel de gepubliceerde als concept- artikelen. Dit wordt in de app daadwerkelijk uitgevoerd zodra het ook gepubliceerd wordt.`}
        dialogTitle="CSS Stylesheet updaten"
        onSubmit={handleSubmit}
      />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateStylesheetButton);

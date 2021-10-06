import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import articleRepository from '../../firebase/database/articleRepository';
import PageHeading from '../../layout/PageHeading';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';
import Navigation from '../../navigation/Navigation';
import { Article } from '../../model/Article';
import { NotificationOptions } from '../../model/NotificationOptions';
import htmlContentHelper from '../../helper/htmlContentHelper';
import NotFound from '../NotFound';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CONTENT_TYPE_HTML, ContentType } from '../../model/Artifact';
import markdownHelper from '../../helper/markdownHelper';
import useConfiguration from '../../configuration/useConfiguration';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditArticle: FC<Props> = ({ setNotification }) => {
  const [article, setArticle] = useState<Article | null>();
  const history = useHistory();
  const { articleId, aggregatePath } =
    useParams<{ articleId: string; aggregatePath: string }>();
  const { getBookTypeFromUrlSlug } = useConfiguration();

  useEffect(() => {
    articleRepository
      .getArticleById(getBookTypeFromUrlSlug(aggregatePath), articleId)
      .then((result) => setArticle(result));
  }, [aggregatePath, articleId, getBookTypeFromUrlSlug]);

  const handleSubmit = async (
    values: FormikValues,
    contentType: ContentType
  ): Promise<void> => {
    await articleRepository
      .updateArticle(
        getBookTypeFromUrlSlug(aggregatePath),
        article?.chapter ?? '',
        {
          id: article?.id,
          pageIndex: values.pageIndex,
          chapter: values.chapter,
          level: values.level,
          title: values.title,
          subTitle: values.subTitle,
          searchText: values.searchText,
          content:
            contentType === CONTENT_TYPE_HTML
              ? htmlContentHelper.addHTMLTagsAndBottomSpacingToHtmlContent(
                  values.htmlContent
                )
              : markdownHelper.modifyMarkdownForStorage(values.markdownContent),
          contentType,
          iconFile: values.iconFile,
          isDraft: true,
        }
      )
      .then(() => history.push(`/books/${aggregatePath}`))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is gewijzigd.',
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit article has failed in EditArticle.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage:
            'Het wijzigen van het artikel is mislukt, neem contact op met de beheerder.',
        });
      });
  };

  if (article === null) {
    return <NotFound />;
  }

  return (
    <Navigation>
      <PageHeading title="Pagina bewerken">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      {!article && <LoadingSpinner />}
      {article && (
        <ArticleForm
          article={article}
          onSubmit={handleSubmit}
          bookType={getBookTypeFromUrlSlug(aggregatePath)}
        />
      )}
    </Navigation>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditArticle);

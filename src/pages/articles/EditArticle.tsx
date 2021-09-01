import React, { FC, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import articleRepository from '../../firebase/database/articleRepository';
import PageHeading from '../../layout/PageHeading';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';
import Navigation from '../navigation/Navigation';
import { BookType } from '../../model/BookType';
import { Article } from '../../model/Article';
import { NotificationOptions } from '../../model/NotificationOptions';
import bookTypeHelper from '../../helper/bookTypeHelper';
import htmlFileHelper from '../../helper/htmlFileHelper';
import NotFound from '../NotFound';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditArticle: FC<Props> = ({ setNotification }) => {
  const [article, setArticle] = useState<Article | null>();
  const history = useHistory();
  const { articleId, aggregatePath } =
    useParams<{ articleId: string; aggregatePath: string }>();
  const bookType: BookType = useMemo(
    () => bookTypeHelper.dashedPathToBookType(aggregatePath),
    [aggregatePath]
  );

  useEffect(() => {
    articleRepository
      .getArticleById(bookType, articleId)
      .then((result) => setArticle(result));
  }, [aggregatePath, bookType, articleId]);

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await articleRepository
      .updateArticle(bookType, article?.chapter ?? '', {
        id: article?.id,
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        level: values.level,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        htmlFile: htmlFileHelper.addHTMLTagsAndBottomSpacingToHTMLFile(
          values.htmlFile
        ),
        iconFile: values.iconFile,
        isDraft: true,
      })
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
      {article && (
        <ArticleForm
          article={article}
          onSubmit={handleSubmit}
          bookType={bookType}
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

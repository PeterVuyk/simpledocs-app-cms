import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory, useParams } from 'react-router-dom';
import { FormikValues } from 'formik';
import { connect } from 'react-redux';
import articleRepository from '../../firebase/database/articleRepository';
import notification from '../../redux/actions/notification';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../../navigation/Navigation';
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';
import { BookType } from '../../model/BookType';
import { NotificationOptions } from '../../model/NotificationOptions';
import htmlContentHelper from '../../helper/htmlContentHelper';
import navigationConfig from '../../navigation/navigationConfig.json';
import { CONTENT_TYPE_HTML, ContentType } from '../../model/Artifact';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const CreateArticle: FC<Props> = ({ setNotification }) => {
  const history = useHistory();
  const { aggregatePath } = useParams<{ aggregatePath: string }>();

  const getBookType = (): BookType => {
    return Object.keys(navigationConfig.books.bookItems)[
      Object.values(navigationConfig.books.bookItems)
        .map((item) => item.urlSlug)
        .indexOf(aggregatePath)
    ] as BookType;
  };

  const handleSubmit = (
    values: FormikValues,
    contentType: ContentType
  ): void => {
    articleRepository
      .createArticle(getBookType(), {
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
            : values.markdownContent,
        contentType,
        iconFile: values.iconFile,
        isDraft: true,
      })
      .then(() => history.push(`/books/${aggregatePath}`))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is toegevoegd.',
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Create article has failed in CreateArticle.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het toevoegen van het artikel is mislukt, foutmelding: ${error.message}.`,
        });
      });
  };

  return (
    <Navigation>
      <PageHeading title="Pagina toevoegen">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      <ArticleForm onSubmit={handleSubmit} bookType={getBookType()} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateArticle);

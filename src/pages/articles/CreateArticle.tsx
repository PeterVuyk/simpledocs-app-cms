import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory, useParams } from 'react-router-dom';
import { FormikValues } from 'formik';
import { connect } from 'react-redux';
import articleRepository from '../../firebase/database/articleRepository';
import notification from '../../redux/actions/notification';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../navigation/Navigation';
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';
import { BookType } from '../../model/BookType';
import { NotificationOptions } from '../../model/NotificationOptions';
import bookTypeHelper from '../../helper/bookTypeHelper';
import htmlFileHelper from '../../helper/htmlFileHelper';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const CreateArticle: FC<Props> = ({ setNotification }) => {
  const history = useHistory();
  const { aggregatePath } = useParams<{ aggregatePath: string }>();

  const bookType: BookType = bookTypeHelper.dashedPathToBookType(aggregatePath);

  const handleSubmit = (values: FormikValues): void => {
    articleRepository
      .createArticle(bookType, {
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
      <ArticleForm onSubmit={handleSubmit} bookType={bookType} />
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

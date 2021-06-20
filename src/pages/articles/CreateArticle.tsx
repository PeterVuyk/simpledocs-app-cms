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
import {
  ARTICLE_TYPE_INSTRUCTION_MANUAL,
  ARTICLE_TYPE_REGULATIONS,
  ArticleType,
} from '../../model/ArticleType';
import { NotificationOptions } from '../../model/NotificationOptions';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const CreateArticle: FC<Props> = ({ setNotification }) => {
  const history = useHistory();
  const { aggregatePath } = useParams<{ aggregatePath: string }>();

  const articleType: ArticleType =
    aggregatePath === ARTICLE_TYPE_REGULATIONS
      ? ARTICLE_TYPE_REGULATIONS
      : ARTICLE_TYPE_INSTRUCTION_MANUAL;

  const handleSubmit = (values: FormikValues): void => {
    articleRepository
      .createArticle(articleType, {
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        level: values.level,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        htmlFile: values.htmlFile,
        iconFile: values.iconFile,
        isDraft: true,
      })
      .then(() => history.push(`/${aggregatePath}`))
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
    <Navigation gridWidth="wide">
      <PageHeading title="Pagina toevoegen" style={{ marginRight: 18 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      <ArticleForm handleSubmit={handleSubmit} articleType={articleType} />
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

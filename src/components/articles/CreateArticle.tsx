import React from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { FormikValues } from 'formik';
import { connect } from 'react-redux';
import articleRepository from '../../firebase/database/articleRepository';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import PageHeading from '../../layout/PageHeading';
import Navigation from "../../pages/navigation/Navigation";
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const CreateArticle: React.FC<Props> = ({ setNotification }) => {
  const history = useHistory();

  const handleSubmit = (values: FormikValues): void => {
    articleRepository
      .createArticle({
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
      .then(() => history.push('/'))
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
      <ArticleForm handleSubmit={handleSubmit} />
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

import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import articleRepository, {
  Article,
} from '../../firebase/database/articleRepository';
import PageHeading from '../../layout/PageHeading';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';
import Navigation from "../../pages/navigation/Navigation";

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditArticle: React.FC<Props> = ({ setNotification }) => {
  const [article, setArticle] = React.useState<Article | null>(null);
  const history = useHistory();
  const { articleId } = useParams<{ articleId: string }>();

  React.useEffect(() => {
    articleRepository
      .getArticleById(articleId)
      .then((result) => setArticle(result));
  }, [articleId]);

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await articleRepository
      .updateArticle(article?.chapter ?? '', {
        id: article?.id,
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
      .then(() => history.push('/regulations'))
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
            'Het wijzigen van het artikel is mislukt, foutmelding: Neem contact op met de beheerder.',
        });
      });
  };

  return (
    <Navigation gridWidth="wide">
      <>
        <PageHeading title="Pagina bewerken" style={{ marginRight: 18 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.goBack()}
          >
            Terug
          </Button>
        </PageHeading>
        {article && (
          <ArticleForm article={article} handleSubmit={handleSubmit} />
        )}
      </>
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

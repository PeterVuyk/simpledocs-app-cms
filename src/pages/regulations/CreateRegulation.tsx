import React from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { FormikValues } from 'formik';
import { connect } from 'react-redux';
import regulationRepository from '../../firebase/database/regulationRepository';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../navigation/Navigation';
import logger from '../../helper/logger';
import RegulationForm from './RegulationForm';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const CreateRegulation: React.FC<Props> = ({ setNotification }) => {
  const history = useHistory();

  const handleSubmit = (values: FormikValues): void => {
    regulationRepository
      .createRegulation({
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        level: values.level,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        htmlFile: values.htmlFile,
        iconFile: values.iconFile,
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
          'Create regulation has failed in CreateRegulation.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het toevoegen van de regulatie is mislukt, foutmelding: ${error.message}.`,
        });
      });
  };

  return (
    <Navigation gridWidth="wide">
      <PageHeading title="Pagina toevoegen" style={{ marginRight: 18 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.push('/regulations')}
        >
          Terug
        </Button>
      </PageHeading>
      <RegulationForm handleSubmit={handleSubmit} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateRegulation);

import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import regulationRepository, {
  Regulation,
} from '../../firebase/database/regulationRepository';
import PageHeading from '../../layout/PageHeading';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import Navigation from '../navigation/Navigation';
import logger from '../../helper/logger';
import RegulationForm from './RegulationForm';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditRegulation: React.FC<Props> = ({ setNotification }) => {
  const [regulation, setRegulation] = React.useState<Regulation | null>(null);
  const history = useHistory();
  const { regulationId } = useParams<{ regulationId: string }>();

  React.useEffect(() => {
    regulationRepository
      .getRegulationsById(regulationId)
      .then((result) => setRegulation(result));
  }, [regulationId]);

  const handleSubmit = (values: FormikValues): void => {
    throw regulationRepository
      .updateRegulation({
        id: regulation?.id,
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        level: values.level,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        htmlFile: values.htmlFile,
        iconFile: values.iconFile,
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
          'Edit regulation has failed in EditRegulation.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage:
            'Het wijzigen van de regulatie is mislukt, foutmelding: Neem contact op met de beheerder.',
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
            onClick={() => history.push('/regulations')}
          >
            Terug
          </Button>
        </PageHeading>
        {regulation && (
          <RegulationForm regulation={regulation} handleSubmit={handleSubmit} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditRegulation);

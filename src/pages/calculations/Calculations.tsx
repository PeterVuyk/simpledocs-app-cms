import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import calculationsRepository from '../../firebase/database/calculationsRepository';
import CalculationTableView from './CalculationTableView';
import PageHeading from '../../layout/PageHeading';
import { CalculationInfo } from '../../model/CalculationInfo';
import {
  EDIT_CALCULATIONS_OVERTAKING_DISTANCE,
  EDIT_CALCULATIONS_STOPPING_DISTANCE,
} from '../../navigation/UrlSlugs';
import useStatusToggle from '../../components/hooks/useStatusToggle';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import { EDIT_STATUS_DRAFT } from '../../model/EditStatus';
import LoadingSpinner from '../../components/LoadingSpinner';
import RemoveCalculationsButton from './remove/RemoveCalculationsButton';
import { NotificationOptions } from '../../model/NotificationOptions';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
  paper: {
    padding: '6px 16px',
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
  title: string;
}

const Calculations: FC<Props> = ({ title, setNotification }) => {
  const [calculations, setCalculations] = useState<CalculationInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const classes = useStyles();
  const history = useHistory();
  const [editStatus, setEditStatus] = useStatusToggle();

  const handleReloadPublications = useCallback((): void => {
    setLoading(true);
    setCalculations([]);
    calculationsRepository
      .getCalculationsInfo(editStatus === EDIT_STATUS_DRAFT)
      .then(setCalculations)
      .then(() => setLoading(false));
  }, [editStatus]);

  useEffect(() => {
    handleReloadPublications();
  }, [handleReloadPublications]);

  const handleSubmitRemove = (calculationInfo: CalculationInfo) => {
    calculationsRepository
      .removeCalculationsDraft(calculationInfo.calculationType)
      .then(handleReloadPublications)
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `Berekening ${calculationInfo.title} verwijderd.`,
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit configuration has failed in Calculations.handleSubmitRemove',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het verwijderen van de berekening ${calculationInfo.title} is mislukt, neem contact op met de beheerder.`,
        });
      });
  };

  return (
    <>
      <PageHeading title={title}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {calculations && calculations.length !== 0 && (
          <RemoveCalculationsButton
            calculationInfos={calculations}
            onSubmitAction={handleSubmitRemove}
          />
        )}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(EDIT_CALCULATIONS_STOPPING_DISTANCE)}
        >
          Stopafstand updaten
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(EDIT_CALCULATIONS_OVERTAKING_DISTANCE)}
        >
          Inhaalafstand updaten
        </Button>
      </PageHeading>
      {isLoading && calculations.length === 0 && <LoadingSpinner />}
      {!isLoading && calculations.length === 0 && (
        <Paper elevation={2} className={classes.paper}>
          <Typography>Geen resultaten.</Typography>
        </Paper>
      )}

      {calculations.map((calculation) => (
        <div key={calculation.title.toString()}>
          <CalculationTableView calculationInfo={calculation} />
        </div>
      ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Calculations);

import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
import calculationsRepository from '../../firebase/database/calculationsRepository';
import CalculationList from './CalculationList';
import PageHeading from '../../layout/PageHeading';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';
import {
  EDIT_CALCULATIONS_OVERTAKING_DISTANCE,
  EDIT_CALCULATIONS_STOPPING_DISTANCE,
} from '../../navigation/UrlSlugs';
import useStatusToggle from '../../components/hooks/useStatusToggle';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import { EDIT_STATUS_DRAFT } from '../../model/EditStatus';
import LoadingSpinner from '../../components/LoadingSpinner';
import RemoveCalculationsButton from './remove/RemoveCalculationsButton';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import useNavigate from '../../navigation/useNavigate';

interface Props {
  title: string;
}

const Calculations: FC<Props> = ({ title }) => {
  const [calculations, setCalculations] = useState<CalculationInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { navigate } = useNavigate();
  const { editStatus, setEditStatus } = useStatusToggle();
  const dispatch = useAppDispatch();

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
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `Berekening ${calculationInfo.title} verwijderd.`,
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit configuration has failed in Calculations.handleSubmitRemove',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het verwijderen van de berekening ${calculationInfo.title} is mislukt, neem contact op met de beheerder.`,
          })
        );
      });
  };

  return (
    <>
      <PageHeading title={title}>
        <ButtonGroup>
          <EditStatusToggle
            editStatus={editStatus}
            setEditStatus={setEditStatus}
          />
          {editStatus === EDIT_STATUS_DRAFT &&
            calculations &&
            calculations.length !== 0 && (
              <RemoveCalculationsButton
                calculationInfos={calculations}
                onSubmitAction={handleSubmitRemove}
              />
            )}
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => navigate(e, EDIT_CALCULATIONS_STOPPING_DISTANCE)}
          >
            Stopafstand updaten
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => navigate(e, EDIT_CALCULATIONS_OVERTAKING_DISTANCE)}
          >
            Inhaalafstand updaten
          </Button>
        </ButtonGroup>
      </PageHeading>
      {isLoading && calculations.length === 0 && <LoadingSpinner />}
      <CalculationList calculationInfos={calculations} />
    </>
  );
};

export default Calculations;

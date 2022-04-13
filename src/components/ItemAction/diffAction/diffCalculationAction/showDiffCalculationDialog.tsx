import React, { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import LoadingSpinner from '../../../LoadingSpinner';
import { DOCUMENTATION_DIFF_CHANGES } from '../../../../model/DocumentationType';
import HelpAction from '../../helpAction/HelpAction';
import { CalculationInfo } from '../../../../model/calculations/CalculationInfo';
import calculationsRepository from '../../../../firebase/database/calculationsRepository';
import DiffDialogContent from './DiffDialogContent';
import DialogTransition from '../../../dialog/DialogTransition';

interface Props {
  conceptCalculationInfo: CalculationInfo;
  setShowDiffDialog: (showDialogPage: boolean) => void;
}

const ShowDiffCalculationDialog: FC<Props> = ({
  conceptCalculationInfo,
  setShowDiffDialog,
}) => {
  const [publishedCalculationInfo, setPublishedCalculationInfo] =
    useState<CalculationInfo | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    calculationsRepository
      .getCalculationsByType(conceptCalculationInfo.calculationType, false)
      .then(setPublishedCalculationInfo)
      .catch((reason) => {
        logger.errorWithReason(
          'Failed to get calculation by id in ShowDiffCalculationDialog',
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het tonen van het verschil van de berekeningen is mislukt.`,
          })
        );
      });
  }, [conceptCalculationInfo.calculationType, dispatch]);

  const handleClose = () => {
    setShowDiffDialog(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Bekijk de wijzigingen&ensp;
        <HelpAction documentationType={DOCUMENTATION_DIFF_CHANGES} />
      </DialogTitle>
      {publishedCalculationInfo !== null ? (
        <DiffDialogContent
          conceptCalculationInfo={conceptCalculationInfo}
          publishedCalculationInfo={publishedCalculationInfo}
        />
      ) : (
        <DialogContent style={{ minHeight: 600 }}>
          <LoadingSpinner />
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDiffCalculationDialog;

import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useState,
} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import LoadingSpinner from '../../../LoadingSpinner';
import { DOCUMENTATION_DIFF_CHANGES } from '../../../../model/DocumentationType';
import HelpAction from '../../helpAction/HelpAction';
import { CalculationInfo } from '../../../../model/calculations/CalculationInfo';
import calculationsRepository from '../../../../firebase/database/calculationsRepository';
import DiffDialogContent from './DiffDialogContent';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
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

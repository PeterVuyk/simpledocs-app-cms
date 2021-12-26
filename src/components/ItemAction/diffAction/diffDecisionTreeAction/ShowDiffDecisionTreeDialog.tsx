import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import LoadingSpinner from '../../../LoadingSpinner';
import { DOCUMENTATION_DIFF_CHANGES } from '../../../../model/DocumentationType';
import HelpAction from '../../helpAction/HelpAction';
import DiffDialogContent from './DiffDialogContent';
import decisionTreeRepository from '../../../../firebase/database/decisionTreeRepository';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import DialogTransition from '../../../dialog/DialogTransition';

interface Props {
  title: string;
  onClose: () => void;
}

const ShowDiffDecisionTreeDialog: FC<Props> = ({ title, onClose }) => {
  const [decisionTree, setDecisionTree] = useState<DecisionTreeStep[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    decisionTreeRepository
      .getDecisionTreeSteps(true)
      .then(setDecisionTree)
      .catch((reason) => {
        logger.errorWithReason(
          `Failed to get decisionTreeSteps info in ShowDiffDialog`,
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het tonen van het verschil van de beslisboom is mislukt.`,
          })
        );
        onClose();
      });
  }, [dispatch, onClose, title]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Bekijk de wijzigingen&ensp;
        <HelpAction documentationType={DOCUMENTATION_DIFF_CHANGES} />
      </DialogTitle>
      {decisionTree.length !== 0 ? (
        <DiffDialogContent
          conceptDecisionTree={decisionTree.filter((value) => value.isDraft)}
          publishedDecisionTree={decisionTree.filter((value) => !value.isDraft)}
        />
      ) : (
        <DialogContent style={{ minHeight: 600 }}>
          <LoadingSpinner />
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDiffDecisionTreeDialog;

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
import DiffDialogContent from './DiffDialogContent';
import decisionTreeRepository from '../../../../firebase/database/decisionTreeRepository';
import DialogTransition from '../../../dialog/DialogTransition';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  title: string;
  onClose: () => void;
}

const ShowDiffDecisionTreeDialog: FC<Props> = ({ title, onClose }) => {
  const [decisionTree, setDecisionTree] = useState<DecisionTree[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getDecisionTree = async () => {
      const trees = await decisionTreeRepository
        .getDecisionTree(true)
        .then((value) => value.filter((tree) => tree.title === title))
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
      if (!trees || trees.length !== 2) {
        logger.error(
          `Incorrect number of decision trees found, trees found: ${
            trees
              ? `total: ${trees.length}, titles: ${trees.map(
                  (value) => value.title
                )}`
              : 'no tree found'
          }.`
        );
        onClose();
        return;
      }
      setDecisionTree(trees);
    };
    getDecisionTree();
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
          conceptDecisionTree={decisionTree.find((value) => value.isDraft)!}
          publishedDecisionTree={decisionTree.find((value) => !value.isDraft)!}
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

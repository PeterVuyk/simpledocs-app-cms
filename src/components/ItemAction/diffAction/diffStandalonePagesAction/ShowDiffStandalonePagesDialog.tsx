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
import DialogTransition from '../../../dialog/DialogTransition';
import { StandalonePage } from '../../../../model/standalonePages/StandalonePage';
import standalonePagesRepository from '../../../../firebase/database/standalonePagesRepository';
import DiffDialogContent from './DiffDialogContent';

interface Props {
  setShowDiffDialog: (showDialogPage: boolean) => void;
}

const ShowDiffStandalonePagesDialog: FC<Props> = ({ setShowDiffDialog }) => {
  const [conceptPage, setConceptPage] = useState<StandalonePage | null>(null);
  const [publishedPage, setPublishedPage] = useState<StandalonePage | null>(
    null
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([
      standalonePagesRepository.getStandalonePages().then((pages) => {
        setConceptPage(pages.find((value) => value.isDraft) ?? null);
        setPublishedPage(pages.find((value) => !value.isDraft) ?? null);
      }),
    ]).catch((reason) => {
      logger.errorWithReason(
        'Failed to get page info by id in ShowDiffPageDialog',
        reason
      );
      dispatch(
        notify({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het tonen van het verschil van de pagina is mislukt.`,
        })
      );
    });
  }, [dispatch]);

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
      {publishedPage !== null && conceptPage !== null ? (
        <DiffDialogContent
          publishedPage={publishedPage}
          conceptPage={conceptPage}
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

export default ShowDiffStandalonePagesDialog;

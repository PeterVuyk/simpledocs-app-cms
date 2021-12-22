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
import { Page } from '../../../model/Page';
import bookRepository from '../../../firebase/database/bookRepository';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';
import DiffDialogContent from './DiffDialogContent';
import LoadingSpinner from '../../LoadingSpinner';
import { DOCUMENTATION_DIFF_CHANGES } from '../../../model/DocumentationType';
import HelpAction from '../helpAction/HelpAction';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  bookType: string;
  pageId: string;
  setShowDiffDialog: (showDialogPage: boolean) => void;
}

const ShowDiffPageDialog: FC<Props> = ({
  bookType,
  pageId,
  setShowDiffDialog,
}) => {
  const [conceptPage, setConceptPage] = useState<Page | null>(null);
  const [publishedPage, setPublishedPage] = useState<Page | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = pageId.replace('-draft', '');
    Promise.all([
      bookRepository.getPageById(bookType, id).then(setPublishedPage),
      bookRepository.getPageById(bookType, `${id}-draft`).then(setConceptPage),
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
  }, [bookType, dispatch, pageId]);

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

export default ShowDiffPageDialog;

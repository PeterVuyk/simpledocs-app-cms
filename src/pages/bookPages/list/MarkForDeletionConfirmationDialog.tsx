import React, { FC, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTransition from '../../../components/dialog/DialogTransition';
import AlertBox from '../../../components/AlertBox';
import bookRepository from '../../../firebase/database/bookRepository';
import { notify } from '../../../redux/slice/notificationSlice';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import { Page } from '../../../model/Page';
import clone from '../../../helper/object/clone';

interface Props {
  page: Page;
  onSubmit: () => Promise<void>;
  onClose: () => void;
  bookType: string;
}

const MarkForDeletionConfirmationDialog: FC<Props> = ({
  onSubmit,
  onClose,
  page,
  bookType,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    setSubmitting(true);
    // Copy page to draft. (remove 'markForDeletion' from 'copy', set index op -timestamp).
    const conceptPage = clone(page) as Page;
    conceptPage.markedForDeletion = false;
    conceptPage.isDraft = true;
    conceptPage.id = `${page.id!.replaceAll('-draft', '')}-draft`;
    conceptPage.pageIndex = -Date.now();
    return bookRepository
      .updatePage(bookType, conceptPage)
      .then(onSubmit)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage:
              'Een kopie-pagina van het gemarkeerd voor verwijdering pagina is aangemaakt.',
          })
        )
      )
      .catch((reason) =>
        logger.errorWithReason(
          `Failed copy and save page from removing the mark for deletion from the page id${page.id}`,
          reason
        )
      );
  };

  return (
    <Dialog
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => !submitting && onClose()}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Markering voor verwijdering opheffen
      </DialogTitle>
      <DialogContent>
        Je wil de wijzigingen ongedaan maken en de markering opheffen. Door een
        tussentijdse gedane wijzigingen in de pagina sortering is de volgorde
        gewijzigd. Hiermee is de positie van deze pagina inmiddels toegewezen
        aan een andere pagina. Klik op bevestigen om ter vervanging een concept
        pagina te maken waarbij de pagina positie bovenaan is (na de bevestiging
        kan je de pagina positie nog wijzigen).
      </DialogContent>
      {submitting && (
        <AlertBox severity="info" message="Een moment geduld..." />
      )}
      <DialogActions>
        <Button
          disabled={submitting}
          onClick={onClose}
          color="primary"
          variant="contained"
        >
          Terug
        </Button>
        <Button
          disabled={submitting}
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
        >
          Bevestigen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkForDeletionConfirmationDialog;

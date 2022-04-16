import React, { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Paper } from '@mui/material';
import { DropResult } from 'react-beautiful-dnd';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTransition from '../../../components/dialog/DialogTransition';
import DraggableList from './DraggableList';
import reorder from './reorder';
import bookRepository from '../../../firebase/database/bookRepository';
import { Page } from '../../../model/Page';
import AlertBox from '../../../components/AlertBox';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';
import logger from '../../../helper/logger';

interface Props {
  openDialog: boolean;
  setOpenDialog: (showDialog: boolean) => void;
  bookType: string;
  onReloadPages: () => void;
}

const SortBookPagesDialog: FC<Props> = ({
  openDialog,
  setOpenDialog,
  onReloadPages,
  bookType,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [pages, setPages] = useState<Page[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    bookRepository
      .getAllPages(bookType)
      .then((items) =>
        items
          .filter((item) => item.markedForDeletion !== true)
          .sort((a, b) => a.pageIndex - b.pageIndex)
      )
      .then(setPages);
  }, [bookType]);

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    const newItems = reorder(pages, source.index, destination.index);
    setPages(newItems);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    return Promise.all(
      pages
        .filter((value, index) => {
          if (value.pageIndex === index) {
            return false;
          }
          value.pageIndex = index;
          return true;
        })
        .map(async (value) => {
          value.id = `${value?.id?.replaceAll('-draft', '')}-draft`;
          value.isDraft = true;
          return bookRepository.updatePage(bookType, value);
        })
    )
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `De pagina volgorde is bijgewerkt.`,
          })
        )
      )
      .then(onReloadPages)
      .catch((error) => {
        logger.errorWithReason(
          `Update order of 1 or more pages has failed for handleSubmit bookType ${bookType}`,
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het wijzigen van de volgorde van 1 of meerdere pagina's is mislukt, neem contact op met de beheerder.`,
          })
        );
      })
      .then(() => setSubmitting(false));
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={openDialog}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => !submitting && handleClose()}
    >
      <DialogTitle id="alert-dialog-slide-title">
        {`Volgorde pagina's wijzigen`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          {`Wijzig hier de volgorde van de pagina's door het slepen van de items. Voor alle pagina's die een positie opschuift wordt een 'concept pagina' aangemaakt. Na het publiceren worden de gedane aanpassingen doorgevoerd.`}
        </DialogContentText>
        {submitting && (
          <AlertBox severity="info" message="Een moment geduld..." />
        )}
        <Paper elevation={2} style={{ margin: 16 }}>
          <DraggableList
            submitting={submitting}
            pages={pages}
            onDragEnd={onDragEnd}
          />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={submitting}
          onClick={handleClose}
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
          Wijzigen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SortBookPagesDialog;

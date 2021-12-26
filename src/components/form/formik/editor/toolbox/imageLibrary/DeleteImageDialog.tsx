import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import AlertBox from '../../../../../AlertBox';
import deleteImageFromCategory from '../../../../../../firebase/storage/deleteImageFromCategory';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';
import DialogTransition from '../../../../../dialog/DialogTransition';

interface Props {
  onCloseDialog: () => void;
  imageInfo: ImageInfo;
  handleLoadImages: () => void;
}

const DeleteImageDialog: FC<Props> = ({
  handleLoadImages,
  onCloseDialog,
  imageInfo,
}) => {
  const [isRemoving, setRemoving] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    setRemoving(true);
    deleteImageFromCategory(imageInfo)
      .then(onCloseDialog)
      .then(handleLoadImages)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De afbeelding is verwijderd.',
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          'Failed removing image in DeleteImageDialog.handleDelete',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het verwijderen van de afbeelding is mislukt.`,
          })
        );
        setRemoving(false);
      });
  };

  return (
    <Dialog
      fullWidth
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => !isRemoving && onCloseDialog()}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Afbeelding verwijderen
      </DialogTitle>
      <DialogContent>
        {isRemoving && (
          <AlertBox severity="info" message="Een moment geduld..." />
        )}
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          Weet je zeker dat je de afbeelding {imageInfo.filename} wilt
          verwijderen?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseDialog}
          color="primary"
          variant="contained"
          disabled={isRemoving}
        >
          Annuleren
        </Button>
        <Button
          onClick={handleDelete}
          color="secondary"
          variant="contained"
          disabled={isRemoving}
        >
          Verwijderen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteImageDialog;

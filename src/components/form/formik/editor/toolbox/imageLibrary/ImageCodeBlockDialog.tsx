import React, { FC } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import ImageCodeBlockView from '../uploadImage/ImageCodeBlockView/ImageCodeBlockView';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import { ContentType } from '../../../../../../model/ContentType';
import DialogTransition from '../../../../../dialog/DialogTransition';

interface Props {
  contentType: ContentType;
  imageInfo: ImageInfo;
  onCloseDialog: () => void;
  onCloseAllDialogs: () => void;
}

const ImageCodeBlockDialog: FC<Props> = ({
  contentType,
  onCloseDialog,
  onCloseAllDialogs,
  imageInfo,
}) => {
  return (
    <Dialog
      fullWidth
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onCloseDialog}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Afbeelding gebruiken
      </DialogTitle>
      <ImageCodeBlockView
        contentType={contentType}
        imageInfo={imageInfo}
        onCloseDialog={onCloseAllDialogs}
      />
    </Dialog>
  );
};

export default ImageCodeBlockDialog;

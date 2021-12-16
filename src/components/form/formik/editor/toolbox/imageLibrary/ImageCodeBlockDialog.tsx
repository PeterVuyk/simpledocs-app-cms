import React, { FC, forwardRef, ReactElement, Ref } from 'react';
import { Dialog, DialogTitle, Slide } from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import ImageCodeBlockView from '../uploadImage/ImageCodeBlockView/ImageCodeBlockView';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import { ContentType } from '../../../../../../model/artifacts/Artifact';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseDialog}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
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

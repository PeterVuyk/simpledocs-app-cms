import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CategoryList from './CategoryList';
import ImageViewer from './ImageViewer';
import { ContentType } from '../../../../../../model/ContentType';
import {
  DOCUMENTATION_IMAGE_LIBRARY,
  DocumentationType,
} from '../../../../../../model/DocumentationType';
import HelpAction from '../../../../../ItemAction/helpAction/HelpAction';
import DialogTransition from '../../../../../dialog/DialogTransition';
import { ImageLibraryType } from '../../../../../../model/imageLibrary/ImageLibraryType';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';

interface Props {
  onCloseDialog: () => void;
  contentType?: ContentType;
  imageLibraryType: ImageLibraryType;
  clickCallback?: (imageInfo: ImageInfo) => void;
  documentationType: DocumentationType;
  title: string;
}

const ImageLibraryDialog: FC<Props> = ({
  onCloseDialog,
  contentType,
  imageLibraryType,
  clickCallback,
  documentationType,
  title,
}) => {
  const [currentCategory, setCurrentCategory] = useState<string>('');

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onCloseDialog}
    >
      <DialogTitle id="alert-dialog-slide-title">
        {title}&ensp;
        <HelpAction documentationType={documentationType} />
      </DialogTitle>
      <DialogContent>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <CategoryList
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            imageLibraryType={imageLibraryType}
          />
          <ImageViewer
            category={currentCategory}
            onCloseDialog={onCloseDialog}
            contentType={contentType}
            clickCallback={clickCallback}
            imageLibraryType={imageLibraryType}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageLibraryDialog;

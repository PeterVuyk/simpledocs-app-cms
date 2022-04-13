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
import { DOCUMENTATION_IMAGE_LIBRARY } from '../../../../../../model/DocumentationType';
import HelpAction from '../../../../../ItemAction/helpAction/HelpAction';
import DialogTransition from '../../../../../dialog/DialogTransition';

interface Props {
  onCloseDialog: () => void;
  contentType: ContentType;
}

const ImageLibraryDialog: FC<Props> = ({ onCloseDialog, contentType }) => {
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
        Afbeeldingen bibliotheek&ensp;
        <HelpAction documentationType={DOCUMENTATION_IMAGE_LIBRARY} />
      </DialogTitle>
      <DialogContent>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <CategoryList
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
          />
          <ImageViewer
            category={currentCategory}
            onCloseDialog={onCloseDialog}
            contentType={contentType}
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

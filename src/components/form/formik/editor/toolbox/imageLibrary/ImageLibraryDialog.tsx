import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CategoryList from './CategoryList';
import ImageViewer from './ImageViewer';
import { ContentType } from '../../../../../../model/ContentType';
import { DOCUMENTATION_IMAGE_LIBRARY } from '../../../../../../model/DocumentationType';
import HelpAction from '../../../../../ItemAction/helpAction/HelpAction';
import DialogTransition from '../../../../../dialog/DialogTransition';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      flexDirection: 'row',
      display: 'flex',
    },
  })
);

interface Props {
  onCloseDialog: () => void;
  contentType: ContentType;
}

const ImageLibraryDialog: FC<Props> = ({ onCloseDialog, contentType }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const classes = useStyles();

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
        <div className={classes.container}>
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

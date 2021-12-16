import React, { FC, forwardRef, ReactElement, Ref, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CategoryList from './CategoryList';
import ImageViewer from './ImageViewer';
import { ContentType } from '../../../../../../model/artifacts/Artifact';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseDialog}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Afbeeldingen bibliotheek
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

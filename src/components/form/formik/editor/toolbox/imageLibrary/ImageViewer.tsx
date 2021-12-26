import React, { FC, useCallback, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import getAllImagesFromCategory from '../../../../../../firebase/storage/getAllImagesFromCategory';
import LoadingSpinner from '../../../../../LoadingSpinner';
import ImageCodeBlockDialog from './ImageCodeBlockDialog';
import { ContentType } from '../../../../../../model/artifacts/Artifact';
import DeleteImageDialog from './DeleteImageDialog';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 5,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      padding: 5,
      backgroundColor: '#616161',
      width: 1000,
      height: 600,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  })
);

interface Props {
  onCloseDialog: () => void;
  contentType: ContentType;
  category: string;
}

const ImageViewer: FC<Props> = ({ category, onCloseDialog, contentType }) => {
  const [imagesInfo, setImagesInfo] = useState<ImageInfo[] | null>([]);
  const [showCodeBlockImageDialog, setShowCodeBlockImageDialog] =
    useState<ImageInfo | null>(null);
  const [showDeleteImageDialog, setShowDeleteImageDialog] =
    useState<ImageInfo | null>(null);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const handleLoadImages = useCallback(() => {
    setImagesInfo([]);
    getAllImagesFromCategory(category)
      .then((value) => setImagesInfo(value.length === 0 ? null : value))
      .catch((error) => {
        logger.errorWithReason(
          'Failed to collect images for the image library in imageViewer.handleLoadImages',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het is mislukt om de afbeeldingen op te halen, probeer het later opnieuw.`,
          })
        );
      });
  }, [category, dispatch]);

  useEffect(() => {
    handleLoadImages();
  }, [category, handleLoadImages]);

  return (
    <div className={classes.root}>
      {imagesInfo !== null && imagesInfo.length === 0 && <LoadingSpinner />}
      <ImageList cols={3} rowHeight={180} className={classes.imageList}>
        {imagesInfo !== null &&
          imagesInfo.map((item) => (
            <ImageListItem
              key={item.downloadUrl}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowCodeBlockImageDialog(item)}
            >
              <img src={item.downloadUrl} alt={item.filename} />
              <ImageListItemBar
                title={item.filename}
                actionIcon={
                  <IconButton
                    className={classes.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteImageDialog(item);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
      </ImageList>
      {showCodeBlockImageDialog !== null && (
        <ImageCodeBlockDialog
          imageInfo={showCodeBlockImageDialog}
          contentType={contentType}
          onCloseDialog={() => setShowCodeBlockImageDialog(null)}
          onCloseAllDialogs={() => {
            setShowCodeBlockImageDialog(null);
            onCloseDialog();
          }}
        />
      )}
      {showDeleteImageDialog !== null && (
        <DeleteImageDialog
          handleLoadImages={handleLoadImages}
          imageInfo={showDeleteImageDialog}
          onCloseDialog={() => {
            setShowDeleteImageDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default ImageViewer;

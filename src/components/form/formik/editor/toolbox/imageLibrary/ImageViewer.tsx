import React, { FC, useCallback, useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import getAllImagesFromCategory from '../../../../../../firebase/storage/getAllImagesFromCategory';
import LoadingSpinner from '../../../../../LoadingSpinner';
import ImageCodeBlockDialog from './ImageCodeBlockDialog';
import { ContentType } from '../../../../../../model/ContentType';
import DeleteImageDialog from './DeleteImageDialog';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';

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
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      {imagesInfo !== null && imagesInfo.length === 0 && (
        <LoadingSpinner color="secondary" />
      )}
      <ImageList
        cols={3}
        rowHeight={180}
        style={{
          padding: 5,
          backgroundColor: '#616161',
          width: 1000,
          height: 600,
        }}
      >
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
                    style={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteImageDialog(item);
                    }}
                    size="large"
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
    </Box>
  );
};

export default ImageViewer;

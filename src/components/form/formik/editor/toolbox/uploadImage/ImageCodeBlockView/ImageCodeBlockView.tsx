import React, { FC } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import Highlight from 'react-highlight';
import {
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../../../../../../model/artifacts/Artifact';
import utilHelper from '../../../../../../../helper/utilHelper';
import { ImageInfo } from '../../../../../../../model/imageLibrary/ImageInfo';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

interface Props {
  contentType: ContentType;
  onCloseDialog: () => void;
  imageInfo: ImageInfo;
}

const ImageCodeBlockView: FC<Props> = ({
  onCloseDialog,
  contentType,
  imageInfo,
}) => {
  const getImageAlt = () => {
    return imageInfo.filename
      .replace('-', ' ')
      .replace('_', ' ')
      .split('.')
      .slice(0, -1)
      .join('.');
  };

  const getImageHtmlCode = () => {
    if (contentType === CONTENT_TYPE_MARKDOWN) {
      return pretty(`![${getImageAlt()}](${imageInfo.downloadUrl})`);
    }
    return pretty(
      `<img src="${imageInfo.downloadUrl}" alt="${getImageAlt()}">`
    );
  };

  return (
    <>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          Gebruik deze snippet om naar de afbeelding te refereren.
        </DialogContentText>
        <Highlight className="markdown">{getImageHtmlCode()}</Highlight>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog} color="primary" variant="contained">
          Sluiten
        </Button>
        <Button
          onClick={() => {
            utilHelper.copyText(getImageHtmlCode());
            onCloseDialog();
          }}
          color="secondary"
          variant="contained"
        >
          Kopiëren en sluiten
        </Button>
      </DialogActions>
    </>
  );
};

export default ImageCodeBlockView;

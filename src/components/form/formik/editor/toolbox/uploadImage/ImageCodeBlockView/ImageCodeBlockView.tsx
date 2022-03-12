import React, { FC, useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@material-ui/core';
import Highlight from 'react-highlight';
import utilHelper from '../../../../../../../helper/utilHelper';
import { ImageInfo } from '../../../../../../../model/imageLibrary/ImageInfo';
import {
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../../../../../../model/ContentType';

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
  const [altText, setAltText] = useState<string>(
    imageInfo.filename
      .replaceAll('-', ' ')
      .replaceAll('_', ' ')
      .split('.')
      .slice(0, -1)
      .join('.')
  );

  const handleAltTextChange = (text: string) => {
    setAltText(text.replaceAll('"', ' '));
  };

  const getImageHtmlCode = () => {
    if (contentType === CONTENT_TYPE_MARKDOWN) {
      return `![${altText}](${imageInfo.downloadUrl})`;
    }
    return `<img src="${imageInfo.downloadUrl}" alt="${altText}">`;
  };

  return (
    <>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          Gebruik deze snippet om naar de afbeelding te refereren. Geef indien
          gewenst een alternatieve tekst op als het laden van de afbeelding
          mislukt is, gebruik hiervoor geen speciale karakters of tekens.
        </DialogContentText>
        <br />
        <TextField
          fullWidth
          variant="outlined"
          onChange={(event) => handleAltTextChange(event.target.value)}
          required
          value={altText}
          id="altText"
          label="Alternatieve tekst"
          name="altText"
          autoFocus
        />
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

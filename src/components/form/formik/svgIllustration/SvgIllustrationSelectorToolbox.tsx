import React, { FC, useState } from 'react';
import { ButtonGroup, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { CloudUpload } from '@mui/icons-material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Page } from '../../../../model/Page';
import ImageUploadDialog from '../editor/toolbox/uploadImage/ImageUploadDialog';
import { DOCUMENTATION_ICON_LIBRARY } from '../../../../model/DocumentationType';
import { IMAGE_LIBRARY_ICONS } from '../../../../model/imageLibrary/ImageLibraryType';
import { ImageInfo } from '../../../../model/imageLibrary/ImageInfo';
import ImageLibraryDialog from '../editor/toolbox/imageLibrary/ImageLibraryDialog';

interface Props {
  page: Page | undefined;
  isSubmitting: boolean;
  onIconChange: (file: string | null) => void;
}

const SvgIllustrationSelectorToolbox: FC<Props> = ({
  page,
  isSubmitting,
  onIconChange,
}) => {
  const [showImageUploadDialog, setShowImageUploadDialog] =
    useState<boolean>(false);
  const [showImageLibraryDialog, setShowImageLibraryDialog] =
    useState<boolean>(false);

  const handleFileUpload = (imageInfo: ImageInfo) => {
    if (imageInfo.image) {
      onIconChange(imageInfo.image);
    }
  };

  return (
    <ButtonGroup style={{ position: 'absolute', right: 10, bottom: 10 }}>
      <Tooltip disableInteractive title="Verwijder illustratie">
        <Button
          variant="contained"
          color="inherit"
          onClick={() => onIconChange(null)}
          disabled={!page?.iconFile || isSubmitting}
        >
          <DeleteTwoToneIcon style={{ cursor: 'pointer' }} />
        </Button>
      </Tooltip>
      <Tooltip disableInteractive title="Illustratie bibliotheek">
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setShowImageLibraryDialog(true)}
          disabled={isSubmitting}
        >
          <PhotoLibraryIcon />
        </Button>
      </Tooltip>
      {showImageLibraryDialog && (
        <ImageLibraryDialog
          onCloseDialog={() => setShowImageLibraryDialog(false)}
          documentationType={DOCUMENTATION_ICON_LIBRARY}
          title="Illustratie bibliotheek"
          imageLibraryType={IMAGE_LIBRARY_ICONS}
          clickCallback={handleFileUpload}
        />
      )}
      <Tooltip disableInteractive title="Illustratie uploaden">
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setShowImageUploadDialog(true)}
          disabled={isSubmitting}
        >
          <CloudUpload />
        </Button>
      </Tooltip>
      {showImageUploadDialog && (
        <ImageUploadDialog
          onCloseDialog={() => setShowImageUploadDialog(false)}
          title="Illustratie uploaden"
          documentationType={DOCUMENTATION_ICON_LIBRARY}
          dialogContentText="Voeg een SVG bestand toe aan het archief waarna je deze via de afbeeldingen bibliotheek kan gebruiken."
          allowedMimeTypes={['image/svg+xml']}
          imageLibraryType={IMAGE_LIBRARY_ICONS}
          uploadCallback={handleFileUpload}
        />
      )}
    </ButtonGroup>
  );
};

export default SvgIllustrationSelectorToolbox;

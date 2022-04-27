import React, { FC } from 'react';
import { ButtonGroup, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { CloudUpload } from '@mui/icons-material';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Page } from '../../../../model/Page';

interface Props {
  page: Page | undefined;
  isSubmitting: boolean;
}

const SvgIllustrationSelectorToolbox: FC<Props> = ({ page, isSubmitting }) => {
  const handleDelete = () => {
    // TODO: Add delete functionality
  };

  const handleDownload = () => {
    // TODO: Add download functionality
  };

  return (
    <ButtonGroup style={{ position: 'absolute', right: 10, bottom: 10 }}>
      <Tooltip disableInteractive title="Verwijder illustratie">
        <Button
          variant="contained"
          color="inherit"
          onClick={handleDelete}
          disabled={!page?.iconFile || isSubmitting}
        >
          <DeleteTwoToneIcon style={{ cursor: 'pointer' }} />
        </Button>
      </Tooltip>
      <Tooltip disableInteractive title="Download illustratie">
        <Button
          variant="contained"
          color="inherit"
          onClick={handleDownload}
          disabled={!page?.iconFile || isSubmitting}
        >
          <GetAppIcon style={{ cursor: 'pointer' }} />
        </Button>
      </Tooltip>
      <Tooltip disableInteractive title="Afbeeldingen bibliotheek">
        <Button
          variant="contained"
          color="inherit"
          onClick={() => console.log('TODO: add open library functionality')}
          disabled={isSubmitting}
        >
          <PhotoLibraryIcon />
        </Button>
      </Tooltip>
      <Tooltip disableInteractive title="Illustratie uploaden">
        <Button
          variant="contained"
          color="inherit"
          onClick={() =>
            console.log('TODO: Add upload illustration functionality')
          }
          disabled={isSubmitting}
        >
          <CloudUpload />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export default SvgIllustrationSelectorToolbox;

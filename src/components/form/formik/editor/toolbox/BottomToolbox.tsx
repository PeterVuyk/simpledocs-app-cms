import React, { FC, useEffect, useState } from 'react';
import { ButtonGroup, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import StyleIcon from '@material-ui/icons/Style';
import { CloudUpload } from '@material-ui/icons';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import LinkIcon from '@material-ui/icons/Link';
import TemplateMenu from './TemplateMenu';
import logger from '../../../../../helper/logger';
import {
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
} from '../../../../../model/artifacts/ArtifactType';
import { ContentType } from '../../../../../model/ContentType';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';
import SnippetsDialogButton from './SnippetsDialogButton';
import ImageUploadDialog from './uploadImage/ImageUploadDialog';
import ImageLibraryDialog from './imageLibrary/ImageLibraryDialog';
import CreateLinkPageDialog from './CreateLinkPage/CreateLinkPageDialog';
import { Artifact } from '../../../../../model/artifacts/Artifact';

interface Props {
  onUpdateFile: (file: any) => void;
  contentType: ContentType;
}

const BottomToolbox: FC<Props> = ({ contentType, onUpdateFile }) => {
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [templateMenu, setTemplateMenu] = useState<null | HTMLElement>(null);
  const [showImageUploadDialog, setShowImageUploadDialog] =
    useState<boolean>(false);
  const [showImageLibraryDialog, setShowImageLibraryDialog] =
    useState<boolean>(false);
  const [showCreateLinkDialog, setShowCreateLinkDialog] =
    useState<boolean>(false);

  useEffect(() => {
    artifactsRepository
      .getArtifactsByCategories([ARTIFACT_TYPE_SNIPPET, ARTIFACT_TYPE_TEMPLATE])
      .then(setArtifacts)
      .catch((reason) =>
        logger.errorWithReason(
          'Failed collecting snippets and templates from artifactsRepository.getArtifactsByCategories for the BottomHtmlToolbox component',
          reason
        )
      );
  }, []);

  const openTemplateMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTemplateMenu(event.currentTarget);
  };

  if (artifacts === null) {
    return null;
  }

  return (
    <ButtonGroup>
      <Tooltip title="Aanmaken link pagina">
        <Button
          variant="contained"
          onClick={() => setShowCreateLinkDialog(true)}
        >
          <LinkIcon />
        </Button>
      </Tooltip>
      {showCreateLinkDialog && (
        <CreateLinkPageDialog
          onCloseDialog={() => setShowCreateLinkDialog(false)}
          contentType={contentType}
        />
      )}
      <Tooltip title="Afbeeldingen bibliotheek">
        <Button
          variant="contained"
          onClick={() => setShowImageLibraryDialog(true)}
        >
          <PhotoLibraryIcon />
        </Button>
      </Tooltip>
      {showImageLibraryDialog && (
        <ImageLibraryDialog
          onCloseDialog={() => setShowImageLibraryDialog(false)}
          contentType={contentType}
        />
      )}
      <Tooltip title="Afbeelding uploaden">
        <Button
          variant="contained"
          onClick={() => setShowImageUploadDialog(true)}
        >
          {/*  TODO: Later change icon to 'FileUpload' when updating MUI */}
          <CloudUpload />
        </Button>
      </Tooltip>
      {showImageUploadDialog && (
        <ImageUploadDialog
          contentType={contentType}
          onCloseDialog={() => setShowImageUploadDialog(false)}
        />
      )}
      {artifacts && (
        <SnippetsDialogButton
          artifacts={artifacts.filter(
            (value) =>
              value.type === ARTIFACT_TYPE_SNIPPET &&
              value.contentType === contentType
          )}
        />
      )}
      <Tooltip title="Template gebruiken">
        <Button variant="contained" onClick={openTemplateMenu}>
          <StyleIcon />
        </Button>
      </Tooltip>
      <TemplateMenu
        contentType={contentType}
        templateMenu={templateMenu}
        setTemplateMenu={setTemplateMenu}
        onUpdateFile={onUpdateFile}
        templates={artifacts.filter(
          (value) => value.type === ARTIFACT_TYPE_TEMPLATE
        )}
      />
    </ButtonGroup>
  );
};

export default BottomToolbox;

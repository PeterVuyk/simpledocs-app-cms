import React, { FC, useEffect, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import StyleIcon from '@material-ui/icons/Style';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TemplateMenu from './TemplateMenu';
import logger from '../../../../../helper/logger';
import {
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
} from '../../../../../model/artifacts/ArtifactType';
import { Artifact, ContentType } from '../../../../../model/artifacts/Artifact';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';
import SnippetsDialogButton from './SnippetsDialogButton';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginLeft: 8,
    },
  })
);

interface Props {
  onUpdateFile: (file: any) => void;
  contentType: ContentType;
}

const BottomToolbox: FC<Props> = ({ contentType, onUpdateFile }) => {
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [templateMenu, setTemplateMenu] = useState<null | HTMLElement>(null);
  const classes = useStyles();

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
    <>
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
        <Button
          className={classes.button}
          variant="contained"
          onClick={openTemplateMenu}
        >
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
    </>
  );
};

export default BottomToolbox;

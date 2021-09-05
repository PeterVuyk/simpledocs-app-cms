import React, { FC, useEffect, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import StyleIcon from '@material-ui/icons/Style';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import HtmlTemplateMenu from './HtmlTemplateMenu';
import HtmlSnippetsMenu from './HtmlSnippetsMenu';
import logger from '../../../../../helper/logger';
import {
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
} from '../../../../../model/ArtifactType';
import { Artifact } from '../../../../../model/Artifact';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginLeft: 8,
    },
  })
);

interface Props {
  onUpdateFile: (file: any) => void;
}

const BottomHtmlToolbox: FC<Props> = ({ onUpdateFile }) => {
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [snippetsMenu, setSnippetsMenu] = useState<null | HTMLElement>(null);
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

  const openHtmlTemplateMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTemplateMenu(event.currentTarget);
  };

  const openHtmlSnippetsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSnippetsMenu(event.currentTarget);
  };

  if (artifacts === null) {
    return null;
  }

  return (
    <>
      <Tooltip title="Snippets gebruiken">
        <Button
          className={classes.button}
          variant="contained"
          onClick={openHtmlSnippetsMenu}
        >
          <LoyaltyIcon />
        </Button>
      </Tooltip>
      <HtmlSnippetsMenu
        snippetsMenu={snippetsMenu}
        setSnippetsMenu={setSnippetsMenu}
        snippets={artifacts.filter(
          (value) => value.type === ARTIFACT_TYPE_SNIPPET
        )}
      />
      <Tooltip title="Template gebruiken">
        <Button
          className={classes.button}
          variant="contained"
          onClick={openHtmlTemplateMenu}
        >
          <StyleIcon />
        </Button>
      </Tooltip>
      <HtmlTemplateMenu
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

export default BottomHtmlToolbox;

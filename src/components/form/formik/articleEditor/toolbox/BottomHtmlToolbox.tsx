import React, { FC, useEffect, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import StyleIcon from '@material-ui/icons/Style';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import HtmlTemplateMenu from './HtmlTemplateMenu';
import HtmlSnippetsMenu from './HtmlSnippetsMenu';
import htmlFileInfoRepository from '../../../../../firebase/database/htmlFileInfoRepository';
import {
  HTML_FILE_CATEGORY_SNIPPET,
  HTML_FILE_CATEGORY_TEMPLATE,
} from '../../../../../model/HtmlFileCategory';
import logger from '../../../../../helper/logger';
import { HtmlFileInfo } from '../../../../../model/HtmlFileInfo';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginLeft: 8,
    },
  })
);

interface Props {
  updateFileHandler: (file: any) => void;
}

const BottomHtmlToolbox: FC<Props> = ({ updateFileHandler }) => {
  const [htmlInfos, setHtmlInfos] = useState<HtmlFileInfo[] | null>(null);
  const [snippetsMenu, setSnippetsMenu] = useState<null | HTMLElement>(null);
  const [templateMenu, setTemplateMenu] = useState<null | HTMLElement>(null);
  const classes = useStyles();

  useEffect(() => {
    htmlFileInfoRepository
      .getHtmlInfoByCategories([
        HTML_FILE_CATEGORY_SNIPPET,
        HTML_FILE_CATEGORY_TEMPLATE,
      ])
      .then(setHtmlInfos)
      .catch((reason) =>
        logger.errorWithReason(
          'Failed collecting the html snippets and templates from htmlFileInfoRepository.getHtmlInfoByCategories for the BottomHtmlToolbox component',
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

  if (htmlInfos === null) {
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
        snippets={htmlInfos.filter(
          (value) => value.htmlFileCategory === HTML_FILE_CATEGORY_SNIPPET
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
        updateFileHandler={updateFileHandler}
        templates={htmlInfos.filter(
          (value) => value.htmlFileCategory === HTML_FILE_CATEGORY_TEMPLATE
        )}
      />
    </>
  );
};

export default BottomHtmlToolbox;

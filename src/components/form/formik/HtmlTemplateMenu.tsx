import React, { useEffect, FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from '@material-ui/core';
import { HtmlFileInfo } from '../../../model/HtmlFileInfo';
import htmlTemplateRepository from '../../../firebase/database/htmlTemplateRepository';
import logger from '../../../helper/logger';

interface Props {
  updateFileHandler: (content: string) => void;
  templateMenu: HTMLElement | null;
  setTemplateMenu: (templateMenu: null | HTMLElement) => void;
}

const HtmlTemplateMenu: FC<Props> = ({
  updateFileHandler,
  templateMenu,
  setTemplateMenu,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [templates, setTemplates] = React.useState<HtmlFileInfo[] | null>(null);

  useEffect(() => {
    htmlTemplateRepository
      .getHtmlTemplates()
      .then(setTemplates)
      .catch((reason) =>
        logger.errorWithReason(
          'Failed collecting the html templates from htmlTemplateRepository.getHtmlTemplates for the HtmlTemplateMenu component',
          reason
        )
      );
  }, []);

  const handleChange = (event: React.MouseEvent<HTMLLIElement>) => {
    setTemplateMenu(null);
    const template = templates!.find(
      (value) => value.id === event.currentTarget.id
    );

    if (template) {
      updateFileHandler(template.htmlFile);
    }
  };

  if (!templateMenu) {
    return null;
  }

  return (
    <Menu
      id="article-download-menu"
      anchorEl={templateMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(setTemplateMenu)}
      onClose={() => setTemplateMenu(null)}
    >
      {templates &&
        templates.map((template) => (
          <MenuItem
            id={template.id}
            key={template.id!.toString()}
            onClick={handleChange}
          >
            {template.title}
          </MenuItem>
        ))}
    </Menu>
  );
};

export default HtmlTemplateMenu;

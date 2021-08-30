import React, { useEffect, FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from '@material-ui/core';
import { HtmlFileInfo } from '../../../model/HtmlFileInfo';
import logger from '../../../helper/logger';
import htmlFileInfoRepository from '../../../firebase/database/htmlFileInfoRepository';
import { HTML_FILE_CATEGORY_TEMPLATE } from '../../../model/HtmlFileCategory';

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
    htmlFileInfoRepository
      .getHtmlInfoByCategories([HTML_FILE_CATEGORY_TEMPLATE])
      .then(setTemplates)
      .catch((reason) =>
        logger.errorWithReason(
          'Failed collecting the html templates from htmlFileInfoRepository.getHtmlTemplates for the HtmlTemplateMenu component',
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
      id="template-menu"
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

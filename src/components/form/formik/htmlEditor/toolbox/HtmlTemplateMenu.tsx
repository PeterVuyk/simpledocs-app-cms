import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from '@material-ui/core';
import { HtmlFileInfo } from '../../../../../model/HtmlFileInfo';

interface Props {
  onUpdateFile: (content: string) => void;
  templateMenu: HTMLElement | null;
  setTemplateMenu: (templateMenu: null | HTMLElement) => void;
  templates: HtmlFileInfo[];
}

const HtmlTemplateMenu: FC<Props> = ({
  onUpdateFile,
  templateMenu,
  setTemplateMenu,
  templates,
}) => {
  const handleChange = (event: React.MouseEvent<HTMLLIElement>) => {
    setTemplateMenu(null);
    const template = templates!.find(
      (value) => value.id === event.currentTarget.id
    );

    if (template) {
      onUpdateFile(template.htmlFile);
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

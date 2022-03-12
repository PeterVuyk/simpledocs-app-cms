import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from '@material-ui/core';
import { ContentType } from '../../../../../model/ContentType';
import { Artifact } from '../../../../../model/artifacts/Artifact';

interface Props {
  contentType: ContentType;
  onUpdateFile: (content: string) => void;
  templateMenu: HTMLElement | null;
  setTemplateMenu: (templateMenu: null | HTMLElement) => void;
  templates: Artifact[];
}

const TemplateMenu: FC<Props> = ({
  contentType,
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
      onUpdateFile(template.content);
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
        templates
          .filter((value) => value.contentType === contentType)
          .map((template) => (
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

export default TemplateMenu;

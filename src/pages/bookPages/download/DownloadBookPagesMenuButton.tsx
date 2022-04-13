import React, { FC, useState } from 'react';
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Tooltip } from '@mui/material';
import { EditStatus } from '../../../model/EditStatus';
import { PageInfo } from '../../../model/Page';
import exportBookPages from './exportBookPages';

interface Props {
  editStatus: EditStatus;
  pages: PageInfo[];
  bookType: string;
}

const DownloadBookPagesMenuButton: FC<Props> = ({
  editStatus,
  pages,
  bookType,
}) => {
  const [downloadMenuElement, setDownloadMenuElement] =
    useState<null | HTMLElement>(null);
  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const exportCsvFile = () => {
    exportBookPages.csvFile(pages, editStatus, `${bookType}-${editStatus}.csv`);
  };

  const exportContentFiles = () => {
    exportBookPages.exportContent(
      pages,
      `${bookType}-${editStatus}-content.zip`
    );
  };

  const exportIcons = () => {
    exportBookPages.icons(pages, `${bookType}-${editStatus}--illustraties.zip`);
  };

  return (
    <>
      <Tooltip disableInteractive title="Batch download">
        <Button variant="contained" color="inherit" onClick={openDownloadMenu}>
          <GetAppIcon color="action" />
        </Button>
      </Tooltip>
      <Menu
        id="page-download-menu"
        anchorEl={downloadMenuElement}
        keepMounted
        open={Boolean(downloadMenuElement)}
        onClose={() => setDownloadMenuElement(null)}
      >
        <MenuItem key="csv" onClick={exportCsvFile}>
          {bookType}-{editStatus}.csv
        </MenuItem>
        <MenuItem key="content" onClick={exportContentFiles}>
          {bookType}-{editStatus}-content.zip
        </MenuItem>
        <MenuItem key="icon" onClick={exportIcons}>
          {bookType}-{editStatus}-illustraties.zip
        </MenuItem>
      </Menu>
    </>
  );
};

export default DownloadBookPagesMenuButton;

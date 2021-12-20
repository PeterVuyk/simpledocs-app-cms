import React, { FC, useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { Tooltip } from '@material-ui/core';
import { EditStatus } from '../../../model/EditStatus';
import { PageInfo } from '../../../model/Page';
import exportBookPages from './exportBookPages';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

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
  const classes = useStyles();

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
      <Tooltip title="Batch download">
        <Button
          className={classes.button}
          variant="contained"
          onClick={openDownloadMenu}
        >
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

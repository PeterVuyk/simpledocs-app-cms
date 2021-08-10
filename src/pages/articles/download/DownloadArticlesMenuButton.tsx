import React, { FC, useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { Tooltip } from '@material-ui/core';
import { EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import { BookType } from '../../../model/BookType';
import exportArticles from './exportArticles';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  editStatus: EditStatus;
  articles: Article[];
  bookType: BookType;
}

const DownloadArticlesMenuButton: FC<Props> = ({
  editStatus,
  articles,
  bookType,
}) => {
  const [downloadMenuElement, setDownloadMenuElement] =
    useState<null | HTMLElement>(null);
  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };
  const classes = useStyles();

  const exportCsvFile = () => {
    exportArticles.csvFile(
      articles,
      editStatus,
      `${bookType}-${editStatus}.csv`
    );
  };

  const exportHTMLFiles = () => {
    exportArticles.htmlFiles(articles, `${bookType}-${editStatus}-html.zip`);
  };

  const exportIcons = () => {
    exportArticles.icons(
      articles,
      `${bookType}-${editStatus}--illustraties.zip`
    );
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
        id="article-download-menu"
        anchorEl={downloadMenuElement}
        keepMounted
        open={Boolean(downloadMenuElement)}
        onClose={() => setDownloadMenuElement(null)}
      >
        <MenuItem key="csv" onClick={exportCsvFile}>
          {bookType}-{editStatus}.csv
        </MenuItem>
        <MenuItem key="html" onClick={exportHTMLFiles}>
          {bookType}-{editStatus}-html.zip
        </MenuItem>
        <MenuItem key="icon" onClick={exportIcons}>
          {bookType}-{editStatus}-illustraties.zip
        </MenuItem>
      </Menu>
    </>
  );
};

export default DownloadArticlesMenuButton;

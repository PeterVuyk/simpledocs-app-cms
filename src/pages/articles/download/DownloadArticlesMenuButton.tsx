import React, { FC, useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import { ArticleType } from '../../../model/ArticleType';
import exportArticles from './exportArticles';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  editStatus: EditStatus;
  articles: Article[];
  articleType: ArticleType;
}

const DownloadArticlesMenuButton: FC<Props> = ({
  editStatus,
  articles,
  articleType,
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
      `${articleType}-${editStatus}.csv`
    );
  };

  const exportHTMLFiles = () => {
    exportArticles.htmlFiles(articles, `${articleType}-${editStatus}-html.zip`);
  };

  const exportIcons = () => {
    exportArticles.icons(
      articles,
      `${articleType}-${editStatus}--illustraties.zip`
    );
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        onClick={openDownloadMenu}
      >
        <GetAppIcon color="action" />
      </Button>
      <Menu
        id="article-download-menu"
        anchorEl={downloadMenuElement}
        keepMounted
        open={Boolean(downloadMenuElement)}
        onClose={() => setDownloadMenuElement(null)}
      >
        <MenuItem key="csv" onClick={exportCsvFile}>
          {articleType}-{editStatus}.csv
        </MenuItem>
        <MenuItem key="html" onClick={exportHTMLFiles}>
          {articleType}-{editStatus}-html.zip
        </MenuItem>
        <MenuItem key="icon" onClick={exportIcons}>
          {articleType}-{editStatus}-illustraties.zip
        </MenuItem>
      </Menu>
    </>
  );
};

export default DownloadArticlesMenuButton;

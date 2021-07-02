import React, { FC, useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import { ArticleType } from '../../../model/ArticleType';
import DownloadArticlesIconsMenuItem from './DownloadArticlesIconsMenuItem';
import DownloadArticlesHTMLMenuItem from './DownloadArticlesHTMLMenuItem';
import DownloadArticlesMenuItem from './DownloadArticlesMenuItem';

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
        <DownloadArticlesMenuItem
          editStatus={editStatus}
          articles={articles}
          articleType={articleType}
        />
        <DownloadArticlesHTMLMenuItem
          editStatus={editStatus}
          articles={articles}
          articleType={articleType}
        />
        <DownloadArticlesIconsMenuItem
          editStatus={editStatus}
          articles={articles}
          articleType={articleType}
        />
      </Menu>
    </>
  );
};

export default DownloadArticlesMenuButton;

import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import articleRepository from '../../../firebase/database/articleRepository';
import PageHeading from '../../../layout/PageHeading';
import DownloadArticlesMenuItem from '../batch/DownloadArticlesMenuItem';
import DownloadArticlesHTMLMenuItem from '../batch/DownloadArticlesHTMLMenuItem';
import DownloadArticlesIconsMenuItem from '../batch/DownloadArticlesIconsMenuItem';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import ArticlesList from './ArticlesList';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { ArticleType } from '../../../model/ArticleType';
import { Article } from '../../../model/Article';
import articleTypeHelper from '../../../helper/articleTypeHelper';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  button: {
    marginLeft: 8,
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  articleType: ArticleType;
}

const Articles: FC<Props> = ({ articleType }) => {
  const [downloadMenuElement, setDownloadMenuElement] =
    useState<null | HTMLElement>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editStatus, setEditStatus] = useState<EditStatus>(EDIT_STATUS_DRAFT);
  const classes = useStyles();
  const history = useHistory();

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const loadArticlesHandle = (): void => {
    setArticles([]);
    articleRepository
      .getArticles(articleType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  };

  useEffect(() => {
    articleRepository
      .getArticles(articleType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  }, [articleType, editStatus]);

  const getAddArticlePath = () => {
    return {
      pathname: `/article/${articleTypeHelper.articleTypeToDashedPath(
        articleType
      )}/add`,
      articleType,
    };
  };

  return (
    <>
      <PageHeading title={articleTypeHelper.getTitleByArticleType(articleType)}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {articles.length !== 0 && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={openDownloadMenu}
          >
            <GetAppIcon color="action" />
          </Button>
        )}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(getAddArticlePath())}
        >
          Pagina toevoegen
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
      </PageHeading>
      <ArticlesList
        editStatus={editStatus}
        loadArticlesHandle={loadArticlesHandle}
        articles={articles}
        articleType={articleType}
      />
    </>
  );
};

export default Articles;

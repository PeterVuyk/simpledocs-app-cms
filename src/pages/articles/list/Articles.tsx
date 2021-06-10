import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import articleRepository, {
  Article,
} from '../../../firebase/database/articleRepository';
import PageHeading from '../../../layout/PageHeading';
import DownloadArticlesMenuItem from '../batch/DownloadArticlesMenuItem';
import DownloadArticlesHTMLMenuItem from '../batch/DownloadArticlesHTMLMenuItem';
import DownloadArticlesIconsMenuItem from '../batch/DownloadArticlesIconsMenuItem';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import ArticlesList from './ArticlesList';

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
  articleType: 'regulations' | 'instructionManual';
}

const Articles: React.FC<Props> = ({ articleType }) => {
  const [downloadMenuElement, setDownloadMenuElement] =
    React.useState<null | HTMLElement>(null);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [editStatus, setEditStatus] =
    React.useState<'draft' | 'published'>('draft');
  const classes = useStyles();
  const history = useHistory();

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const loadArticlesHandle = (): void => {
    articleRepository
      .getArticles(articleType, editStatus === 'draft')
      .then((result) => setArticles(result));
  };

  React.useEffect(() => {
    articleRepository
      .getArticles(articleType, editStatus === 'draft')
      .then((result) => setArticles(result));
  }, [articleType, editStatus]);

  const getTitle = () =>
    articleType === 'regulations' ? 'Regelgevingen' : 'Handleiding';

  const getAddArticlePath = () => {
    return {
      pathname:
        articleType === 'regulations'
          ? '/article/regulations/add'
          : '/article/instruction-manual/add',
      articleType,
    };
  };

  return (
    <>
      <PageHeading title={getTitle()}>
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

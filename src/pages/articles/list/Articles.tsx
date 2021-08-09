import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import articleRepository from '../../../firebase/database/articleRepository';
import PageHeading from '../../../layout/PageHeading';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import ArticlesList from './ArticlesList';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { BookType } from '../../../model/BookType';
import { Article } from '../../../model/Article';
import bookTypeHelper from '../../../helper/bookTypeHelper';
import DownloadArticlesMenuButton from '../download/DownloadArticlesMenuButton';

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
  bookType: BookType;
}

const Articles: FC<Props> = ({ bookType }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editStatus, setEditStatus] = useState<EditStatus>(EDIT_STATUS_DRAFT);
  const classes = useStyles();
  const history = useHistory();

  const loadArticlesHandle = (): void => {
    setArticles([]);
    articleRepository
      .getArticles(bookType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  };

  useEffect(() => {
    articleRepository
      .getArticles(bookType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  }, [bookType, editStatus]);

  const getAddArticlePath = () => {
    return {
      pathname: `/books/${bookTypeHelper.bookTypeToDashedPath(bookType)}/add`,
      bookType,
    };
  };

  return (
    <>
      <PageHeading title={bookTypeHelper.getTitleByBookType(bookType)}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {articles.length !== 0 && (
          <DownloadArticlesMenuButton
            articles={articles}
            bookType={bookType}
            editStatus={editStatus}
          />
        )}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(getAddArticlePath())}
        >
          Pagina toevoegen
        </Button>
      </PageHeading>
      <ArticlesList
        editStatus={editStatus}
        loadArticlesHandle={loadArticlesHandle}
        articles={articles}
        bookType={bookType}
      />
    </>
  );
};

export default Articles;

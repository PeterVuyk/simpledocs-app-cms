import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import articleRepository from '../../../firebase/database/articleRepository';
import PageHeading from '../../../layout/PageHeading';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import ArticlesList from './ArticlesList';
import { EDIT_STATUS_DRAFT } from '../../../model/EditStatus';
import { BookType } from '../../../model/BookType';
import { Article } from '../../../model/Article';
import DownloadArticlesMenuButton from '../download/DownloadArticlesMenuButton';
import useStatusToggle from '../../../components/hooks/useStatusToggle';
import navigationConfig from '../../../navigation/navigationConfig.json';
import LoadingSpinner from '../../../components/LoadingSpinner';

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
  title: string;
  bookType: BookType;
}

const Articles: FC<Props> = ({ title, bookType }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [editStatus, setEditStatus] = useStatusToggle();
  const classes = useStyles();
  const history = useHistory();

  const handleLoadArticles = (): void => {
    setArticles(null);
    articleRepository
      .getArticles(bookType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  };

  useEffect(() => {
    setArticles(null);
    articleRepository
      .getArticles(bookType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  }, [bookType, editStatus]);

  const getAddArticlePath = () => {
    return {
      pathname: `/books/${navigationConfig.books.bookItems[bookType].urlSlug}/add`,
      bookType,
    };
  };

  return (
    <>
      <PageHeading title={title}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {articles && articles.length !== 0 && (
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
        onLoadArticles={handleLoadArticles}
        articles={articles}
        bookType={bookType}
      />
      {articles === null && <LoadingSpinner />}
    </>
  );
};

export default Articles;

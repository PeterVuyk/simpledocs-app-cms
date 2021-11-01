import React, { FC, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import articleRepository from '../../../firebase/database/articleRepository';
import PageHeading from '../../../layout/PageHeading';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import ArticlesList from './ArticlesList';
import { EDIT_STATUS_DRAFT } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import DownloadArticlesMenuButton from '../download/DownloadArticlesMenuButton';
import useStatusToggle from '../../../components/hooks/useStatusToggle';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useCmsConfiguration from '../../../configuration/useCmsConfiguration';
import UpdateStylesheet from '../stylesheet/UpdateStylesheetButton';

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
  bookType: string;
}

const Articles: FC<Props> = ({ title, bookType }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const { editStatus, setEditStatus } = useStatusToggle();
  const classes = useStyles();
  const history = useHistory();
  const { getSlugFromBookType } = useCmsConfiguration();

  const loadArticles = useCallback(() => {
    setArticles(null);
    articleRepository
      .getArticles(bookType, editStatus === EDIT_STATUS_DRAFT)
      .then((result) => setArticles(result));
  }, [bookType, editStatus]);

  useEffect(() => {
    loadArticles();
  }, [bookType, editStatus, loadArticles]);

  const getAddArticlePath = () => {
    return {
      pathname: `/books/${getSlugFromBookType(bookType)}/add`,
      bookType,
    };
  };

  const handleStylesheetUpdate = () => {
    loadArticles();
  };

  return (
    <>
      <PageHeading title={title}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {articles && articles.length !== 0 && (
          <>
            <UpdateStylesheet
              onStylesheetUpdate={handleStylesheetUpdate}
              bookType={bookType}
            />
            <DownloadArticlesMenuButton
              articles={articles}
              bookType={bookType}
              editStatus={editStatus}
            />
          </>
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
        onLoadArticles={loadArticles}
        articles={articles}
        bookType={bookType}
      />
      {articles === null && <LoadingSpinner />}
    </>
  );
};

export default Articles;

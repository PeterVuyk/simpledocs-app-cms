import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { diffWords } from 'diff';
import { makeStyles } from '@material-ui/core/styles';
import 'diff2html/bundles/css/diff2html.min.css';
import useDiff from '../../../hooks/useDiff';
import DiffContentPage from '../diff/DiffContentPage';
import { Page } from '../../../../model/Page';
import ChapterDivisions from '../../../../model/books/ChapterDivisions';
import { CONTENT_TYPE_DECISION_TREE } from '../../../../model/ContentType';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    width: 45,
    display: 'inline',
    verticalAlign: 'middle',
  },
}));

interface Props {
  conceptPage: Page;
  publishedPage: Page;
}

const DiffDialogContent: FC<Props> = ({ conceptPage, publishedPage }) => {
  const { mapDiff, getPropertiesDiff } = useDiff();
  const classes = useStyles();

  return (
    <>
      <Grid
        className={classes.container}
        container
        spacing={0}
        alignItems="flex-start"
        justifyContent="flex-start"
        direction="row"
      >
        <Grid container item sm={6} spacing={2}>
          {getPropertiesDiff(
            'Hoofdstuk',
            mapDiff(diffWords(publishedPage.chapter, conceptPage.chapter))
          )}
          {getPropertiesDiff(
            'Pagina index',
            mapDiff(
              diffWords(
                publishedPage.pageIndex.toString(),
                conceptPage.pageIndex.toString()
              )
            )
          )}
          {getPropertiesDiff(
            'Titel',
            mapDiff(diffWords(publishedPage.title, conceptPage.title))
          )}
          {getPropertiesDiff(
            'Subtitel',
            mapDiff(diffWords(publishedPage.subTitle, conceptPage.subTitle))
          )}
        </Grid>
        <Grid container item sm={6} spacing={2}>
          {getPropertiesDiff(
            'Hoofdstukindeling',
            mapDiff(
              diffWords(
                // @ts-ignore
                ChapterDivisions[publishedPage.chapterDivision],
                // @ts-ignore
                ChapterDivisions[conceptPage.chapterDivision]
              )
            )
          )}
          <Grid item xs={12}>
            <h3>Illustratie:</h3>
            <p>
              Gepubliceerd:&nbsp;
              <img
                className={classes.icon}
                src={`${publishedPage.iconFile}`}
                alt={publishedPage.chapter}
              />
              &nbsp;&nbsp;Concept:&nbsp;
              <img
                className={classes.icon}
                src={`${conceptPage.iconFile}`}
                alt={conceptPage.chapter}
              />
            </p>
          </Grid>
          {publishedPage.contentType === CONTENT_TYPE_DECISION_TREE && (
            <Grid item xs={12}>
              <h3>Beslisboom:</h3>
              <p>
                Gepubliceerd:
                <strong>{` ${
                  (JSON.parse(publishedPage.content) as DecisionTree).title
                } `}</strong>
                Concept:{' '}
                <strong>{`${
                  (JSON.parse(conceptPage.content) as DecisionTree).title
                } `}</strong>
              </p>
            </Grid>
          )}
        </Grid>
        {publishedPage.contentType !== CONTENT_TYPE_DECISION_TREE && (
          <DiffContentPage
            publishedPageContent={publishedPage.content}
            conceptPageContent={conceptPage.content}
            conceptContentType={conceptPage.contentType}
            publishedContentType={publishedPage.contentType}
          />
        )}
      </Grid>
    </>
  );
};

export default DiffDialogContent;

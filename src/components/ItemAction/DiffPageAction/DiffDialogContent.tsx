import React, { FC, Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Change, diffWords } from 'diff';
import { Page } from '../../../model/Page';
import ChapterDivisions from '../../../model/ChapterDivisions';
import 'diff2html/bundles/css/diff2html.min.css';
import ContentPageDiff from './ContentPageDiff';

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
  inlineBlock: { display: 'inline', marginRight: 10 },
}));

interface Props {
  conceptPage: Page;
  publishedPage: Page;
}

const DiffDialogContent: FC<Props> = ({ conceptPage, publishedPage }) => {
  const classes = useStyles();

  const mapDiff = (changes: Change[]) => {
    return changes.map((part, index) => {
      // eslint-disable-next-line no-nested-ternary
      const color = part.added ? 'green' : part.removed ? '#ff0000' : '#404854';
      return (
        <span key={index.toString()} style={{ color }} color={color}>
          {part.value.includes('\n')
            ? part.value.split('\n').map((value, splitIndex) => (
                <Fragment key={splitIndex.toString()}>
                  {splitIndex !== 0 ? <br /> : ''}
                  {value}
                </Fragment>
              ))
            : part.value}
        </span>
      );
    });
  };

  const getPropertiesDiff = (title: string, elements: JSX.Element[]) => {
    return (
      <Grid item xs={12}>
        <h3 className={classes.inlineBlock}>{title}:</h3>
        <div className={classes.inlineBlock}>
          {elements[0].props.children === '' ? '-' : elements}
        </div>
      </Grid>
    );
  };

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
        </Grid>
        <Grid container item sm={12} spacing={0}>
          <Grid item xs={12}>
            <ContentPageDiff
              conceptPage={conceptPage}
              publishedPage={publishedPage}
              mapContentDiffToElement={mapDiff}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DiffDialogContent;

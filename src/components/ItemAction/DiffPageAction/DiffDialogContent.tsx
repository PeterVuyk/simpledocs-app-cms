import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Change, createTwoFilesPatch, diffChars } from 'diff';
import * as Diff2Html from 'diff2html';
import { Page } from '../../../model/Page';
import ChapterDivisions from '../../../model/ChapterDivisions';
import 'diff2html/bundles/css/diff2html.min.css';
import { getExtensionFromContentType } from '../../../model/artifacts/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    width: 45,
  },
}));

interface Props {
  conceptPage: Page;
  publishedPage: Page;
}

const DiffDialogContent: FC<Props> = ({ conceptPage, publishedPage }) => {
  const classes = useStyles();

  const getContentDiff = () => {
    const diff = createTwoFilesPatch(
      `${publishedPage.title}.${getExtensionFromContentType(
        publishedPage.contentType
      )}`,
      `${conceptPage.title}.${getExtensionFromContentType(
        conceptPage.contentType
      )}`,
      pretty(publishedPage.content),
      pretty(conceptPage.content)
    );
    return Diff2Html.html(diff, {
      drawFileList: false,
      diffStyle: 'char',
      outputFormat: 'side-by-side',
    });
  };

  const mapDiff = (changes: Change[]) => {
    return changes.map((part, index) => {
      // eslint-disable-next-line no-nested-ternary
      const color = part.added ? 'green' : part.removed ? '#ff0000' : '#404854';
      return (
        <span key={index.toString()} style={{ color }} color={color}>
          {part.value}
        </span>
      );
    });
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
          <Grid item xs={12} sm={6}>
            <h3>Hoofdstuk:</h3>
            <p>
              {mapDiff(diffChars(publishedPage.chapter, conceptPage.chapter))}
            </p>
          </Grid>
          <Grid item xs={12}>
            <h3>Pagina index:</h3>
            <p>
              {mapDiff(
                diffChars(
                  publishedPage.pageIndex.toString(),
                  conceptPage.pageIndex.toString()
                )
              )}
            </p>
          </Grid>
          <Grid item xs={12}>
            <h3>Titel:</h3>
            <p>{mapDiff(diffChars(publishedPage.title, conceptPage.title))}</p>
          </Grid>
          <Grid item xs={12}>
            <h3>Subtitel:</h3>
            <p>
              {mapDiff(diffChars(publishedPage.subTitle, conceptPage.subTitle))}
            </p>
          </Grid>
          <Grid item xs={12}>
            <h3>Hoofdstukindeling:</h3>
            <p>
              {mapDiff(
                diffChars(
                  // @ts-ignore
                  ChapterDivisions[publishedPage.chapterDivision],
                  // @ts-ignore
                  ChapterDivisions[conceptPage.chapterDivision]
                )
              )}
            </p>
          </Grid>
          <Grid item xs={12}>
            <h3>Zoektekst:</h3>
            <p>
              {mapDiff(
                diffChars(publishedPage.searchText, conceptPage.searchText)
              )}
            </p>
          </Grid>
          <Grid item xs={12}>
            <h3>Illustratie:</h3>
            <p>
              <strong>Gepubliceerd:&nbsp;</strong>
              <img
                className={classes.icon}
                src={`${publishedPage.iconFile}`}
                alt={publishedPage.chapter}
              />
              &nbsp;<strong>Concept:</strong>&nbsp;
              <img
                className={classes.icon}
                src={`${conceptPage.iconFile}`}
                alt={conceptPage.chapter}
              />
            </p>
          </Grid>
        </Grid>
        <Grid container item sm={6} spacing={0}>
          <Grid item xs={12} style={{ marginLeft: 18 }}>
            <h3>Pagina inhoud:</h3>
            <div dangerouslySetInnerHTML={{ __html: getContentDiff() }} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DiffDialogContent;

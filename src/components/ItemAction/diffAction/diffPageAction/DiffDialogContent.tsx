import React, { FC } from 'react';
import { Grid } from '@mui/material';
import { diffWords } from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';
import useDiff from '../../../hooks/useDiff';
import DiffContentPage from '../diff/DiffContentPage';
import { Page } from '../../../../model/Page';
import ChapterDivisions from '../../../../model/books/ChapterDivisions';
import { CONTENT_TYPE_DECISION_TREE } from '../../../../model/ContentType';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';
import DiffIconFile from '../diff/DiffIconFile';

interface Props {
  conceptPage: Page;
  publishedPage: Page;
}

const DiffDialogContent: FC<Props> = ({ conceptPage, publishedPage }) => {
  const { mapDiff, getPropertiesDiff } = useDiff();

  return (
    <Grid
      sx={(theme) => ({
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      })}
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
              //  If the index is < 0, then it is set by timestamp and not reordered by the user yet. So position is undecided.
              //  Indexes start with 0, for developers logic but not for the CMS users, so we add +1 to avoid explanation.
              publishedPage.pageIndex < 0
                ? 'Onbepaald'
                : (publishedPage.pageIndex + 1).toString(),
              conceptPage.pageIndex < 0
                ? 'Onbepaald'
                : (conceptPage.pageIndex + 1).toString()
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
          <DiffIconFile
            altText={publishedPage.chapter}
            conceptIconFile={conceptPage.iconFile}
            publicationIconFile={publishedPage.iconFile}
          />
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
  );
};

export default DiffDialogContent;

import React, { FC } from 'react';
import { Grid } from '@mui/material';
import { diffWords } from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';
import useDiff from '../../../hooks/useDiff';
import DiffContentPage from '../diff/DiffContentPage';
import { StandalonePage } from '../../../../model/standalonePages/StandalonePage';

interface Props {
  conceptPage: StandalonePage;
  publishedPage: StandalonePage;
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
          'Titel',
          mapDiff(diffWords(publishedPage.title, conceptPage.title))
        )}
        {getPropertiesDiff(
          'Inhoudstype',
          mapDiff(
            diffWords(
              publishedPage.contentType.toString(),
              conceptPage.contentType.toString()
            )
          )
        )}
      </Grid>
      <DiffContentPage
        publishedPageContent={publishedPage.content}
        conceptPageContent={conceptPage.content}
        conceptContentType={conceptPage.contentType}
        publishedContentType={publishedPage.contentType}
      />
    </Grid>
  );
};

export default DiffDialogContent;

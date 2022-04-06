import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { diffWords } from 'diff';
import { makeStyles } from '@material-ui/core/styles';
import 'diff2html/bundles/css/diff2html.min.css';
import useDiff from '../../../hooks/useDiff';
import DiffContentPage from '../diff/DiffContentPage';
import { StandalonePage } from '../../../../model/standalonePages/StandalonePage';

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
  conceptPage: StandalonePage;
  publishedPage: StandalonePage;
}

const DiffDialogContent: FC<Props> = ({ conceptPage, publishedPage }) => {
  const { mapDiff, getPropertiesDiff } = useDiff();
  const classes = useStyles();

  return (
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

import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { diffWords } from 'diff';
import { makeStyles } from '@material-ui/core/styles';
import 'diff2html/bundles/css/diff2html.min.css';
import useDiff from '../../../hooks/useDiff';
import DiffIconFile from '../diff/DiffIconFile';
import { CalculationInfo } from '../../../../model/calculations/CalculationInfo';
import DiffContentPage from '../diff/DiffContentPage';

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
  conceptCalculationInfo: CalculationInfo;
  publishedCalculationInfo: CalculationInfo;
}

const DiffDialogContent: FC<Props> = ({
  conceptCalculationInfo,
  publishedCalculationInfo,
}) => {
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
            'Titel',
            mapDiff(
              diffWords(
                publishedCalculationInfo.title,
                conceptCalculationInfo.title
              )
            )
          )}
          {getPropertiesDiff(
            'Toelichting',
            mapDiff(
              diffWords(
                publishedCalculationInfo.explanation,
                conceptCalculationInfo.explanation
              )
            )
          )}
        </Grid>
        <Grid container item sm={6} spacing={2}>
          <Grid item xs={12}>
            <DiffIconFile
              conceptIconFile={conceptCalculationInfo.iconFile}
              publicationIconFile={publishedCalculationInfo.iconFile}
              altText={conceptCalculationInfo.title}
            />
          </Grid>
        </Grid>
        <DiffContentPage
          conceptContentType={conceptCalculationInfo.contentType}
          conceptPageContent={conceptCalculationInfo.content}
          publishedContentType={publishedCalculationInfo.contentType}
          publishedPageContent={publishedCalculationInfo.content}
        />
      </Grid>
    </>
  );
};

export default DiffDialogContent;

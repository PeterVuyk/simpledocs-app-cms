import React, { FC } from 'react';
import { Grid } from '@mui/material';
import { diffWords } from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';
import useDiff from '../../../hooks/useDiff';
import { CalculationInfo } from '../../../../model/calculations/CalculationInfo';
import DiffContentPage from '../diff/DiffContentPage';

interface Props {
  conceptCalculationInfo: CalculationInfo;
  publishedCalculationInfo: CalculationInfo;
}

const DiffDialogContent: FC<Props> = ({
  conceptCalculationInfo,
  publishedCalculationInfo,
}) => {
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
      <DiffContentPage
        conceptContentType={conceptCalculationInfo.contentType}
        conceptPageContent={conceptCalculationInfo.content}
        publishedContentType={publishedCalculationInfo.contentType}
        publishedPageContent={publishedCalculationInfo.content}
      />
    </Grid>
  );
};

export default DiffDialogContent;

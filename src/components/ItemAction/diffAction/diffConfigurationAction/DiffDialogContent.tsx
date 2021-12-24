import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'diff2html/bundles/css/diff2html.min.css';
import stringify from 'json-stable-stringify';
import DiffContentPage from '../diff/DiffContentPage';
import { CONTENT_TYPE_JSON } from '../../../../model/artifacts/Artifact';
import { AppConfigurations } from '../../../../model/configurations/AppConfigurations';
import { CmsConfigurations } from '../../../../model/configurations/CmsConfigurations';
import omit from '../../../../helper/object/omit';

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
  conceptConfiguration: AppConfigurations | CmsConfigurations;
  publishedConfiguration: AppConfigurations | CmsConfigurations;
}

const DiffDialogContent: FC<Props> = ({
  conceptConfiguration,
  publishedConfiguration,
}) => {
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
      <DiffContentPage
        disableTextView
        publishedPageContent={stringify(
          omit(publishedConfiguration, ['versioning']),
          { space: '  ' }
        )}
        conceptPageContent={stringify(
          omit(conceptConfiguration, ['versioning']),
          { space: '  ' }
        )}
        conceptContentType={CONTENT_TYPE_JSON}
        publishedContentType={CONTENT_TYPE_JSON}
      />
    </Grid>
  );
};

export default DiffDialogContent;

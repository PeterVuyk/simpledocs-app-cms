import React, { FC } from 'react';
import { Grid } from '@mui/material';
import 'diff2html/bundles/css/diff2html.min.css';
import stringify from 'json-stable-stringify';
import DiffContentPage from '../diff/DiffContentPage';
import { AppConfigurations } from '../../../../model/configurations/AppConfigurations';
import { CmsConfigurations } from '../../../../model/configurations/CmsConfigurations';
import omit from '../../../../helper/object/omit';
import { CONTENT_TYPE_JSON } from '../../../../model/ContentType';

interface Props {
  conceptConfiguration: AppConfigurations | CmsConfigurations;
  publishedConfiguration: AppConfigurations | CmsConfigurations;
}

const DiffDialogContent: FC<Props> = ({
  conceptConfiguration,
  publishedConfiguration,
}) => {
  return (
    <Grid
      sx={(theme) => ({
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      })}
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

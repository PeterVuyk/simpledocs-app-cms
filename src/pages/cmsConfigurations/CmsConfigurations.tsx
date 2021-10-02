import React, { FC } from 'react';
import ConfigurationsOverview from '../../components/configuration/ConfigurationsOverview';
import { CMS_CONFIGURATIONS } from '../../model/ConfigurationType';

interface Props {
  title: string;
}

const CmsConfigurationsPage: FC<Props> = ({ title }) => {
  return (
    <ConfigurationsOverview
      configurationType={CMS_CONFIGURATIONS}
      title={title}
    />
  );
};

export default CmsConfigurationsPage;

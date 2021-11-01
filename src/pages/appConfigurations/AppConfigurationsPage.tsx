import React, { FC } from 'react';
import ConfigurationsOverview from '../../components/configuration/ConfigurationsOverview';
import { APP_CONFIGURATIONS } from '../../model/configurations/ConfigurationType';

interface Props {
  title: string;
}

const AppConfigurationsPage: FC<Props> = ({ title }) => {
  return (
    <ConfigurationsOverview
      configurationType={APP_CONFIGURATIONS}
      title={title}
    />
  );
};

export default AppConfigurationsPage;

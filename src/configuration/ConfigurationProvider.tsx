import React, { useEffect, useState, FC, ReactNode } from 'react';
import { CmsConfiguration } from '../model/CmsConfiguration';
import configurationRepository from '../firebase/database/configurationRepository';
import { CMS_CONFIGURATIONS } from '../model/ConfigurationType';
import logger from '../helper/logger';
import { setCmsConfiguration } from './cmsConfiguration';
import LoadingSpinner from '../components/LoadingSpinner';

interface Props {
  children: ReactNode;
}

const ConfigurationProvider: FC<Props> = ({ children }) => {
  const [cmsConfigurations, setCmsConfigurations] =
    useState<CmsConfiguration | null>(null);

  useEffect(() => {
    configurationRepository
      .getConfigurations(CMS_CONFIGURATIONS)
      .then((result) => result as CmsConfiguration)
      .then((configuration) => {
        setCmsConfiguration(configuration);
        setCmsConfigurations(configuration);
      })
      .catch((reason) =>
        logger.errorWithReason(
          'Failed to get cmsConfigurations from firebase storage',
          reason
        )
      );
  }, []);

  if (!cmsConfigurations) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ConfigurationProvider;

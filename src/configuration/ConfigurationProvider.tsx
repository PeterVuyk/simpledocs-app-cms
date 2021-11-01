import React, { useEffect, useState, FC, ReactNode, useCallback } from 'react';
import configurationRepository from '../firebase/database/configurationRepository';
import logger from '../helper/logger';
import LoadingSpinner from '../components/LoadingSpinner';
import { setAppConfiguration, setCmsConfiguration } from './configuration';

interface Props {
  children: ReactNode;
}

const ConfigurationProvider: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const getConfigurations = useCallback(() => {
    configurationRepository
      .getAllConfigurations()
      .then((configuration) => {
        if (
          !configuration ||
          configuration.appConfigurations === null ||
          !configuration.cmsConfigurations
        ) {
          throw new Error(
            'failed to get the one or more of the configurations from the database'
          );
        }
        setCmsConfiguration(configuration.cmsConfigurations);
        setAppConfiguration(configuration.appConfigurations);
        setLoading(false);
      })
      .catch((reason) =>
        logger.errorWithReason(`ConfigurationProvider failed`, reason)
      );
  }, []);

  useEffect(() => {
    getConfigurations();
  }, [getConfigurations]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ConfigurationProvider;

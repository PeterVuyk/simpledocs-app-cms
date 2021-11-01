import { CmsConfiguration } from '../model/CmsConfiguration';
import { AppConfigurations } from '../model/AppConfigurations';

let cmsConfig: CmsConfiguration;
let appConfig: AppConfigurations;

export const setCmsConfiguration = (configuration: CmsConfiguration) => {
  cmsConfig = configuration;
};

export const getCmsConfiguration = () => {
  return cmsConfig;
};

export const setAppConfiguration = (configuration: AppConfigurations) => {
  appConfig = configuration;
};

export const getAppConfiguration = () => {
  return appConfig;
};

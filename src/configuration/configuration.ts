import { CmsConfigurations } from '../model/configurations/CmsConfigurations';
import { AppConfigurations } from '../model/configurations/AppConfigurations';

let cmsConfig: CmsConfigurations;
let appConfig: AppConfigurations;

export const setCmsConfiguration = (configuration: CmsConfigurations) => {
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

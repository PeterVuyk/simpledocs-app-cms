import { CmsConfiguration } from '../model/CmsConfiguration';

let cmsConfiguration: CmsConfiguration;

export const setCmsConfiguration = (configuration: CmsConfiguration) => {
  cmsConfiguration = configuration;
};
export const getCmsConfiguration = () => {
  return cmsConfiguration;
};

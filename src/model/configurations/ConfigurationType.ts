export const APP_CONFIGURATIONS = 'appConfigurations';
export const APP_CONFIGURATIONS_DRAFT = 'appConfigurationsDraft';
export const CMS_CONFIGURATIONS = 'cmsConfigurations';
export const CMS_CONFIGURATIONS_DRAFT = 'cmsConfigurationsDraft';

export type ConfigurationType = 'appConfigurations' | 'cmsConfigurations';

export type ConfigurationTypeStatus =
  | 'appConfigurations'
  | 'appConfigurationsDraft'
  | 'cmsConfigurations'
  | 'cmsConfigurationsDraft';

export const getDraftFromConfigurationType = (
  configurationType: ConfigurationType
): 'appConfigurationsDraft' | 'cmsConfigurationsDraft' => {
  return configurationType === APP_CONFIGURATIONS
    ? APP_CONFIGURATIONS_DRAFT
    : CMS_CONFIGURATIONS_DRAFT;
};

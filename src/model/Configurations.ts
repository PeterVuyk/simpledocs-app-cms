import { AppConfigurations } from './AppConfigurations';
import { CmsConfiguration } from './CmsConfiguration';

export interface Configurations {
  appConfigurations: AppConfigurations | null;
  cmsConfigurations: CmsConfiguration | null;
}

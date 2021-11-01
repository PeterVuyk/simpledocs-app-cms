import { AppConfigurations } from './AppConfigurations';
import { CmsConfigurations } from './CmsConfigurations';

export interface Configurations {
  appConfigurations: AppConfigurations | null;
  cmsConfigurations: CmsConfigurations | null;
}

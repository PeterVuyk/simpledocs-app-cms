import { VersioningStatus } from './VersioningStatus';

export interface Versioning {
  aggregate: string;
  version: string;
  status: VersioningStatus;
}

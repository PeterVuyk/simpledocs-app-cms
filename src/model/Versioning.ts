export const UPDATE_ON_STARTUP = 'onStartup';
export const UPDATE_ON_STARTUP_READY = 'onStartupReady';

export type UpdateMoment = 'onStartup' | 'onStartupReady';

export interface Versioning {
  aggregate: string;
  version: string;
  isBookType?: boolean;
  isDraft?: boolean;
  updateMoment?: UpdateMoment;
}

export interface VersionInfo {
  isDraft?: boolean;
  isBookType: boolean;
  version: string;
  updateMoment?: UpdateMoment;
}

export interface Versions {
  [key: string]: VersionInfo;
}

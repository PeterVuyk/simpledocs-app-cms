export interface Versioning {
  aggregate: string;
  version: string;
  isBookType?: boolean;
}

export interface VersionInfo {
  isBookType: boolean;
  version: string;
}

export interface Versions {
  [key: string]: VersionInfo;
}

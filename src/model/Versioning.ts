export interface Versioning {
  aggregate: string;
  version: string;
  isBookType?: boolean;
  isDraft?: boolean;
}

export interface VersionInfo {
  isDraft?: boolean;
  isBookType: boolean;
  version: string;
}

export interface Versions {
  [key: string]: VersionInfo;
}

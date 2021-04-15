import { database } from '../firebaseConnection';

export interface Versioning {
  aggregate: string;
  version: string;
}

async function getVersions() {
  const versioning = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.entries(versioning.data()).map(([key, value]) => {
    return { aggregate: key, version: value } as Versioning;
  });
}

const versioningRepository = {
  getVersions,
};

export default versioningRepository;

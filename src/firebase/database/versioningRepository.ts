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

async function updateVersion(versioning: Versioning, newVersion: string) {
  await database
    .collection('versioning')
    .doc('aggregate')
    .update({
      [versioning.aggregate]: newVersion,
    });
}

const versioningRepository = {
  getVersions,
  updateVersion,
};

export default versioningRepository;

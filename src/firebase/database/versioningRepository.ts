import { database } from '../firebaseConnection';

export interface Versioning {
  regulations: string;
}

async function getRegulationVersioning() {
  const versioning = await database
    .collection('versioning')
    .doc('aggregate')
    .get();

  return versioning.data() as Versioning;
}

const versioningRepository = {
  getRegulationVersioning,
};

export default versioningRepository;

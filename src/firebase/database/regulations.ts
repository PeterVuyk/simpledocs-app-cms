import { database } from '../firebaseConnection';

export interface Regulation {
  // eslint-disable-next-line camelcase
  page_index: number;
  chapter: string;
  level: string;
  title: string;
  // eslint-disable-next-line camelcase
  sub_title: string;
  body: string;
  // eslint-disable-next-line camelcase
  search_text: string;
  icon: string;
}

export interface Versioning {
  regulations: string;
}

async function getRegulations(): Promise<Regulation[]> {
  const querySnapshot = await database.collection('regulations').get();
  return querySnapshot.docs.map((doc) => doc.data() as Regulation);
}

async function getRegulationVersioning() {
  const versioning = await database
    .collection('versioning')
    .doc('aggregate')
    .get();

  return versioning.data() as Versioning;
}

const collectRegulations = {
  getRegulations,
  getRegulationVersioning,
};

export default collectRegulations;

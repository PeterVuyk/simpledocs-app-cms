import { database } from '../firebaseConnection';

export interface Regulation {
  pageIndex: number;
  chapter: string;
  level: string;
  title: string;
  subTitle: string;
  searchText: string;
  htmlFile: string;
  iconFile: string;
}

async function createRegulation(regulation: Regulation): Promise<void> {
  await database.collection('regulations').add(regulation);
}

async function getRegulations(): Promise<Regulation[]> {
  const querySnapshot = await database
    .collection('regulations')
    .orderBy('pageIndex', 'asc')
    .get();
  return querySnapshot.docs.map((doc) => doc.data() as Regulation);
}

async function getRegulationsByField(
  fieldName: string,
  fieldValue: string | number
): Promise<Regulation[]> {
  const querySnapshot = await database
    .collection('regulations')
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => doc.data() as Regulation);
}

const regulationRepository = {
  createRegulation,
  getRegulations,
  getRegulationByField: getRegulationsByField,
};

export default regulationRepository;

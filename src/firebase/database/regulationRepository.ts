import { database } from '../firebaseConnection';

export interface Regulation {
  id?: string;
  pageIndex: number;
  chapter: string;
  level: string;
  title: string;
  subTitle: string;
  searchText: string;
  htmlFile: string;
  iconFile: string;
  isDraft: boolean;
}

async function createRegulation(regulation: Regulation): Promise<void> {
  await database.collection('regulations').add(regulation);
}

async function deleteRegulation(regulationId: string): Promise<void> {
  await database.collection('regulations').doc(regulationId).delete();
}

async function getRegulations(
  draftRegulations: boolean
): Promise<Regulation[]> {
  const querySnapshot = await database
    .collection('regulations')
    .where('isDraft', '==', draftRegulations)
    .orderBy('pageIndex', 'asc')
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Regulation;
  });
}

async function getRegulationsById(id: string): Promise<Regulation> {
  const documentSnapshot = await database
    .collection('regulations')
    .doc(id)
    .get();
  return { id: documentSnapshot.id, ...documentSnapshot.data() } as Regulation;
}

async function getRegulationsByField(
  fieldName: string,
  fieldValue: string
): Promise<Regulation[]> {
  const querySnapshot = await database
    .collection('regulations')
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Regulation;
  });
}

async function updateRegulation(
  chapter: string,
  regulation: Regulation
): Promise<void> {
  const isDraft = await getRegulationsByField('chapter', chapter).then(
    (result) => result.some((value) => value.isDraft)
  );

  const regulationId = regulation.id;
  const updatedRegulation = regulation;
  delete updatedRegulation.id;

  if (isDraft) {
    await database
      .collection('regulations')
      .doc(regulationId)
      .set(updatedRegulation);
  } else {
    await createRegulation(updatedRegulation);
  }
}

const regulationRepository = {
  createRegulation,
  getRegulations,
  getRegulationsById,
  getRegulationsByField,
  deleteRegulation,
  updateRegulation,
};

export default regulationRepository;

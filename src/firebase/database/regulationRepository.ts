import firebase from 'firebase/app';
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
  markedForDeletion?: boolean;
}

async function createRegulation(regulation: Regulation): Promise<void> {
  await database.collection('regulations').add(regulation);
}

async function deleteRegulation(regulationId: string): Promise<void> {
  await database.collection('regulations').doc(regulationId).delete();
}

async function markRegulationForDeletion(regulationId: string): Promise<void> {
  await database
    .collection('regulations')
    .doc(regulationId)
    .update({ markedForDeletion: true });
}

async function removeMarkForDeletion(regulationId: string): Promise<void> {
  const regulationRef = database.collection('regulations').doc(regulationId);
  return regulationRef.update({
    markedForDeletion: firebase.firestore.FieldValue.delete(),
  });
}

async function getRegulations(
  draftRegulations: boolean
): Promise<Regulation[]> {
  const querySnapshot = await database
    .collection('regulations')
    .orderBy('pageIndex', 'asc')
    .get();
  const regulations = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Regulation;
  });
  if (draftRegulations) {
    return regulations.filter(
      (regulation) => regulation.isDraft || regulation.markedForDeletion
    );
  }
  return regulations.filter((regulation) => !regulation.isDraft);
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
    await createRegulation(updatedRegulation).then(() =>
      markRegulationForDeletion(regulationId ?? '')
    );
  }
}

const regulationRepository = {
  createRegulation,
  getRegulations,
  getRegulationsById,
  getRegulationsByField,
  deleteRegulation,
  removeMarkForDeletion,
  markRegulationForDeletion,
  updateRegulation,
};

export default regulationRepository;

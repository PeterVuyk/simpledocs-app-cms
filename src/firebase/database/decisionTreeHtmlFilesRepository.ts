import { database } from '../firebaseConnection';
import { DecisionTreeHtmlFile } from '../../model/DecisionTreeHtmlFile';

async function getHtmlFiles(): Promise<DecisionTreeHtmlFile[]> {
  const querySnapshot = await database
    .collection('decisionTreeHtmlFiles')
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as DecisionTreeHtmlFile;
  });
}

async function getHtmlFileById(id: string): Promise<DecisionTreeHtmlFile> {
  const documentSnapshot = await database
    .collection('decisionTreeHtmlFiles')
    .doc(id)
    .get();
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as DecisionTreeHtmlFile;
}

async function updateHtmlFile(
  decisionTreeHtmlFile: DecisionTreeHtmlFile
): Promise<void> {
  if (decisionTreeHtmlFile.id) {
    await database
      .collection('decisionTreeHtmlFiles')
      .doc(decisionTreeHtmlFile.id)
      .set(decisionTreeHtmlFile);
    return;
  }
  await database.collection('decisionTreeHtmlFiles').add(decisionTreeHtmlFile);
}

const decisionTreeHtmlFilesRepository = {
  getHtmlFiles,
  getHtmlFileById,
  updateHtmlFile,
};

export default decisionTreeHtmlFilesRepository;

import { database } from '../firebaseConnection';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';

async function getHtmlFiles(): Promise<HtmlFileInfo[]> {
  const querySnapshot = await database
    .collection('decisionTreeHtmlFiles')
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as HtmlFileInfo;
  });
}

async function getHtmlFileById(id: string): Promise<HtmlFileInfo> {
  const documentSnapshot = await database
    .collection('decisionTreeHtmlFiles')
    .doc(id)
    .get();
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as HtmlFileInfo;
}

async function updateHtmlFile(htmlFileInfo: HtmlFileInfo): Promise<void> {
  if (htmlFileInfo.id) {
    await database
      .collection('decisionTreeHtmlFiles')
      .doc(htmlFileInfo.id)
      .set(htmlFileInfo);
    return;
  }
  await database.collection('decisionTreeHtmlFiles').add(htmlFileInfo);
}

async function deleteHtmlFile(itemId: string): Promise<void> {
  await database.collection('decisionTreeHtmlFiles').doc(itemId).delete();
}

const decisionTreeHtmlFilesRepository = {
  getHtmlFiles,
  getHtmlFileById,
  updateHtmlFile,
  deleteHtmlFile,
};

export default decisionTreeHtmlFilesRepository;

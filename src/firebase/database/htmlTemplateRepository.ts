import { database } from '../firebaseConnection';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import { AGGREGATE_HTML_TEMPLATES } from '../../model/Aggregate';

async function getDefaultHtmlTemplate(): Promise<HtmlFileInfo | null> {
  const result = await database
    .collection(AGGREGATE_HTML_TEMPLATES)
    .where('title', '==', 'standaard')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as HtmlFileInfo;
      }
      return null;
    });
  return result;
}

async function getHtmlTemplates(): Promise<HtmlFileInfo[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_HTML_TEMPLATES)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as HtmlFileInfo;
  });
}

async function deleteHtmlFile(itemId: string): Promise<void> {
  await database.collection(AGGREGATE_HTML_TEMPLATES).doc(itemId).delete();
}

async function getHtmlFileById(id: string): Promise<HtmlFileInfo> {
  const documentSnapshot = await database
    .collection(AGGREGATE_HTML_TEMPLATES)
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
      .collection(AGGREGATE_HTML_TEMPLATES)
      .doc(htmlFileInfo.id)
      .set(htmlFileInfo);
    return;
  }
  await database.collection(AGGREGATE_HTML_TEMPLATES).add(htmlFileInfo);
}

const htmlTemplateRepository = {
  getHtmlTemplates,
  getDefaultHtmlTemplate,
  deleteHtmlFile,
  getHtmlFileById,
  updateHtmlFile,
};

export default htmlTemplateRepository;

import { database } from '../firebaseConnection';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import { HtmlFileCategory } from '../../model/HtmlFileCategory';
import { AGGREGATE_HTML_FILE_INFO } from '../../model/Aggregate';

async function getHtmlFileInfoByTitle(
  title: string,
  fileCategory: HtmlFileCategory
): Promise<HtmlFileInfo | null> {
  const result = await database
    .collection(AGGREGATE_HTML_FILE_INFO)
    .where('fileCategory', '==', fileCategory)
    .where('title', '==', title)
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

async function getHtmlInfoByCategories(
  fileCategories: HtmlFileCategory[]
): Promise<HtmlFileInfo[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_HTML_FILE_INFO)
    .orderBy('htmlFileCategory', 'desc')
    .get();
  return querySnapshot.docs
    .map((doc) => {
      return { id: doc.id, ...doc.data() } as HtmlFileInfo;
    })
    .filter((value) => fileCategories.includes(value.htmlFileCategory));
}

async function deleteHtmlFile(itemId: string): Promise<void> {
  await database.collection(AGGREGATE_HTML_FILE_INFO).doc(itemId).delete();
}

async function getHtmlFileById(id: string): Promise<HtmlFileInfo> {
  const documentSnapshot = await database
    .collection(AGGREGATE_HTML_FILE_INFO)
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
      .collection(AGGREGATE_HTML_FILE_INFO)
      .doc(htmlFileInfo.id)
      .set({
        htmlFile: htmlFileInfo.htmlFile,
        htmlFileCategory: htmlFileInfo.htmlFileCategory,
        title: htmlFileInfo.title,
      });
    return;
  }
  await database.collection(AGGREGATE_HTML_FILE_INFO).add({
    htmlFile: htmlFileInfo.htmlFile,
    htmlFileCategory: htmlFileInfo.htmlFileCategory,
    title: htmlFileInfo.title,
  });
}

const htmlFileInfoRepository = {
  getHtmlInfoByCategories,
  getHtmlFileInfoByTitle,
  deleteHtmlFile,
  getHtmlFileById,
  updateHtmlFile,
};

export default htmlFileInfoRepository;

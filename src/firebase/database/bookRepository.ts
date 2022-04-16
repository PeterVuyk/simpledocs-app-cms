import firebase from 'firebase/compat/app';
import { database } from '../firebaseConnection';
import { Page, PageInfo } from '../../model/Page';

function createDatabaseId() {
  return database.collection('books').doc().id;
}

async function createPage(bookType: string, page: Page): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(`${createDatabaseId()}-draft`)
    .set(page);
}

async function updateOrCreatePage(
  bookType: string,
  page: Page,
  pageId: string
): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(pageId)
    .set(page);
}

async function deletePage(bookType: string, pageId: string): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(pageId)
    .delete();
}

async function markPageForDeletion(
  bookType: string,
  pageId: string
): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(pageId)
    .update({ markedForDeletion: true });
}

async function removeMarkForDeletion(
  bookType: string,
  pageId: string
): Promise<void> {
  const pageRef = database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(pageId);
  return pageRef.update({
    markedForDeletion: firebase.firestore.FieldValue.delete(),
  });
}

async function getAllPages(bookType: string): Promise<Page[]> {
  const querySnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .orderBy('pageIndex', 'asc')
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Page;
  });
}

async function getPages(
  bookType: string,
  draftPages: boolean
): Promise<PageInfo[]> {
  const querySnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .orderBy('pageIndex', 'asc')
    .get();
  const pages = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Page;
  });
  const pagesInfo = pages.map((page) => {
    const hasRelatedPage = () => {
      const id = page.isDraft
        ? page.id!.replace('-draft', '')
        : `${page.id}-draft`;
      return pages.find((value) => value.id === id);
    };
    return {
      ...page,
      isNewCreatedPage: page.isDraft && !hasRelatedPage(),
    } as PageInfo;
  });
  if (draftPages) {
    return pagesInfo.filter((page) => page.isDraft || page.markedForDeletion);
  }
  return pagesInfo.filter((page) => !page.isDraft);
}

async function getPageById(bookType: string, id: string): Promise<Page | null> {
  const documentSnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(id)
    .get();
  return documentSnapshot.data()
    ? ({ id: documentSnapshot.id, ...documentSnapshot.data() } as Page)
    : null;
}

async function getPagesByField(
  bookType: string,
  fieldName: string,
  fieldValue: string | number
): Promise<Page[]> {
  const querySnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Page;
  });
}

async function updatePage(bookType: string, page: Page): Promise<void> {
  const originalPage = await getPageById(
    bookType,
    page.id?.replace('-draft', '') ?? ''
  );
  const pageId = page.id;
  const updatedPage = page;
  delete updatedPage.id;

  await updateOrCreatePage(bookType, updatedPage, pageId ?? '');
  if (originalPage) {
    await markPageForDeletion(bookType, originalPage.id ?? '');
  }
}

async function updatePages(bookType: string, pages: Page[]): Promise<void> {
  const batch = database.batch();
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((doc) => batch.delete(doc.ref))
    );
  pages.forEach((page) => {
    const doc = page as any;
    const docId = doc.id;
    delete doc.id;
    const docRef = database
      .collection('books')
      .doc(bookType)
      .collection(bookType)
      .doc(docId);
    batch.set(docRef, doc);
  });

  return batch.commit();
}

const bookRepository = {
  createPage,
  getPages,
  getAllPages,
  getPageById,
  getPagesByField,
  deletePage,
  removeMarkForDeletion,
  markPageForDeletion,
  updatePage,
  updatePages,
};

export default bookRepository;

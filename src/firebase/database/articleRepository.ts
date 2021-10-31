import firebase from 'firebase/compat/app';
import { database } from '../firebaseConnection';
import { Article } from '../../model/Article';

async function createArticle(
  bookType: string,
  article: Article
): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .add(article);
}

async function deleteArticle(
  bookType: string,
  articleId: string
): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(articleId)
    .delete();
}

async function markArticleForDeletion(
  bookType: string,
  articleId: string
): Promise<void> {
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(articleId)
    .update({ markedForDeletion: true });
}

async function removeMarkForDeletion(
  bookType: string,
  articleId: string
): Promise<void> {
  const articleRef = database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(articleId);
  return articleRef.update({
    markedForDeletion: firebase.firestore.FieldValue.delete(),
  });
}

async function getAllArticles(bookType: string): Promise<Article[]> {
  const querySnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .orderBy('pageIndex', 'asc')
    .get();
  const articles = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Article;
  });
  return articles;
}

async function getArticles(
  bookType: string,
  draftArticles: boolean
): Promise<Article[]> {
  const querySnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .orderBy('pageIndex', 'asc')
    .get();
  const articles = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Article;
  });
  if (draftArticles) {
    return articles.filter(
      (article) => article.isDraft || article.markedForDeletion
    );
  }
  return articles.filter((article) => !article.isDraft);
}

async function getArticleById(
  bookType: string,
  id: string
): Promise<Article | null> {
  const documentSnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .doc(id)
    .get();
  return documentSnapshot.data()
    ? ({ id: documentSnapshot.id, ...documentSnapshot.data() } as Article)
    : null;
}

async function getArticlesByField(
  bookType: string,
  fieldName: string,
  fieldValue: string
): Promise<Article[]> {
  const querySnapshot = await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Article;
  });
}

async function updateArticle(
  bookType: string,
  chapter: string,
  article: Article
): Promise<void> {
  const isDraft = await getArticlesByField(bookType, 'chapter', chapter).then(
    (result) => result.some((value) => value.isDraft)
  );

  const articleId = article.id;
  const updatedArticle = article;
  delete updatedArticle.id;

  if (isDraft) {
    await database
      .collection('books')
      .doc(bookType)
      .collection(bookType)
      .doc(articleId)
      .set(updatedArticle);
  } else {
    await createArticle(bookType, updatedArticle).then(() =>
      markArticleForDeletion(bookType, articleId ?? '')
    );
  }
}

async function updateArticles(
  bookType: string,
  articles: Article[]
): Promise<void> {
  const batch = database.batch();
  await database
    .collection('books')
    .doc(bookType)
    .collection(bookType)
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((doc) => batch.delete(doc.ref))
    );
  articles.forEach((article) => {
    const doc = article as any;
    delete doc.id;
    const docRef = database
      .collection('books')
      .doc(bookType)
      .collection(bookType)
      .doc();
    batch.set(docRef, doc);
  });

  return batch.commit();
}

const articleRepository = {
  createArticle,
  getArticles,
  getAllArticles,
  getArticleById,
  getArticlesByField,
  deleteArticle,
  removeMarkForDeletion,
  markArticleForDeletion,
  updateArticle,
  updateArticles,
};

export default articleRepository;

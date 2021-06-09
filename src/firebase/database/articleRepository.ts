import firebase from 'firebase/app';
import { database } from '../firebaseConnection';

export interface Article {
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

async function createArticle(article: Article): Promise<void> {
  await database.collection('regulations').add(article);
}

async function deleteArticle(articleId: string): Promise<void> {
  await database.collection('regulations').doc(articleId).delete();
}

async function markArticleForDeletion(articleId: string): Promise<void> {
  await database
    .collection('regulations')
    .doc(articleId)
    .update({ markedForDeletion: true });
}

async function removeMarkForDeletion(articleId: string): Promise<void> {
  const articleRef = database.collection('regulations').doc(articleId);
  return articleRef.update({
    markedForDeletion: firebase.firestore.FieldValue.delete(),
  });
}

async function getArticles(draftArticles: boolean): Promise<Article[]> {
  const querySnapshot = await database
    .collection('regulations')
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

async function getArticleById(id: string): Promise<Article> {
  const documentSnapshot = await database
    .collection('regulations')
    .doc(id)
    .get();
  return { id: documentSnapshot.id, ...documentSnapshot.data() } as Article;
}

async function getArticlesByField(
  fieldName: string,
  fieldValue: string
): Promise<Article[]> {
  const querySnapshot = await database
    .collection('regulations')
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Article;
  });
}

async function updateArticle(chapter: string, article: Article): Promise<void> {
  const isDraft = await getArticlesByField('chapter', chapter).then((result) =>
    result.some((value) => value.isDraft)
  );

  const articleId = article.id;
  const updatedArticle = article;
  delete updatedArticle.id;

  if (isDraft) {
    await database.collection('regulations').doc(articleId).set(updatedArticle);
  } else {
    await createArticle(updatedArticle).then(() =>
      markArticleForDeletion(articleId ?? '')
    );
  }
}

const articleRepository = {
  createArticle,
  getArticles,
  getArticleById,
  getArticlesByField,
  deleteArticle,
  removeMarkForDeletion,
  markArticleForDeletion,
  updateArticle,
};

export default articleRepository;

import firebase from 'firebase/app';
import { database } from '../firebaseConnection';
import { BookType } from '../../model/BookType';
import { Article } from '../../model/Article';

async function createArticle(
  bookType: BookType,
  article: Article
): Promise<void> {
  await database.collection(bookType).add(article);
}

async function deleteArticle(
  bookType: BookType,
  articleId: string
): Promise<void> {
  await database.collection(bookType).doc(articleId).delete();
}

async function markArticleForDeletion(
  bookType: BookType,
  articleId: string
): Promise<void> {
  await database
    .collection(bookType)
    .doc(articleId)
    .update({ markedForDeletion: true });
}

async function removeMarkForDeletion(
  bookType: BookType,
  articleId: string
): Promise<void> {
  const articleRef = database.collection(bookType).doc(articleId);
  return articleRef.update({
    markedForDeletion: firebase.firestore.FieldValue.delete(),
  });
}

async function getArticles(
  bookType: BookType,
  draftArticles: boolean
): Promise<Article[]> {
  const querySnapshot = await database
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
  bookType: BookType,
  id: string
): Promise<Article> {
  const documentSnapshot = await database.collection(bookType).doc(id).get();
  return { id: documentSnapshot.id, ...documentSnapshot.data() } as Article;
}

async function getArticlesByField(
  bookType: BookType,
  fieldName: string,
  fieldValue: string
): Promise<Article[]> {
  const querySnapshot = await database
    .collection(bookType)
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Article;
  });
}

async function updateArticle(
  bookType: BookType,
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
    await database.collection(bookType).doc(articleId).set(updatedArticle);
  } else {
    await createArticle(bookType, updatedArticle).then(() =>
      markArticleForDeletion(bookType, articleId ?? '')
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

import firebase from 'firebase/app';
import { database } from '../firebaseConnection';
import { ArticleType } from '../../model/ArticleType';
import { Article } from '../../model/Article';

async function createArticle(
  articleType: ArticleType,
  article: Article
): Promise<void> {
  await database.collection(articleType).add(article);
}

async function deleteArticle(
  articleType: ArticleType,
  articleId: string
): Promise<void> {
  await database.collection(articleType).doc(articleId).delete();
}

async function markArticleForDeletion(
  articleType: ArticleType,
  articleId: string
): Promise<void> {
  await database
    .collection(articleType)
    .doc(articleId)
    .update({ markedForDeletion: true });
}

async function removeMarkForDeletion(
  articleType: ArticleType,
  articleId: string
): Promise<void> {
  const articleRef = database.collection(articleType).doc(articleId);
  return articleRef.update({
    markedForDeletion: firebase.firestore.FieldValue.delete(),
  });
}

async function getArticles(
  articleType: ArticleType,
  draftArticles: boolean
): Promise<Article[]> {
  const querySnapshot = await database
    .collection(articleType)
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
  articleType: ArticleType,
  id: string
): Promise<Article> {
  const documentSnapshot = await database.collection(articleType).doc(id).get();
  return { id: documentSnapshot.id, ...documentSnapshot.data() } as Article;
}

async function getArticlesByField(
  articleType: ArticleType,
  fieldName: string,
  fieldValue: string
): Promise<Article[]> {
  const querySnapshot = await database
    .collection(articleType)
    .where(fieldName, '==', fieldValue)
    .get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Article;
  });
}

async function updateArticle(
  articleType: ArticleType,
  chapter: string,
  article: Article
): Promise<void> {
  const isDraft = await getArticlesByField(
    articleType,
    'chapter',
    chapter
  ).then((result) => result.some((value) => value.isDraft));

  const articleId = article.id;
  const updatedArticle = article;
  delete updatedArticle.id;

  if (isDraft) {
    await database.collection(articleType).doc(articleId).set(updatedArticle);
  } else {
    await createArticle(articleType, updatedArticle).then(() =>
      markArticleForDeletion(articleType, articleId ?? '')
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

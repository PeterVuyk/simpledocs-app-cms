import * as Yup from 'yup';
import { Article } from '../../../../model/Article';
import articleRepository from '../../../../firebase/database/articleRepository';

async function isPageIndexUnique(
  index: any,
  bookType: string,
  article: Article | undefined
): Promise<boolean> {
  if (index === undefined) {
    return true;
  }
  const articles: Article[] = await articleRepository.getArticlesByField(
    bookType,
    'pageIndex',
    index
  );
  return (
    articles.length === 0 ||
    (article !== undefined &&
      articles.filter((value) => value.id !== article.id).length === 0)
  );
}

/**
 * Both params are undefined when it is about a new (draft) article
 * @param article
 * @param bookType
 */
const validatePageIndex = (
  article: Article | undefined,
  bookType: string | undefined
) => {
  return Yup.number()
    .integer()
    .positive()
    .required('Pagina index is een verplicht veld.')
    .test(
      'pageIndex',
      'Het opgegeven pagina index bestaat al en moet uniek zijn',
      async (index, context) => {
        const isEditFromDraft =
          article !== undefined &&
          article.isDraft &&
          article.pageIndex === index;
        return (
          // !differentChapterWithSameIndex &&
          isEditFromDraft ||
          isPageIndexUnique(index, bookType ?? context.parent.bookType, article)
        );
      }
    );
};

export default validatePageIndex;

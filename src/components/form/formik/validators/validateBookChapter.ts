import * as Yup from 'yup';
import { StringSchema } from 'yup';
import { Article } from '../../../../model/Article';
import articleRepository from '../../../../firebase/database/articleRepository';

async function isChapterUnique(
  fieldValue: any,
  bookType: string,
  article: Article | undefined
): Promise<boolean> {
  if (fieldValue === undefined) {
    return true;
  }
  const articles: Article[] = await articleRepository.getArticlesByField(
    bookType,
    'chapter',
    fieldValue
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
const validateBookChapter = (
  article: Article | undefined,
  bookType: string | undefined
): StringSchema<string | null | undefined> => {
  return Yup.string()
    .required('Hoofdstuk is een verplicht veld.')
    .test(
      'title',
      'De titel mag geen spaties of slash (/) bevatten.',
      async (title) => {
        if (title === undefined) {
          return true;
        }
        const includeInvalidChar = title.includes(' ') || title.includes('/');
        return !includeInvalidChar;
      }
    )
    .test(
      'chapter',
      'Het opgegeven hoofdstuk bestaat al en moet uniek zijn',
      async (chapter, context) => {
        const isEditFromDraft =
          article !== undefined &&
          article.isDraft &&
          article.chapter === chapter;
        return (
          isEditFromDraft ||
          isChapterUnique(chapter, bookType ?? context.parent.bookType, article)
        );
      }
    );
};

export default validateBookChapter;

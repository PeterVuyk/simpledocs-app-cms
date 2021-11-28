import * as Yup from 'yup';
import { StringSchema } from 'yup';
import { Page } from '../../../../model/Page';
import bookRepository from '../../../../firebase/database/bookRepository';

async function isChapterUnique(
  fieldValue: any,
  bookType: string,
  page: Page | undefined
): Promise<boolean> {
  if (fieldValue === undefined) {
    return true;
  }
  const pages: Page[] = await bookRepository.getPagesByField(
    bookType,
    'chapter',
    fieldValue
  );
  return (
    pages.length === 0 ||
    (page !== undefined &&
      pages.filter((value) => value.id !== page.id).length === 0)
  );
}

/**
 * Both params are undefined when it is about a new (draft) page
 * @param page
 * @param bookType
 */
const validateBookChapter = (
  page: Page | undefined,
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
          page !== undefined && page.isDraft && page.chapter === chapter;
        return (
          isEditFromDraft ||
          isChapterUnique(chapter, bookType ?? context.parent.bookType, page)
        );
      }
    );
};

export default validateBookChapter;

import * as Yup from 'yup';
import { Page } from '../../../../model/Page';
import bookRepository from '../../../../firebase/database/bookRepository';

async function isPageIndexUnique(
  index: any,
  bookType: string,
  page: Page | undefined
): Promise<boolean> {
  if (index === undefined) {
    return true;
  }
  const pages: Page[] = await bookRepository.getPagesByField(
    bookType,
    'pageIndex',
    index
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
const validatePageIndex = (
  page: Page | undefined,
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
          page !== undefined && page.isDraft && page.pageIndex === index;
        return (
          // !differentChapterWithSameIndex &&
          isEditFromDraft ||
          isPageIndexUnique(index, bookType ?? context.parent.bookType, page)
        );
      }
    );
};

export default validatePageIndex;

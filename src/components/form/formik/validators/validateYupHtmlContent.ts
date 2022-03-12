import * as Yup from 'yup';
import { StringSchema } from 'yup';
import { CONTENT_TYPE_HTML, ContentType } from '../../../../model/ContentType';

const validateYupHtmlContent = (
  contentType: ContentType
): StringSchema<string | null | undefined> => {
  return Yup.string()
    .nullable()
    .test(
      'htmlContent',
      'Het toevoegen van een html bestand is verplicht.',
      async (htmlContent) => {
        return contentType !== CONTENT_TYPE_HTML || htmlContent !== null;
      }
    );
};

export default validateYupHtmlContent;

import * as Yup from 'yup';
import { StringSchema } from 'yup';
import {
  CONTENT_TYPE_HTML,
  ContentType,
} from '../../../../model/artifacts/Artifact';

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
    )
    .test(
      'htmlContent',
      'De inhoud van het artikel moet in een article-tag staan, de zoekfunctie van de app zoekt vervolgens alleen tussen deze tags: <article></article>',
      async (htmlContent) => {
        return (
          contentType !== CONTENT_TYPE_HTML ||
          (htmlContent !== undefined &&
            (htmlContent as string).includes('<article>') &&
            (htmlContent as string).includes('</article>'))
        );
      }
    );
};

export default validateYupHtmlContent;

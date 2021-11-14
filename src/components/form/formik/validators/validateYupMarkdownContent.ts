import * as Yup from 'yup';
import { StringSchema } from 'yup';
import {
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../../../model/artifacts/Artifact';

const validateYupMarkdownContent = (
  contentType: ContentType
): StringSchema<string | null | undefined> => {
  return Yup.string()
    .nullable()
    .test(
      'markdownContent',
      'Het toevoegen van een markdown bestand is verplicht.',
      async (markdownContent) => {
        return (
          contentType !== CONTENT_TYPE_MARKDOWN || markdownContent !== null
        );
      }
    );
};

export default validateYupMarkdownContent;

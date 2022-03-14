import * as Yup from 'yup';
import { StringSchema } from 'yup';
import {
  CONTENT_TYPE_CALCULATIONS,
  ContentType,
} from '../../../../model/ContentType';

const validateYupCalculationsContent = (
  contentType: ContentType
): StringSchema<string | null | undefined> => {
  return Yup.string()
    .nullable()
    .test(
      'calculationsContent',
      'Het kiezen van een berekening is verplicht.',
      async (calculation) => {
        return (
          contentType !== CONTENT_TYPE_CALCULATIONS || calculation !== undefined
        );
      }
    );
};

export default validateYupCalculationsContent;

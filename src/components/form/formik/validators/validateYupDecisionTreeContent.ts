import * as Yup from 'yup';
import { StringSchema } from 'yup';
import {
  CONTENT_TYPE_DECISION_TREE,
  ContentType,
} from '../../../../model/ContentType';

const validateYupMarkdownContent = (
  contentType: ContentType
): StringSchema<string | null | undefined> => {
  return Yup.string()
    .nullable()
    .test(
      'decisionTreeContent',
      'Het kiezen van een beslisboom is verplicht.',
      async (decisionTree) => {
        return (
          contentType !== CONTENT_TYPE_DECISION_TREE ||
          decisionTree !== undefined
        );
      }
    );
};

export default validateYupMarkdownContent;

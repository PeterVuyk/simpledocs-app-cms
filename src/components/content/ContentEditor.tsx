import React, { FC } from 'react';
import { FastField } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { FastFieldProps } from 'formik/dist/FastField';
import HtmlEditor from '../form/formik/editor/htmlEditor/HtmlEditor';
import MarkdownEditor from '../form/formik/editor/markdownEditor/MarkdownEditor';
import {
  CONTENT_TYPE_CALCULATIONS,
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';
import DecisionTreeSelector from './DecisionTreeSelector';
import CalculationsSelector from './CalculationsSelector';
import VisibleHiddenToggleContainer from '../VisibleHiddenToggleContainer';

interface Props {
  contentTypeToggle: ContentType | undefined;
  showError: boolean;
  formik: React.MutableRefObject<any>;
  initialContent: string | null;
  initialContentType: ContentType | undefined;
  allowedContentTypes: ContentType[];
}

const ContentEditor: FC<Props> = ({
  showError,
  formik,
  initialContent,
  initialContentType,
  contentTypeToggle,
  allowedContentTypes,
}) => {
  return (
    <>
      {allowedContentTypes.includes(CONTENT_TYPE_HTML) && (
        <VisibleHiddenToggleContainer
          visible={contentTypeToggle === CONTENT_TYPE_HTML}
        >
          <FastField name="htmlContent">
            {(props: FastFieldProps) => (
              <HtmlEditor
                meta={props.meta}
                showError={showError}
                formik={formik}
                initialFile={
                  initialContentType === CONTENT_TYPE_HTML && initialContent
                    ? initialContent
                    : null
                }
              />
            )}
          </FastField>
        </VisibleHiddenToggleContainer>
      )}
      {allowedContentTypes.includes(CONTENT_TYPE_MARKDOWN) && (
        <VisibleHiddenToggleContainer
          visible={contentTypeToggle === CONTENT_TYPE_MARKDOWN}
        >
          <FastField name="markdownContent">
            {(props: FastFieldProps) => (
              <MarkdownEditor
                meta={props.meta}
                showError={showError}
                formik={formik}
                initialFile={
                  initialContentType === CONTENT_TYPE_MARKDOWN && initialContent
                    ? initialContent
                    : null
                }
              />
            )}
          </FastField>
        </VisibleHiddenToggleContainer>
      )}
      {allowedContentTypes.includes(CONTENT_TYPE_DECISION_TREE) && (
        <VisibleHiddenToggleContainer
          visible={contentTypeToggle === CONTENT_TYPE_DECISION_TREE}
        >
          <DecisionTreeSelector
            formik={formik}
            showError={showError}
            initialValue={
              initialContentType === CONTENT_TYPE_DECISION_TREE &&
              initialContent
                ? initialContent
                : null
            }
          />
        </VisibleHiddenToggleContainer>
      )}
      {allowedContentTypes.includes(CONTENT_TYPE_CALCULATIONS) && (
        <VisibleHiddenToggleContainer
          visible={contentTypeToggle === CONTENT_TYPE_CALCULATIONS}
        >
          <CalculationsSelector
            formik={formik}
            showError={showError}
            initialValue={
              initialContentType === CONTENT_TYPE_CALCULATIONS && initialContent
                ? initialContent
                : null
            }
          />
        </VisibleHiddenToggleContainer>
      )}
    </>
  );
};

export default ContentEditor;

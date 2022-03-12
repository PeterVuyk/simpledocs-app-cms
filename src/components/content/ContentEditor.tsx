import React, { FC } from 'react';
import { FastField } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { FastFieldProps } from 'formik/dist/FastField';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import HtmlEditor from '../form/formik/editor/htmlEditor/HtmlEditor';
import MarkdownEditor from '../form/formik/editor/markdownEditor/MarkdownEditor';
import {
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';
import DecisionTreeSelector from './DecisionTreeSelector';

const useStyles = makeStyles({
  hiddenContainer: {
    opacity: 0,
    position: 'absolute',
    zIndex: 12,
    top: 0,
    left: -1000000,
  },
  relativeContainer: {
    position: 'relative',
  },
});

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
  const classes = useStyles();

  return (
    <>
      {allowedContentTypes.includes(CONTENT_TYPE_HTML) && (
        <div
          className={clsx(
            contentTypeToggle === CONTENT_TYPE_HTML
              ? {}
              : classes.hiddenContainer
          )}
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
        </div>
      )}
      {allowedContentTypes.includes(CONTENT_TYPE_MARKDOWN) && (
        <div
          className={clsx(
            contentTypeToggle === CONTENT_TYPE_MARKDOWN
              ? {}
              : classes.hiddenContainer
          )}
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
        </div>
      )}
      {allowedContentTypes.includes(CONTENT_TYPE_DECISION_TREE) && (
        <div
          className={clsx(
            contentTypeToggle === CONTENT_TYPE_DECISION_TREE
              ? {}
              : classes.hiddenContainer
          )}
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
        </div>
      )}
    </>
  );
};

export default ContentEditor;

import React, { FC } from 'react';
import { FastField } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { FastFieldProps } from 'formik/dist/FastField';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/artifacts/Artifact';
import HtmlEditor from '../form/formik/editor/htmlEditor/HtmlEditor';
import MarkdownEditor from '../form/formik/editor/markdownEditor/MarkdownEditor';

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
  initialFile: string | null;
  initialFileType: ContentType | undefined;
}

const ContentEditor: FC<Props> = ({
  showError,
  formik,
  initialFile,
  initialFileType,
  contentTypeToggle,
}) => {
  const classes = useStyles();

  return (
    <>
      <div
        className={clsx(
          contentTypeToggle === CONTENT_TYPE_MARKDOWN
            ? classes.hiddenContainer
            : {}
        )}
      >
        <FastField name="htmlContent">
          {(props: FastFieldProps) => (
            <HtmlEditor
              meta={props.meta}
              showError={showError}
              formik={formik}
              initialFile={
                initialFileType === CONTENT_TYPE_HTML && initialFile
                  ? initialFile
                  : null
              }
            />
          )}
        </FastField>
      </div>
      <div
        className={clsx(
          contentTypeToggle === CONTENT_TYPE_HTML ? classes.hiddenContainer : {}
        )}
      >
        <FastField name="markdownContent">
          {(props: FastFieldProps) => (
            <MarkdownEditor
              meta={props.meta}
              showError={showError}
              formik={formik}
              initialFile={
                initialFileType === CONTENT_TYPE_MARKDOWN && initialFile
                  ? initialFile
                  : null
              }
            />
          )}
        </FastField>
      </div>
    </>
  );
};

export default ContentEditor;

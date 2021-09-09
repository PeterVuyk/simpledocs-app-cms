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
} from '../../model/Artifact';
import HtmlEditor from '../form/formik/htmlEditor/HtmlEditor';

const useStyles = makeStyles({
  hiddenContainer: {
    opacity: 0,
  },
});

interface Props {
  contentTypeToggle: ContentType | undefined;
  showError: boolean;
  formik: any;
  initialFile: string | null;
}

const ContentEditor: FC<Props> = ({
  showError,
  formik,
  initialFile,
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
              initialFile={initialFile ?? null}
            />
          )}
        </FastField>
      </div>
      <div
        className={clsx(
          contentTypeToggle === CONTENT_TYPE_HTML ? classes.hiddenContainer : {}
        )}
      >
        <p>Add Markdown functionality</p>
      </div>
    </>
  );
};

export default ContentEditor;

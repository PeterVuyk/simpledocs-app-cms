import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import SaveIcon from '@material-ui/icons/Save';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomHtmlToolbox from './toolbox/BottomHtmlToolbox';
import FileDropzoneArea from '../../FileDropzoneArea';
import ErrorTextTypography from '../../../text/ErrorTextTypography';
import htmlFileHelper from '../../../../helper/htmlFileHelper';
import LoadingSpinner from '../../../LoadingSpinner';
import artifactsRepository from '../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_TEMPLATE } from '../../../../model/ArtifactType';
import base64Helper from '../../../../helper/base64Helper';
import useStylesheet from '../../../hooks/useStylesheet';
import stylesheetHelper from '../../../../helper/stylesheetHelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: 8,
    },
    relativeContainer: {
      position: 'relative',
    },
    saveIcon: {
      position: 'absolute',
      zIndex: 1000,
      right: 50,
      top: 50,
      backgroundColor: '#fff',
      color: '#099000FF',
      fontSize: 'xxx-large',
    },
    formControl: {
      margin: theme.spacing(1),
      position: 'absolute',
      zIndex: 1000,
      right: 10,
      bottom: 30,
    },
  })
);

interface Props {
  meta: any;
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const HtmlEditor: FC<Props> = ({ formik, initialFile, showError, meta }) => {
  const editor = useRef<JoditEditor | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState<boolean>(false);
  const stylesheet = useStylesheet();
  const classes = useStyles();

  const getErrorMessage = (): string => {
    if (showError && meta.error) {
      return meta.error;
    }
    return '';
  };

  const showSaveButton = () => {
    setSaveButtonVisible(true);
    setTimeout(() => {
      setSaveButtonVisible(false);
    }, 5000);
  };

  const handleUpdateFile = (file: string) => {
    if (content === file) {
      return;
    }
    formik.current?.setFieldValue('htmlFile', file);
    setContent(pretty(stylesheetHelper.addStylesheet(file, stylesheet)));
    showSaveButton();
  };

  const handleUpdateFileFromBase64 = useCallback(
    (file: string | null) => {
      const html = file ? base64Helper.getBodyFromBase64(file, 'html') : '';
      formik.current?.setFieldValue('htmlFile', html);
      setContent(pretty(stylesheetHelper.addStylesheet(html, stylesheet)));
    },
    [formik, stylesheet]
  );

  const getBase64HtmlFile = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return base64Helper.getBase64FromFile(content, 'html');
  };

  useEffect(() => {
    async function setInitialHtmlFile() {
      if (stylesheet === undefined) {
        return;
      }
      let html = initialFile;
      if (html) {
        html = htmlFileHelper.stripMetaTags(html);
        html = htmlFileHelper.stripBottomSpacing(html);
        html = stylesheetHelper.addStylesheet(html, stylesheet);
      } else {
        // Use the 'default' template.
        html = await artifactsRepository
          .getArtifactByTitle('Standaard', ARTIFACT_TYPE_TEMPLATE)
          .then((value) =>
            value ? stylesheetHelper.addStylesheet(value.file, stylesheet) : ''
          );
      }
      formik.current?.setFieldValue('htmlFile', html);
      setContent(html);
    }
    setInitialHtmlFile();
  }, [formik, initialFile, stylesheet]);

  const config = {
    // all options check: https://xdsoft.net/jodit/doc/
    height: 600,
    readonly: false,
    iframe: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  };

  if (content === null || stylesheet === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className={classes.relativeContainer}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      {saveButtonVisible && <SaveIcon className={classes.saveIcon} />}
      <div className={classes.relativeContainer}>
        <div className={classes.formControl}>
          <BottomHtmlToolbox onUpdateFile={handleUpdateFile} />
        </div>
        <JoditEditor
          ref={editor}
          value={content ?? ''}
          // @ts-ignore
          config={config}
          onBlur={handleUpdateFile}
        />
      </div>
      <FileDropzoneArea
        allowedExtension=".html"
        allowedMimeTypes={['text/html']}
        initialFile={getBase64HtmlFile()}
        onUpdateFile={handleUpdateFileFromBase64}
      />
    </div>
  );
};

export default HtmlEditor;
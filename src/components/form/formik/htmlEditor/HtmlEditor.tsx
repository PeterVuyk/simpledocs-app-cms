import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import SaveIcon from '@material-ui/icons/Save';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomHtmlToolbox from './toolbox/BottomHtmlToolbox';
import FileDropzoneArea from './FileDropzoneArea';
import ErrorTextTypography from '../../../text/ErrorTextTypography';
import htmlFileHelper from '../../../../helper/htmlFileHelper';
import htmlFileInfoRepository from '../../../../firebase/database/htmlFileInfoRepository';
import { HTML_FILE_CATEGORY_TEMPLATE } from '../../../../model/HtmlFileCategory';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      position: 'absolute',
      left: '50%',
      top: 300,
    },
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
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const classes = useStyles();

  const getErrorMessage = (): string => {
    if (showError && meta.error) {
      return meta.error;
    }
    return '';
  };

  const showSaveButtonHandle = () => {
    setShowSaveButton(true);
    setTimeout(() => {
      setShowSaveButton(false);
    }, 5000);
  };

  const updateFileHandler = (file: string) => {
    formik.current.setFieldValue('htmlFile', file);
    setContent(file);
    showSaveButtonHandle();
  };

  const updateFileFromBase64Handler = useCallback(
    (file: string | null) => {
      const html = file ? htmlFileHelper.getHTMLBodyFromBase64(file) : '';
      formik.current.setFieldValue('htmlFile', html);
      setContent(html);
    },
    [formik]
  );

  const getBase64HtmlFile = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return htmlFileHelper.getBase64FromHtml(content);
  };

  useEffect(() => {
    async function setInitialHtmlFile() {
      let html = initialFile;
      if (html) {
        html = htmlFileHelper.stripMetaTags(html);
        html = htmlFileHelper.stripBottomSpacing(html);
      } else {
        // Use the 'default' template.
        html =
          (
            await htmlFileInfoRepository.getHtmlFileInfoByTitle(
              'Standaard',
              HTML_FILE_CATEGORY_TEMPLATE
            )
          )?.htmlFile ?? '';
      }
      formik.current.setFieldValue('htmlFile', html);
      setContent(html);
    }
    setInitialHtmlFile();
  }, [formik, initialFile]);

  const config = {
    // all options check: https://xdsoft.net/jodit/doc/
    height: 600,
    readonly: false,
    useSplitMode: true,
    iframe: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  };

  if (content === null) {
    return (
      <div className={classes.relativeContainer}>
        <div className={classes.center}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.relativeContainer}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      {showSaveButton && <SaveIcon className={classes.saveIcon} />}
      <div className={classes.relativeContainer}>
        <div className={classes.formControl}>
          <BottomHtmlToolbox updateFileHandler={updateFileHandler} />
        </div>
        <JoditEditor
          ref={editor}
          value={content ?? ''}
          // @ts-ignore
          config={config}
          onBlur={updateFileHandler}
        />
      </div>
      <FileDropzoneArea
        allowedExtension=".html"
        allowedMimeTypes={['text/html']}
        initialFile={getBase64HtmlFile()}
        updateFileHandler={updateFileFromBase64Handler}
      />
    </div>
  );
};

export default HtmlEditor;

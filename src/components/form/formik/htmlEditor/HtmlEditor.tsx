import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import SaveIcon from '@material-ui/icons/Save';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomHtmlToolbox from './toolbox/BottomHtmlToolbox';
import FileDropzoneArea from './FileDropzoneArea';
import ErrorTextTypography from '../../../text/ErrorTextTypography';
import htmlFileHelper from '../../../../helper/htmlFileHelper';
import LoadingSpinner from '../../../LoadingSpinner';
import htmlFileInfoRepository from '../../../../firebase/database/htmlFileInfoRepository';
import { HTML_FILE_CATEGORY_TEMPLATE } from '../../../../model/HtmlFileCategory';

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
    formik.current.setFieldValue('htmlFile', file);
    setContent(file);
    showSaveButton();
  };

  const handleUpdateFileFromBase64 = useCallback(
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

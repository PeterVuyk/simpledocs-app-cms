import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import SaveIcon from '@material-ui/icons/Save';
import { CircularProgress, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import StyleIcon from '@material-ui/icons/Style';
// eslint-disable-next-line import/no-unresolved
import FileDropzoneArea from '../FileDropzoneArea';
import ErrorTextTypography from '../../text/ErrorTextTypography';
import htmlFileHelper from '../../../helper/htmlFileHelper';
import htmlTemplateRepository from '../../../firebase/database/htmlTemplateRepository';
import HtmlTemplateMenu from './HtmlTemplateMenu';

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
      right: 5,
      bottom: 25,
    },
  })
);

interface Props {
  meta: any;
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const ArticleEditor: FC<Props> = ({ formik, initialFile, showError, meta }) => {
  const editor = useRef<JoditEditor | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const [templateMenu, setTemplateMenu] = useState<null | HTMLElement>(null);
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
    showSaveButtonHandle();
    formik.current.setFieldValue('htmlFile', file);
    setContent(file);
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
      } else {
        html =
          (await htmlTemplateRepository.getDefaultHtmlTemplate())?.htmlFile ??
          '';
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
  };

  const openHtmlTemplateMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTemplateMenu(event.currentTarget);
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
          <Tooltip title="Template gebruiken">
            <Button
              className={classes.button}
              variant="contained"
              onClick={openHtmlTemplateMenu}
            >
              <StyleIcon />
            </Button>
          </Tooltip>
          <HtmlTemplateMenu
            templateMenu={templateMenu}
            setTemplateMenu={setTemplateMenu}
            updateFileHandler={updateFileHandler}
          />
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

export default ArticleEditor;

import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import { useField } from 'formik';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { CircularProgress, InputLabel } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FileDropzoneArea from '../FileDropzoneArea';
import ErrorTextTypography from '../../text/ErrorTextTypography';
import htmlFileHelper from '../../../helper/htmlFileHelper';
import { HtmlTemplate } from '../../../model/HtmlTemplate';
import htmlTemplateRepository from '../../../firebase/database/htmlTemplateRepository';
import logger from '../../../helper/logger';

interface Props {
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      position: 'absolute',
      left: '50%',
      top: 300,
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
      backgroundColor: '#fff',
    },
  })
);

const ArticleEditor: FC<Props> = ({ formik, initialFile, showError }) => {
  const editor = useRef<JoditEditor | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  React.useState<null | HTMLElement>(null);
  const [templates, setTemplates] = React.useState<HtmlTemplate[] | null>(null);
  const [currentTemplate, setCurrentTemplate] = React.useState<string>('none');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, mata] = useField('htmlFile');
  const classes = useStyles();

  const getErrorMessage = (): string => {
    if (showError && mata.error) {
      return mata.error;
    }
    return '';
  };

  const showSaveButtonHandle = () => {
    setShowSaveButton(true);
    setTimeout(() => {
      setShowSaveButton(false);
    }, 5000);
  };

  const updateFileHandler = useCallback(
    (file: string) => {
      showSaveButtonHandle();
      formik.current.setFieldValue('htmlFile', file);
      setContent(file);
    },
    [formik]
  );

  const updateFileFromBase64Handler = useCallback(
    (file: string | null) => {
      const html = file ? htmlFileHelper.getHTMLBodyFromBase64(file) : '';
      formik.current.setFieldValue('htmlFile', html);
      setContent(html);
      setCurrentTemplate('');
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
          (await htmlTemplateRepository.getDefaultHtmlTemplate())
            ?.htmlTemplate ?? '';
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

  useEffect(() => {
    htmlTemplateRepository
      .getHtmlTemplates()
      .then(setTemplates)
      .catch((reason) =>
        logger.errorWithReason(
          'Failed collecting the html templates from htmlTemplateRepository.getHtmlTemplates for the ArticleEditor component',
          reason
        )
      );
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentTemplate(event.target.value as string);
    const template = templates!.find(
      (value) => value.id === event.target.value
    );

    if (template) {
      updateFileHandler(template.htmlTemplate);
    }
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
        {templates && (
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-simple-select-filled-label">
              Template
            </InputLabel>
            <Select
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
              style={{ minWidth: 200 }}
              labelId="html-template"
              id="html-template"
              value={currentTemplate}
              onChange={handleChange}
              name="html-template"
            >
              <MenuItem key="" value="none">
                Geen
              </MenuItem>
              {templates.map((template) => (
                <MenuItem key={template.id.toString()} value={template.id}>
                  {template.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <JoditEditor
          ref={editor}
          value={content ?? ''}
          // @ts-ignore
          config={config}
          onBlur={(newContent) => {
            setCurrentTemplate('');
            updateFileHandler(newContent);
          }}
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

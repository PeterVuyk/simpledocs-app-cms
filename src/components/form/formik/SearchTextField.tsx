import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { useField, useFormikContext } from 'formik';
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import CodeIcon from '@material-ui/icons/Code';
import { Tooltip } from '@material-ui/core';
import TextField from './TextField';
import { CONTENT_TYPE_MARKDOWN, ContentType } from '../../../model/Artifact';

interface Props {
  contentTypeToggle: ContentType;
  showError: boolean;
}

const SearchTextField: FC<Props> = ({ contentTypeToggle, showError }) => {
  const formikProps = useFormikContext();
  const [searchTextField] = useField('searchText');
  const [htmlContentField] = useField('htmlContent');
  const [markdownContentField] = useField('markdownContent');

  const stripLastLines = (text: string) => {
    const lines = text.split('\n').reverse();
    // eslint-disable-next-line no-restricted-syntax
    for (const line of text.split('\n').reverse()) {
      if (line !== '') {
        break;
      }
      lines.splice(0, 1);
    }
    return lines.reverse().join('\n');
  };

  const stripFirstLines = (text: string) => {
    const lines = text.split('\n');
    // eslint-disable-next-line no-restricted-syntax
    for (const line of text.split('\n')) {
      if (line !== '') {
        break;
      }
      lines.splice(0, 1);
    }
    return lines.join('\n');
  };

  const removeIndentation = (indentedString: string) => {
    let text = indentedString
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
    text = stripFirstLines(text);
    text = stripLastLines(text);
    formikProps.setFieldValue('searchText', text);
  };

  const importMarkdownContentValue = () => {
    const markdown = markdownContentField.value as string;
    if (markdown === '') {
      formikProps.setFieldValue('searchText', '');
    }
    const markdownText = markdown
      .replace(/^### (.*$)/gim, '$1')
      .replace(/^## (.*$)/gim, '$1')
      .replace(/^# (.*$)/gim, '$1')
      .replace(/^\> (.*$)/gim, '$1')
      .replace(/\*\*(.*)\*\*/gim, '$1')
      .replace(/\*(.*)\*/gim, '$1')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '$1')
      .replace(/\n$/gim, '')
      .trim();
    return removeIndentation(markdownText);
  };

  const importHtmlContentValue = () => {
    let html = htmlContentField.value as string;
    if (html === '') {
      formikProps.setFieldValue('searchText', '');
      return;
    }
    const splitHtml = html.split('</style>');
    if (splitHtml.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      html = splitHtml[1];
    }
    const text = html.replace(/<[^>]+>/g, '');
    removeIndentation(text);
  };

  // TODO: Ook werkend maken voor markdown
  return (
    <>
      <Tooltip title="Tekst in zoektekst plaatsen">
        <Button
          disableElevation
          style={{
            marginLeft: 8,
            float: 'right',
            marginBottom: 5,
          }}
          variant="contained"
          onClick={
            contentTypeToggle === CONTENT_TYPE_MARKDOWN
              ? importMarkdownContentValue
              : importHtmlContentValue
          }
        >
          <CodeIcon color="inherit" />
        </Button>
      </Tooltip>
      <Tooltip title="Inspringing verwijderen">
        <Button
          disableElevation
          style={{
            float: 'right',
            marginBottom: 5,
          }}
          variant="contained"
          onClick={() => removeIndentation(searchTextField.value as string)}
        >
          <FormatIndentDecreaseIcon color="inherit" />
        </Button>
      </Tooltip>
      <TextField
        multiline
        // @ts-ignore
        value={formikProps.values.searchText}
        onChange={formikProps.handleChange}
        showError={showError}
        rows={5}
        rowsMax={12}
        required
        id="searchText"
        label="Zoektekst"
        name="searchText"
      />
    </>
  );
};

export default SearchTextField;

import showdown from 'showdown';
import {
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/artifacts/Artifact';
import getTextFromHtml from '../../firebase/functions/getTextFromHtml';

const getTextFromSourceCode = (
  content: string,
  contentType: ContentType
): Promise<string> => {
  if (content === '') {
    return Promise.resolve('');
  }

  let html = content;
  if (contentType === CONTENT_TYPE_MARKDOWN) {
    const converter = new showdown.Converter();
    html = converter.makeHtml(content);
  }
  return getTextFromHtml(html);
};

export default getTextFromSourceCode;
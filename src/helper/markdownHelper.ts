import matchAll from 'string.prototype.matchall';

const replaceSingleBackticks = (text: string) => {
  return text
    .replaceAll('```', 'TEMPORARY-REPLACEMENT')
    .replaceAll('`', 'TEMPORARY-REPLACEMENT')
    .replaceAll('TEMPORARY-REPLACEMENT', '```');
};

const replaceIndentationWithBackticks = (text: string) => {
  const updatedLines: string[] = [];
  let isInsideCodeBlock = false;
  let isPreviousLineBlank = false;
  const lines = text.split('\n');
  for (const line of lines) {
    if (isInsideCodeBlock && !line.startsWith('    ')) {
      isInsideCodeBlock = false;
      updatedLines.push('```');
    }
    if (isPreviousLineBlank && !isInsideCodeBlock && line.startsWith('    ')) {
      isInsideCodeBlock = true;
      updatedLines.push('```');
    }
    if (isInsideCodeBlock && line.startsWith('    ')) {
      updatedLines.push(line.slice(4));
      continue;
    }
    isPreviousLineBlank = line === '';
    updatedLines.push(line);
  }
  return updatedLines.join('\n');
};

const modifyMarkdownForStorage = (text: string) => {
  return replaceIndentationWithBackticks(replaceSingleBackticks(text));
};

const stripBoldAsterisks = (text: string) => {
  return text.split('*').join('');
};

const stripItalicUnderscores = (text: string) => {
  return text.split('_').join('');
};

const stripBackticks = (text: string) => {
  return text.split('`').join('');
};

const stripHeadingLevel = (text: string) => {
  if (text.split('=').length === text.length + 1) {
    return '';
  }
  if (text.split('-').length === text.length + 1) {
    return '';
  }
  return text;
};

const stripStrikeThrough = (text: string) => {
  return text.split('~').join('');
};

const stripTodoBox = (text: string) => {
  return text.split('[ ]').join('').split('[x]').join('');
};

const stripTables = (text: string) => {
  return text.split('|').join('').split('-').join('');
};

const stripLinks = (text: string): string => {
  if (!text.includes('](')) {
    return text;
  }
  let result = text;
  const linkMatches = [...matchAll(text, '!?\\[([^\\]]*)\\]\\(([^\\)]+)\\)')];
  linkMatches.forEach((value) => {
    result = result.split(value[0]).join(value[1]);
  });
  return result;
};

const stripMarkdownPrefixes = (text: string) => {
  const line = text.trimLeft();
  if (line.startsWith('> >')) {
    return line.slice(3);
  }
  if (line.startsWith('>>')) {
    return line.slice(2);
  }
  if (line.startsWith('>')) {
    return line.slice(1);
  }
  if (line.startsWith('######')) {
    return line.slice(6);
  }
  if (line.startsWith('#####')) {
    return line.slice(5);
  }
  if (line.startsWith('####')) {
    return line.slice(4);
  }
  if (line.startsWith('###')) {
    return line.slice(3);
  }
  if (line.startsWith('##')) {
    return line.slice(2);
  }
  if (line.startsWith('#')) {
    return line.slice(1);
  }
  if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
    return line.slice(5);
  }
  return line;
};

const getTextFromMarkdown = (text: string) => {
  const updatedLines: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    let updatedLine = stripMarkdownPrefixes(line);
    updatedLine = stripBoldAsterisks(updatedLine);
    updatedLine = stripItalicUnderscores(updatedLine);
    updatedLine = stripBackticks(updatedLine);
    updatedLine = stripHeadingLevel(updatedLine);
    updatedLine = stripTables(updatedLine);
    updatedLine = stripStrikeThrough(updatedLine);
    updatedLine = stripTodoBox(updatedLine);
    updatedLine = stripLinks(updatedLine);
    updatedLines.push(updatedLine);
  }
  return updatedLines.join('\n');
};

const markdownHelper = {
  modifyMarkdownForStorage,
  getTextFromMarkdown,
};

export default markdownHelper;

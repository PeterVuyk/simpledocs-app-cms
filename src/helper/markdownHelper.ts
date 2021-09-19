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

const markdownHelper = {
  modifyMarkdownForStorage,
};

export default markdownHelper;

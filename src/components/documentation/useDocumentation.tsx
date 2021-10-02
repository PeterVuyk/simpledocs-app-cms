import { useCallback, useEffect, useState } from 'react';
import defaultTemplate from './docs/default-template.md';
import appConfigurations from './docs/app-configurations.md';
import contentTypes from './docs/content-types.md';
import decisionTree from './docs/decision-tree.md';
import publications from './docs/publications.md';
import styleguide from './docs/styleguide.md';
import transformBase64 from './docs/transform-base64.md';
import { DocumentationType } from '../../model/DocumentationType';

function useDocumentation(documentationType: DocumentationType) {
  const [documentation, setDocumentation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [tooltip, setTooltip] = useState<string>('');

  const getMarkdownFile = useCallback(() => {
    // eslint-disable-next-line default-case
    switch (documentationType) {
      case 'appConfigurations':
        setTooltip('Info configuratie app');
        setTitle('Info configuratie app');
        return appConfigurations;
      case 'contentTypes':
        setTooltip('Info HTML en Markdown');
        setTitle('HTML en Markdown');
        return contentTypes;
      case 'decisionTree':
        setTooltip('Info beslisboom');
        setTitle('Info beslisboom');
        return decisionTree;
      case 'defaultTemplate':
        setTooltip('Info default template');
        setTitle('Info default template');
        return defaultTemplate;
      case 'publications':
        setTooltip('Info publicatie');
        setTitle('Info publicatie');
        return publications;
      case 'styleguide':
        setTooltip('Info gebruik CSS Stylesheet');
        setTitle('Info gebruik CSS Stylesheet');
        return styleguide;
      case 'transformBase64':
        setTooltip('Info base64 transformatie');
        setTitle('Info base64 transformatie');
        return transformBase64;
    }
    return null;
  }, [documentationType]);

  useEffect(() => {
    const markdownFile = getMarkdownFile();
    fetch(markdownFile)
      .then((data) => data.text())
      .then(setDocumentation);
  }, [documentationType, getMarkdownFile]);

  return { documentation, title, tooltip };
}

export default useDocumentation;

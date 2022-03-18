import { useCallback, useEffect, useState } from 'react';
import defaultTemplate from './docs/default-template.md';
import appConfigurations from './docs/app-configurations.md';
import bookManagement from './docs/book-management.md';
import imageLibrary from './docs/image-library.md';
import cmsConfigurations from './docs/cms-configurations.md';
import contentTypes from './docs/content-types.md';
import decisionTree from './docs/decision-tree.md';
import publications from './docs/publications.md';
import notificationsDelivery from './docs/notificationsDelivery.md';
import notificationsStatus from './docs/notificationsStatus.md';
import notifications from './docs/notifications.md';
import styleguide from './docs/styleguide.md';
import diffChanges from './docs/diff-changes.md';
import transformBase64 from './docs/transform-base64.md';
import cmsDisclaimer from './docs/cmsDisclaimer.md';
import idLinkBookPage from './docs/id-link-book-page.md';
import {
  DOCUMENTATION_APP_CONFIGURATIONS,
  DOCUMENTATION_CMS_CONFIGURATIONS,
  DOCUMENTATION_CONTENT_TYPES,
  DOCUMENTATION_DECISION_TREE,
  DOCUMENTATION_DEFAULT_TEMPLATE,
  DOCUMENTATION_DIFF_CHANGES,
  DOCUMENTATION_CMS_DISCLAIMER,
  DOCUMENTATION_ID_LINK_BOOK_PAGE,
  DOCUMENTATION_IMAGE_LIBRARY,
  DOCUMENTATION_PUBLICATIONS,
  DOCUMENTATION_BOOK_MANAGEMENT,
  DOCUMENTATION_STYLEGUIDE,
  DOCUMENTATION_TRANSFORM_BASE64,
  DocumentationType,
  DOCUMENTATION_NOTIFICATIONS,
  DOCUMENTATION_NOTIFICATIONS_STATUS,
  DOCUMENTATION_NOTIFICATIONS_DELIVERY,
} from '../../model/DocumentationType';

function useDocumentation(documentationType: DocumentationType) {
  const [documentation, setDocumentation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [tooltip, setTooltip] = useState<string>('');

  const getMarkdownFile = useCallback(() => {
    // eslint-disable-next-line default-case
    switch (documentationType) {
      case DOCUMENTATION_BOOK_MANAGEMENT:
        setTooltip('Info boeken beheer');
        setTitle('Info boeken beheer');
        return bookManagement;
      case DOCUMENTATION_DIFF_CHANGES:
        setTooltip('Info bekijk de wijzigingen');
        setTitle('Info bekijk de wijzigingen');
        return diffChanges;
      case DOCUMENTATION_IMAGE_LIBRARY:
        setTooltip('Info afbeeldingen bibliotheek');
        setTitle('Info afbeeldingen bibliotheek');
        return imageLibrary;
      case DOCUMENTATION_APP_CONFIGURATIONS:
        setTooltip('Info configuratie app');
        setTitle('Info configuratie app');
        return appConfigurations;
      case DOCUMENTATION_ID_LINK_BOOK_PAGE:
        setTooltip('Info ID link');
        setTitle('Info ID link');
        return idLinkBookPage;
      case DOCUMENTATION_CMS_CONFIGURATIONS:
        setTooltip('Info configuratie cms');
        setTitle('Info configuratie cms');
        return cmsConfigurations;
      case DOCUMENTATION_CONTENT_TYPES:
        setTooltip('Info pagina inhoud');
        setTitle('Pagina inhoud');
        return contentTypes;
      case DOCUMENTATION_DECISION_TREE:
        setTooltip('Info beslisboom');
        setTitle('Info beslisboom');
        return decisionTree;
      case DOCUMENTATION_DEFAULT_TEMPLATE:
        setTooltip('Info default template');
        setTitle('Info default template');
        return defaultTemplate;
      case DOCUMENTATION_PUBLICATIONS:
        setTooltip('Info publicatie');
        setTitle('Info publicatie');
        return publications;
      case DOCUMENTATION_NOTIFICATIONS:
        setTooltip('Info notificaties');
        setTitle('Info notificaties');
        return notifications;
      case DOCUMENTATION_NOTIFICATIONS_STATUS:
        setTooltip('Info status');
        setTitle('Info status');
        return notificationsStatus;
      case DOCUMENTATION_NOTIFICATIONS_DELIVERY:
        setTooltip('Info afleveringen');
        setTitle('Info afleveringen');
        return notificationsDelivery;
      case DOCUMENTATION_STYLEGUIDE:
        setTooltip('Info gebruik CSS Stylesheet');
        setTitle('Info gebruik CSS Stylesheet');
        return styleguide;
      case DOCUMENTATION_TRANSFORM_BASE64:
        setTooltip('Info base64 transformatie');
        setTitle('Info base64 transformatie');
        return transformBase64;
      case DOCUMENTATION_CMS_DISCLAIMER:
        setTooltip('Disclaimer');
        setTitle('Disclaimer');
        return cmsDisclaimer;
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

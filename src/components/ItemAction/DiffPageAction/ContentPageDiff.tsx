import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Change, createTwoFilesPatch, diffWords } from 'diff';
import * as Diff2Html from 'diff2html';
import showdown from 'showdown';
import { Paper } from '@material-ui/core';
import { Page } from '../../../model/Page';
import 'diff2html/bundles/css/diff2html.min.css';
import {
  CONTENT_TYPE_MARKDOWN,
  getExtensionFromContentType,
} from '../../../model/artifacts/Artifact';
import getTextFromHtml from '../../../firebase/functions/getTextFromHtml';
import ContentPageDiffModeToggle from './ContentPageDiffModeToggle';
import LoadingSpinner from '../../LoadingSpinner';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const useStyles = makeStyles((theme) => ({
  textAreaPaper: {
    padding: theme.spacing(2),
  },
}));

interface Props {
  conceptPage: Page;
  publishedPage: Page;
  mapContentDiffToElement: (changes: Change[]) => JSX.Element[];
}

const ContentPageDiff: FC<Props> = ({
  conceptPage,
  publishedPage,
  mapContentDiffToElement,
}) => {
  const [diffModeToggle, setDiffModeToggle] = useState<string>('text');
  const [sourceDiff, setSourceDiff] = useState<JSX.Element[]>([]);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const getContentSourceDiff = () => {
    const diff = createTwoFilesPatch(
      `${publishedPage.title}.${getExtensionFromContentType(
        publishedPage.contentType
      )}`,
      `${conceptPage.title}.${getExtensionFromContentType(
        publishedPage.contentType
      )}`,
      pretty(publishedPage.content),
      pretty(conceptPage.content)
    );
    return Diff2Html.html(diff, {
      drawFileList: false,
      outputFormat: 'side-by-side',
    });
  };

  useEffect(() => {
    const converter = new showdown.Converter();
    const conceptContent =
      conceptPage.contentType === CONTENT_TYPE_MARKDOWN
        ? converter.makeHtml(conceptPage.content)
        : conceptPage.content;
    const publishedContent =
      publishedPage.contentType === CONTENT_TYPE_MARKDOWN
        ? converter.makeHtml(publishedPage.content)
        : publishedPage.content;

    Promise.all([
      getTextFromHtml(publishedContent),
      getTextFromHtml(conceptContent),
    ])
      .then((result) => {
        setSourceDiff(mapContentDiffToElement(diffWords(result[0], result[1])));
      })
      .catch((reason) => {
        logger.errorWithReason('Failed to get text from content', reason);
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage: 'Het ophalen van tekst is mislukt',
          })
        );
      });
  }, [
    conceptPage.content,
    conceptPage.contentType,
    dispatch,
    mapContentDiffToElement,
    publishedPage.content,
    publishedPage.contentType,
  ]);

  return (
    <>
      <div style={{ position: 'relative', height: 50 }}>
        <h3 style={{ position: 'absolute', left: 0 }}>Pagina inhoud:</h3>
        <div style={{ position: 'absolute', right: 0 }}>
          <ContentPageDiffModeToggle
            diffModeToggle={diffModeToggle}
            setDiffModeToggle={setDiffModeToggle}
          />
        </div>
      </div>
      {diffModeToggle === 'source' && (
        <div dangerouslySetInnerHTML={{ __html: getContentSourceDiff() }} />
      )}
      {diffModeToggle === 'text' && sourceDiff.length === 0 && (
        <LoadingSpinner />
      )}
      {diffModeToggle === 'text' && sourceDiff.length !== 0 && (
        <Paper className={classes.textAreaPaper} elevation={3}>
          <>{sourceDiff}</>
        </Paper>
      )}
    </>
  );
};

export default ContentPageDiff;

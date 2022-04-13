import React, { FC, useEffect, useState } from 'react';
import { createTwoFilesPatch, diffWords } from 'diff';
import * as Diff2Html from 'diff2html';
import showdown from 'showdown';
import { Grid, Paper } from '@mui/material';
import 'diff2html/bundles/css/diff2html.min.css';
import getTextFromHtml from '../../../../firebase/functions/getTextFromHtml';
import ContentPageDiffModeToggle from './ContentPageDiffModeToggle';
import LoadingSpinner from '../../../LoadingSpinner';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import useDiff from '../../../hooks/useDiff';
import {
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../../../model/ContentType';
import { getExtensionFromContentType } from '../../../../model/artifacts/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

interface Props {
  disableTextView?: boolean;
  conceptPageContent: string;
  conceptContentType: ContentType;
  publishedPageContent: string;
  publishedContentType: ContentType;
}

const DiffContentPage: FC<Props> = ({
  disableTextView,
  conceptPageContent,
  conceptContentType,
  publishedPageContent,
  publishedContentType,
}) => {
  const { mapDiff } = useDiff();
  const [diffModeToggle, setDiffModeToggle] = useState<string>(
    disableTextView === true ? 'source' : 'text'
  );
  const [sourceDiff, setSourceDiff] = useState<JSX.Element[]>([]);
  const dispatch = useAppDispatch();

  const getContentSourceDiff = () => {
    const diff = createTwoFilesPatch(
      `file.${getExtensionFromContentType(publishedContentType)}`,
      `file.${getExtensionFromContentType(conceptContentType)}`,
      pretty(publishedPageContent),
      pretty(conceptPageContent)
    );
    return Diff2Html.html(diff, {
      drawFileList: false,
      outputFormat: 'side-by-side',
    });
  };

  useEffect(() => {
    const converter = new showdown.Converter();
    const conceptContent =
      conceptContentType === CONTENT_TYPE_MARKDOWN
        ? converter.makeHtml(conceptPageContent)
        : conceptPageContent;
    const publishedContent =
      publishedContentType === CONTENT_TYPE_MARKDOWN
        ? converter.makeHtml(publishedPageContent)
        : publishedPageContent;

    Promise.all([
      getTextFromHtml(publishedContent),
      getTextFromHtml(conceptContent),
    ])
      .then((result) => {
        setSourceDiff(mapDiff(diffWords(result[0], result[1])));
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
    conceptPageContent,
    conceptContentType,
    dispatch,
    publishedPageContent,
    publishedContentType,
    mapDiff,
  ]);

  return (
    <Grid container item sm={12} spacing={0}>
      <Grid item xs={12}>
        <div style={{ position: 'relative', height: 50 }}>
          <h3 style={{ position: 'absolute', left: 0 }}>Pagina inhoud:</h3>
          {disableTextView !== true && (
            <div style={{ position: 'absolute', right: 0 }}>
              <ContentPageDiffModeToggle
                diffModeToggle={diffModeToggle}
                setDiffModeToggle={setDiffModeToggle}
              />
            </div>
          )}
        </div>
        {diffModeToggle === 'source' && (
          <div dangerouslySetInnerHTML={{ __html: getContentSourceDiff() }} />
        )}
        {diffModeToggle === 'text' && sourceDiff.length === 0 && (
          <LoadingSpinner showInBlock />
        )}
        {diffModeToggle === 'text' && sourceDiff.length !== 0 && (
          <Paper sx={{ padding: (theme) => theme.spacing(2) }} elevation={3}>
            {sourceDiff}
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default DiffContentPage;

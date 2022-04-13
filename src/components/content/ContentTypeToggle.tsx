import React, { FC, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import HelpAction from '../ItemAction/helpAction/HelpAction';
import { DOCUMENTATION_CONTENT_TYPES } from '../../model/DocumentationType';
import {
  CONTENT_TYPE_CALCULATIONS,
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';

interface Props {
  contentType: ContentType | undefined;
  setContentTypeToggle: (contentType: ContentType | undefined) => void;
  allowedContentTypes: ContentType[];
}

const ContentTypeToggle: FC<Props> = ({
  contentType,
  setContentTypeToggle,
  allowedContentTypes,
}) => {
  useEffect(() => {
    if (
      contentType === undefined ||
      !allowedContentTypes.includes(contentType)
    ) {
      setContentTypeToggle(CONTENT_TYPE_HTML);
    }
  }, [allowedContentTypes, contentType, setContentTypeToggle]);

  return (
    <div style={{ position: 'relative' }}>
      <Box sx={{ marginBottom: (theme) => theme.spacing(1), display: 'flex' }}>
        {allowedContentTypes.includes(CONTENT_TYPE_HTML) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_HTML ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_HTML)}
          >
            Html
          </Button>
        )}
        {allowedContentTypes.includes(CONTENT_TYPE_MARKDOWN) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_MARKDOWN ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_MARKDOWN)}
          >
            Markdown
          </Button>
        )}
        {allowedContentTypes.includes(CONTENT_TYPE_DECISION_TREE) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_DECISION_TREE
                ? 'contained'
                : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_DECISION_TREE)}
          >
            Beslisboom
          </Button>
        )}
        {allowedContentTypes.includes(CONTENT_TYPE_CALCULATIONS) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_CALCULATIONS
                ? 'contained'
                : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_CALCULATIONS)}
          >
            Berekening
          </Button>
        )}
      </Box>
      <div style={{ zIndex: 11, position: 'absolute', top: 5, right: 10 }}>
        <HelpAction documentationType={DOCUMENTATION_CONTENT_TYPES} />
      </div>
    </div>
  );
};

export default ContentTypeToggle;

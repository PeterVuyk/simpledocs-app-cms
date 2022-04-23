import React, { FC } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import Highlight from 'react-highlight';
import utilHelper from '../../../../../../helper/utilHelper';
import { LinkInfo } from '../../../../../../model/LinkInfo';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../../../../../model/ContentType';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

interface Props {
  contentType: ContentType;
  onCloseDialog: () => void;
  linkInfo: LinkInfo;
}

const LinkCodeBlockView: FC<Props> = ({
  onCloseDialog,
  contentType,
  linkInfo,
}) => {
  const getImageHtmlCode = () => {
    if (contentType === CONTENT_TYPE_MARKDOWN) {
      return pretty(
        `[${linkInfo.linkText}](https://linkpage.web.app/navigation/${linkInfo.bookPageId})`
      );
    }
    return pretty(
      `<a href="https://linkpage.web.app/navigation/${linkInfo.bookPageId}" class="link-page"><button>${linkInfo.linkText}</button></a>`
    );
  };

  return (
    <>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          Gebruik deze snippet om naar de opgegeven pagina te refereren.
          {contentType === CONTENT_TYPE_HTML &&
            ` Met de class attribuut 'link-page' kan je vanuit de stylesheet naar de link verwijzen om de gewenste styling toe te voegen.`}
        </DialogContentText>
        <Highlight className="markdown">{getImageHtmlCode()}</Highlight>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog} color="primary" variant="contained">
          Sluiten
        </Button>
        {utilHelper.isCopyByBrowserSupported() && (
          <Button
            onClick={() => {
              utilHelper.copyText(getImageHtmlCode());
              onCloseDialog();
            }}
            color="secondary"
            variant="contained"
          >
            Kopiëren en sluiten
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default LinkCodeBlockView;

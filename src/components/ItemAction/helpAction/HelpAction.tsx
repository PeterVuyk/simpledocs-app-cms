import React, { FC, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import HelpDialog from './HelpDialog';
import useDocumentation from '../../documentation/useDocumentation';
import { DocumentationType } from '../../../model/DocumentationType';

interface Props {
  documentationType: DocumentationType;
}

const HelpAction: FC<Props> = ({ documentationType }) => {
  const [openHelpDialog, setOpenHelpDialog] = useState<boolean>(false);
  const { documentation, title, tooltip } = useDocumentation(documentationType);

  return (
    <>
      <Tooltip disableInteractive title={tooltip}>
        <InfoIcon
          sx={{
            color: (theme) => theme.palette.primary.light,
            cursor: 'pointer',
          }}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenHelpDialog(true)}
        />
      </Tooltip>
      {openHelpDialog && (
        <HelpDialog
          dialogCharCount={documentation.length}
          openDialog={openHelpDialog}
          dialogTitle={title}
          setOpenDialog={setOpenHelpDialog}
        >
          <ReactMarkdown>{documentation}</ReactMarkdown>
        </HelpDialog>
      )}
    </>
  );
};

export default HelpAction;

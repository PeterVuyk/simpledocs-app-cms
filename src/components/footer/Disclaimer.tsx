import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from '@mui/material';
import HelpDialog from '../ItemAction/helpAction/HelpDialog';
import useDocumentation from '../documentation/useDocumentation';
import { DOCUMENTATION_CMS_DISCLAIMER } from '../../model/DocumentationType';

const Disclaimer: FC = () => {
  const [openDisclaimerDialog, setOpenDisclaimerDialog] =
    useState<boolean>(false);
  const { documentation, title } = useDocumentation(
    DOCUMENTATION_CMS_DISCLAIMER
  );

  const handleDisclaimerClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setOpenDisclaimerDialog(true);
  };

  return (
    <>
      <Link href="#" onClick={handleDisclaimerClick} color="inherit">
        Disclaimer
      </Link>
      {openDisclaimerDialog && (
        <HelpDialog
          dialogCharCount={documentation.length}
          openDialog={openDisclaimerDialog}
          dialogTitle={title}
          setOpenDialog={setOpenDisclaimerDialog}
        >
          <ReactMarkdown>{documentation}</ReactMarkdown>
        </HelpDialog>
      )}
    </>
  );
};

export default Disclaimer;

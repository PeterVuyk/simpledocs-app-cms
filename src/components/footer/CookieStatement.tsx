import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from '@mui/material';
import HelpDialog from '../ItemAction/helpAction/HelpDialog';
import useDocumentation from '../documentation/useDocumentation';
import { DOCUMENTATION_CMS_COOKIE_STATEMENT } from '../../model/DocumentationType';

const CookieStatement: FC = () => {
  const [openPrivacyStatementDialog, setOpenPrivacyStatementDialog] =
    useState<boolean>(false);
  const { documentation, title } = useDocumentation(
    DOCUMENTATION_CMS_COOKIE_STATEMENT
  );

  const handleCookieStatementClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setOpenPrivacyStatementDialog(true);
  };

  return (
    <>
      <Link href="#" onClick={handleCookieStatementClick} color="inherit">
        cookieverklaring
      </Link>
      {openPrivacyStatementDialog && (
        <HelpDialog
          dialogCharCount={documentation.length}
          openDialog={openPrivacyStatementDialog}
          dialogTitle={title}
          setOpenDialog={setOpenPrivacyStatementDialog}
        >
          <ReactMarkdown>{documentation}</ReactMarkdown>
        </HelpDialog>
      )}
    </>
  );
};

export default CookieStatement;

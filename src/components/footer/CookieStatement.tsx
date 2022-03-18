import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import HelpDialog from '../ItemAction/helpAction/HelpDialog';
import useDocumentation from '../documentation/useDocumentation';
import { DOCUMENTATION_CMS_COOKIE_STATEMENT } from '../../model/DocumentationType';

const useStyles = makeStyles((theme: Theme) => ({
  lightColor: {
    color: theme.palette.primary.light,
  },
  markdown: {
    fontSize: '1rem',
  },
}));

const CookieStatement: FC = () => {
  const [openPrivacyStatementDialog, setOpenPrivacyStatementDialog] =
    useState<boolean>(false);
  const { documentation, title } = useDocumentation(
    DOCUMENTATION_CMS_COOKIE_STATEMENT
  );
  const classes = useStyles();

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
          <ReactMarkdown className={classes.markdown}>
            {documentation}
          </ReactMarkdown>
        </HelpDialog>
      )}
    </>
  );
};

export default CookieStatement;

import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import HelpDialog from '../ItemAction/helpAction/HelpDialog';
import useDocumentation from '../documentation/useDocumentation';
import { DOCUMENTATION_CMS_DISCLAIMER } from '../../model/DocumentationType';

const useStyles = makeStyles((theme: Theme) => ({
  lightColor: {
    color: theme.palette.primary.light,
  },
  markdown: {
    fontSize: '1rem',
  },
}));

const Disclaimer: FC = () => {
  const [openDisclaimerDialog, setOpenDisclaimerDialog] =
    useState<boolean>(false);
  const { documentation, title } = useDocumentation(
    DOCUMENTATION_CMS_DISCLAIMER
  );
  const classes = useStyles();

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
          <ReactMarkdown className={classes.markdown}>
            {documentation}
          </ReactMarkdown>
        </HelpDialog>
      )}
    </>
  );
};

export default Disclaimer;
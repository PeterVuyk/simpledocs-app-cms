import React, { FC, useState } from 'react';
import Typography from '@material-ui/core/Typography';
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
  const [openHelpDialog, setOpenHelpDialog] = useState<boolean>(false);
  const { documentation, title } = useDocumentation(
    DOCUMENTATION_CMS_DISCLAIMER
  );
  const classes = useStyles();

  const handleDisclaimerClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setOpenHelpDialog(true);
  };

  return (
    <>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href="#" onClick={handleDisclaimerClick} color="inherit">
          Disclaimer gebruik CMS
        </Link>
      </Typography>
      {openHelpDialog && (
        <HelpDialog
          dialogCharCount={documentation.length}
          openDialog={openHelpDialog}
          dialogTitle={title}
          setOpenDialog={setOpenHelpDialog}
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

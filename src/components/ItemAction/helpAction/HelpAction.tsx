import React, { FC, useState } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import HelpDialog from './HelpDialog';
import useDocumentation from '../../documentation/useDocumentation';
import { DocumentationType } from '../../../model/DocumentationType';

const useStyles = makeStyles((theme: Theme) => ({
  lightColor: {
    color: theme.palette.primary.light,
  },
  markdown: {
    fontSize: '1rem',
  },
}));

interface Props {
  documentationType: DocumentationType;
}

const HelpAction: FC<Props> = ({ documentationType }) => {
  const [openHelpDialog, setOpenHelpDialog] = useState<boolean>(false);
  const { documentation, title, tooltip } = useDocumentation(documentationType);
  const classes = useStyles();

  return (
    <>
      <Tooltip title={tooltip}>
        <InfoIcon
          className={classes.lightColor}
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
          <ReactMarkdown className={classes.markdown}>
            {documentation}
          </ReactMarkdown>
        </HelpDialog>
      )}
    </>
  );
};

export default HelpAction;

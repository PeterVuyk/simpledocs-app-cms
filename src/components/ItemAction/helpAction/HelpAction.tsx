import React, { FC, ReactNode, useState } from 'react';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Tooltip } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import HelpDialog from './HelpDialog';

const useStyles = makeStyles((theme: Theme) => ({
  lightColor: {
    color: theme.palette.primary.light,
  },
}));

interface Props {
  title: string;
  children: ReactNode;
}

const HelpAction: FC<Props> = ({ title, children }) => {
  const [openHelpDialog, setOpenHelpDialog] = useState<boolean>(false);
  const classes = useStyles();
  return (
    <>
      <Tooltip title="Toelichting gebruik">
        <HelpOutlineIcon
          className={classes.lightColor}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenHelpDialog(true)}
        />
      </Tooltip>
      {openHelpDialog && (
        <HelpDialog
          openDialog={openHelpDialog}
          dialogTitle={title}
          setOpenDialog={setOpenHelpDialog}
        >
          {children}
        </HelpDialog>
      )}
    </>
  );
};

export default HelpAction;

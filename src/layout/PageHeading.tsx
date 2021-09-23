import React, { CSSProperties, FC, ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { DocumentationType } from '../model/DocumentationType';
import HelpAction from '../components/ItemAction/helpAction/HelpAction';

const useStyles = makeStyles({
  titleContainer: {
    float: 'left',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

interface Props {
  title: string;
  help?: DocumentationType;
  children?: ReactNode;
  style?: CSSProperties;
}

const PageHeading: FC<Props> = ({ title, help, children, style }) => {
  const classes = useStyles();
  return (
    <div style={style}>
      <div style={{ overflow: 'hidden', marginTop: 70, marginBottom: 10 }}>
        <div className={classes.titleContainer}>
          <Typography variant="h5">{title}</Typography>&ensp;
          {help && <HelpAction documentationType={help} />}
        </div>
        {children && <div style={{ float: 'right' }}>{children}</div>}
      </div>
    </div>
  );
};

export default PageHeading;

import React, { CSSProperties, FC, ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import { DocumentationType } from '../model/DocumentationType';
import HelpAction from '../components/ItemAction/helpAction/HelpAction';

interface Props {
  title: string;
  help?: DocumentationType;
  children?: ReactNode;
  style?: CSSProperties;
}

const PageHeading: FC<Props> = ({ title, help, children, style }) => {
  return (
    <div style={style}>
      <div style={{ overflow: 'hidden', marginTop: 70, marginBottom: 10 }}>
        <div
          style={{
            float: 'left',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h5">{title}</Typography>&ensp;
          {help && <HelpAction documentationType={help} />}
        </div>
        {children && <div style={{ float: 'right' }}>{children}</div>}
      </div>
    </div>
  );
};

export default PageHeading;

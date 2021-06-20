import React, { CSSProperties, FC, ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';

interface Props {
  title: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const PageHeading: FC<Props> = ({ title, children, style }) => {
  return (
    <div style={style}>
      <div style={{ overflow: 'hidden', marginTop: 70, marginBottom: 10 }}>
        <div style={{ float: 'left' }}>
          <Typography variant="h5">{title}</Typography>
        </div>
        {children && <div style={{ float: 'right' }}>{children}</div>}
      </div>
    </div>
  );
};

export default PageHeading;

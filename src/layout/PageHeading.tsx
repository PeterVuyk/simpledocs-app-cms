import React from 'react';
import Typography from '@material-ui/core/Typography';

interface Props {
  title: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const PageHeading: React.FC<Props> = ({ title, children, style }) => {
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

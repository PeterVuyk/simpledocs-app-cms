import React from 'react';
import Typography from '@material-ui/core/Typography';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const PageHeading: React.FC<Props> = ({ title, children }) => {
  return (
    <div style={{ overflow: 'hidden', marginTop: 10, marginBottom: 10 }}>
      <div style={{ float: 'left' }}>
        <Typography variant="h5">{title}</Typography>
      </div>
      {children && <div style={{ float: 'right' }}>{children}</div>}
    </div>
  );
};

export default PageHeading;

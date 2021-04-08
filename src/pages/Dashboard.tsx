import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import RegulationsTable from '../list/RegulationsTable';
import Layout from '../layout/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <CssBaseline />
      <RegulationsTable />
    </Layout>
  );
};

export default Dashboard;

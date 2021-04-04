import React from 'react';
import RegulationsTable from '../list/RegulationsTable';
import Layout from '../layout/Layout';

function Dashboard(): JSX.Element {
  return (
    <Layout>
      <RegulationsTable />
    </Layout>
  );
}

export default Dashboard;

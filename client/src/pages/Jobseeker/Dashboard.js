import React from 'react';

import './css/dashboard.css'; // For the dashboard-specific styling
import Navigation from './Navigation';
import Layout from './layout';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Include the Navigation component */}
      <Navigation/>
      <Layout/>
      </div>
  );
};

export default Dashboard;

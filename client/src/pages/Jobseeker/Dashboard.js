import React from 'react';

import './css/dashboard.css'; // For the dashboard-specific styling
import Navigation from './Navigation';
import Layout from './layout';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex flex-1 mt-16 bg-[#f9f9f9]">
        <Layout />
      </div>
    </div>
  );
};

export default Dashboard;

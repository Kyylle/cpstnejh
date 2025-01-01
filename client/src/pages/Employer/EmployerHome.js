import React from "react";
import Navigation from "./Navigation";
import Layout from "./Layout";

const EmployerHome = () => {
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

export default EmployerHome;

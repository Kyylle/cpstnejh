// src/components/Layout.js
import React from "react";
import Profile from "./Profile";
import Feeds from "./Feeds";
import FollowedAccounts from "./FollowedAccounts";

const Layout = () => {
  return (
    <div className="scrollbar-hide flex flex-col md:flex-row w-full max-w-[1440px] mx-auto p-4 gap-4">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 rounded-lg p-4">
        <Profile />
      </div>

      {/* Main Content - Scrollable Feeds */}
      <div className="w-full md:w-2/4 rounded-lg p-4">
        <div className="h-[calc(100vh-100px)] overflow-y-auto">
          {/* Ensure Feeds occupy scrollable space */}
          <Feeds />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-1/4 rounded-lg p-4">
        <FollowedAccounts />
      </div>
    </div>
  );
};

export default Layout;

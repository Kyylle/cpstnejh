import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const NavigationLayout = ({ children }) => {
  const location = useLocation();

  // Define routes where you want to hide the Navigation
  const hideNavigation = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div>
      {!hideNavigation && <Navigation />} {/* Only show Navigation if not on SignIn/SignUp */}
      <main>{children}</main> {/* Render the children (page content) */}
    </div>
  );
};

export default NavigationLayout;

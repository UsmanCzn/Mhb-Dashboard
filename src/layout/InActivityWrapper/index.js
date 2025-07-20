// components/InactivityWrapper.js
import React from 'react';
import useInactivityLogout from 'features/Store/SessionInActivity/index';

const InActivityWrapper = ({ children }) => {
  useInactivityLogout(); // Now safe to use here
  return <>{children}</>;
};

export default InActivityWrapper;

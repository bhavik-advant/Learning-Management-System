'use client';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import NavBar from '../NavBar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleToggle = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
      <div className="flex relative">
        <Sidebar show={showSidebar} onClick={handleToggle} />
        <div className="flex-1">
          <NavBar onClick={handleToggle} />
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;

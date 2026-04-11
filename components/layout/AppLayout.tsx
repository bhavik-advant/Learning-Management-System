'use client';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import NavBar from '../NavBar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleToggle = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar show={showSidebar} onClick={handleToggle} />
        <div className="flex-1 flex flex-col min-w-0">
          <NavBar onClick={handleToggle} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;

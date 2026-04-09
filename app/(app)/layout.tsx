import DashboardLayout from '@/components/layout/DashboardLayout';
import React from 'react';

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;

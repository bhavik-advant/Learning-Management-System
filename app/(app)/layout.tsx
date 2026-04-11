import AppLayout from '@/components/layout/AppLayout';
import React from 'react';

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppLayout>{children}</AppLayout>;
};

export default layout;

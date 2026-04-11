'use client';
import queryClient from '@/utils/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const TanstackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanstackProvider;

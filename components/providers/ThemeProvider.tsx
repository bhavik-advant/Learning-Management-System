'use client'
import store from '@/store/store';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ThemeProvider;

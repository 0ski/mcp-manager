'use client';

import React, { ReactNode } from 'react';
import { GraphQLProvider } from './GraphQLContext';
import { McpsProvider } from './McpsContext';
import { client } from '../client';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <GraphQLProvider client={client}>
      <McpsProvider>
        {children}
      </McpsProvider>
    </GraphQLProvider>
  );
};

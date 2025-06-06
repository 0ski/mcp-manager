'use client';

import React, { ReactNode } from 'react';
import { GraphQLProvider } from './GraphQLContext';
import { McpsProvider } from './McpsContext';
import { client } from '../client';
import { getClient } from '../client/socket';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const wsClient = getClient();
  return (
    <GraphQLProvider client={client} wsClient={wsClient}>
      <McpsProvider>
        {children}
      </McpsProvider>
    </GraphQLProvider>
  );
};

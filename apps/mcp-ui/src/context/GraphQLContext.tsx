'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { type Sdk } from '@/client/graphql';
import { getClient } from '@/client/socket';

interface GraphQLContextType {
  client: Sdk;
  wsClient: ReturnType<typeof getClient>
}

const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined);

interface GraphQLProviderProps {
  client: Sdk;
  wsClient: ReturnType<typeof getClient>
  children: ReactNode;
}

export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({ client, wsClient, children }) => {
  return (
    <GraphQLContext.Provider value={{ client, wsClient }}>
      {children}
    </GraphQLContext.Provider>
  );
};

export const useGraphQL = (): GraphQLContextType => {
  const context = useContext(GraphQLContext);
  if (context === undefined) {
    throw new Error('useGraphQL must be used within a GraphQLProvider');
  }
  return context;
};

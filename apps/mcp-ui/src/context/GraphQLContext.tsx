'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { type Sdk } from '@/client/graphql';

interface GraphQLContextType {
  client: Sdk;
}

const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined);

interface GraphQLProviderProps {
  client: Sdk;
  children: ReactNode;
}

export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({ client, children }) => {
  return (
    <GraphQLContext.Provider value={{ client }}>
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

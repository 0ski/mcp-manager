'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { McpsStore } from '@/stores/mcps';
import { CreateServiceInput } from '@/client/graphql';
import { useGraphQL } from './GraphQLContext';

interface McpsContextType {
  mcpsStore: McpsStore;
  loadMcps: () => Promise<void>;
  createMcp: (input: CreateServiceInput) => Promise<any>;
  startMcp: (serviceId: string) => Promise<boolean>;
  stopMcp: (serviceId: string) => Promise<boolean>;
  startSubscription: () => void;
  stopSubscription: () => void;
}

const McpsContext = createContext<McpsContextType | undefined>(undefined);

interface McpsProviderProps {
  children: ReactNode;
}

export const McpsProvider: React.FC<McpsProviderProps> = ({ children }) => {
  const { client } = useGraphQL();
  
  // Create a store instance
  const mcpsStore = React.useMemo(() => new McpsStore(), []);

  // Create enhanced methods that use the client
  const loadMcps = React.useCallback(() => 
    mcpsStore.loadMcpsWithSubscription(() => client.mcps()), [mcpsStore, client]);
    
  const createMcp = React.useCallback((input: CreateServiceInput) => 
    mcpsStore.createMcp(input, (input) => client.createMcp({ input })), [mcpsStore, client]);
    
  const startMcp = React.useCallback((serviceId: string) => 
    mcpsStore.startMcp(serviceId, (serviceId) => client.startMcp({ serviceId })), [mcpsStore, client]);
    
  const stopMcp = React.useCallback((serviceId: string) => 
    mcpsStore.stopMcp(serviceId, (serviceId) => client.stopMcp({ serviceId })), [mcpsStore, client]);

  const startSubscription = React.useCallback(() => 
    mcpsStore.startSubscription(), [mcpsStore]);
    
  const stopSubscription = React.useCallback(() => 
    mcpsStore.stopSubscription(), [mcpsStore]);

  // Auto-cleanup subscription on unmount
  useEffect(() => {
    return () => {
      mcpsStore.stopSubscription();
    };
  }, [mcpsStore]);

  return (
    <McpsContext.Provider value={{ 
      mcpsStore, 
      loadMcps, 
      createMcp, 
      startMcp, 
      stopMcp, 
      startSubscription, 
      stopSubscription 
    }}>
      {children}
    </McpsContext.Provider>
  );
};

export const useMcps = (): McpsContextType => {
  const context = useContext(McpsContext);
  if (context === undefined) {
    throw new Error('useMcps must be used within a McpsProvider');
  }
  return context;
};

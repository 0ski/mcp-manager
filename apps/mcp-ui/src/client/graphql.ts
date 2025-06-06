import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type CreateServiceInput = {
  /** Environment variables as a map of key-value pairs where each value is an object with a "value" property */
  environmentVariables: Scalars['JSON']['input'];
  githubUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
  portNumber: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createService: Service;
  deleteService: Scalars['Boolean']['output'];
  startService: Scalars['Boolean']['output'];
  stopService: Scalars['Boolean']['output'];
};


export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};


export type MutationDeleteServiceArgs = {
  input: ServiceActionInput;
};


export type MutationStartServiceArgs = {
  input: ServiceActionInput;
};


export type MutationStopServiceArgs = {
  input: ServiceActionInput;
};

export type Query = {
  __typename?: 'Query';
  services: Array<Service>;
};

export type Service = {
  __typename?: 'Service';
  domain: Scalars['String']['output'];
  /** Environment variables as a map of key-value pairs where each value is an object with a "value" property */
  environmentVariables: Scalars['JSON']['output'];
  githubUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  portNumber: Scalars['Float']['output'];
  serviceId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
};

export type ServiceActionInput = {
  serviceId: Scalars['ID']['input'];
};

export type ServiceStatus = {
  __typename?: 'ServiceStatus';
  serviceId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  serviceStatusUpdates: ServiceStatus;
};

export type CreateMcpMutationVariables = Exact<{
  input: CreateServiceInput;
}>;


export type CreateMcpMutation = { __typename?: 'Mutation', createService: { __typename?: 'Service', status: string, serviceId: string, name: string, environmentVariables: any, portNumber: number, domain: string } };

export type StartMcpMutationVariables = Exact<{
  serviceId: Scalars['ID']['input'];
}>;


export type StartMcpMutation = { __typename?: 'Mutation', startService: boolean };

export type StopMcpMutationVariables = Exact<{
  serviceId: Scalars['ID']['input'];
}>;


export type StopMcpMutation = { __typename?: 'Mutation', stopService: boolean };

export type McpsQueryVariables = Exact<{ [key: string]: never; }>;


export type McpsQuery = { __typename?: 'Query', services: Array<{ __typename?: 'Service', serviceId: string, name: string, status: string, githubUrl: string, environmentVariables: any, portNumber: number, domain: string }> };

export type StatusUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StatusUpdatesSubscription = { __typename?: 'Subscription', serviceStatusUpdates: { __typename?: 'ServiceStatus', serviceId: string, status: string } };


export const CreateMcpDocument = gql`
    mutation createMcp($input: CreateServiceInput!) {
  createService(input: $input) {
    status
    serviceId
    name
    environmentVariables
    portNumber
    domain
  }
}
    `;
export const StartMcpDocument = gql`
    mutation startMcp($serviceId: ID!) {
  startService(input: {serviceId: $serviceId})
}
    `;
export const StopMcpDocument = gql`
    mutation stopMcp($serviceId: ID!) {
  stopService(input: {serviceId: $serviceId})
}
    `;
export const McpsDocument = gql`
    query mcps {
  services {
    serviceId
    name
    status
    githubUrl
    environmentVariables
    portNumber
    domain
  }
}
    `;
export const StatusUpdatesDocument = gql`
    subscription statusUpdates {
  serviceStatusUpdates {
    serviceId
    status
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createMcp(variables: CreateMcpMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateMcpMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMcpMutation>({ document: CreateMcpDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createMcp', 'mutation', variables);
    },
    startMcp(variables: StartMcpMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StartMcpMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<StartMcpMutation>({ document: StartMcpDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'startMcp', 'mutation', variables);
    },
    stopMcp(variables: StopMcpMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StopMcpMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<StopMcpMutation>({ document: StopMcpDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stopMcp', 'mutation', variables);
    },
    mcps(variables?: McpsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<McpsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<McpsQuery>({ document: McpsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'mcps', 'query', variables);
    },
    statusUpdates(variables?: StatusUpdatesSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StatusUpdatesSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<StatusUpdatesSubscription>({ document: StatusUpdatesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'statusUpdates', 'subscription', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
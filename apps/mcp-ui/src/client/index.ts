import { Sdk, getSdk } from './graphql';
import { GraphQLClient } from 'graphql-request';
import { config } from '../config';

export const client: Sdk = getSdk(new GraphQLClient(config.NEXT_PUBLIC_GRAPHQL_API_URL));
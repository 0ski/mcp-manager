import { Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

// TypeScript interface for the environment variable structure
export interface EnvironmentVariableValue {
  value: string;
}

export type EnvironmentVariablesMap = Record<string, EnvironmentVariableValue>;

@ObjectType()
export class Service {
  @Field(() => ID)
  serviceId: string;

  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  githubUrl: string;

  @Field(() => GraphQLJSON, { description: 'Environment variables as a map of key-value pairs where each value is an object with a "value" property' })
  environmentVariables: EnvironmentVariablesMap;

  @Field()
  portNumber: number;

  @Field()
  domain: string;
}

@ObjectType()
export class ServiceStatus {
  @Field(() => ID)
  serviceId: string;

  @Field()
  status: string;
}

@InputType()
export class CreateServiceInput {
  @Field()
  name: string;

  @Field()
  githubUrl: string;

  @Field(() => GraphQLJSON, { description: 'Environment variables as a map of key-value pairs where each value is an object with a "value" property' })
  environmentVariables: EnvironmentVariablesMap;

  @Field()
  portNumber: number;
}

@InputType()
export class ServiceActionInput {
  @Field(() => ID)
  serviceId: string;
}

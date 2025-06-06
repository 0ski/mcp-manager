import { Module } from '@nestjs/common';
import { ServiceResolver } from './resolvers/service.resolver';
import { ServiceManagementService } from './services/service-management.service';
import { TypedConfigService } from '../typed-config.service';
import { RailwayClientService } from '../railway-client/services/railway-client.service';

@Module({
  providers: [
    TypedConfigService, 
    RailwayClientService, 
    ServiceResolver, 
    ServiceManagementService,
    {
      provide: 'pubsub',
      useFactory: () => {
        return require('mqemitter-redis')({
          ...(process.env.REDIS_USER ? {username: process.env.REDIS_USER} : {}),
          ...(process.env.REDIS_PASSWORD ? {password: process.env.REDIS_PASSWORD} : {}),
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
          host: process.env.REDIS_HOST || 'localhost',
        });
      },
    },
  ],
  exports: [ServiceManagementService],
})
export class ApiModule {}

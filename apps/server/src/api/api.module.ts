import { Module } from '@nestjs/common';
import { ServiceResolver } from './resolvers/service.resolver';
import { ServiceManagementService } from './services/service-management.service';
import { TypedConfigService } from 'src/typed-config.service';
import { RailwayClientService } from '../railway-client/services/railway-client.service';

@Module({
  providers: [TypedConfigService, RailwayClientService, ServiceResolver, ServiceManagementService],
  exports: [ServiceManagementService],
})
export class ApiModule {}

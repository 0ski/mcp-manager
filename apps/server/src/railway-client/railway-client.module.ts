import { Module } from '@nestjs/common';
import { TypedConfigService } from 'src/typed-config.service';
import { RailwayClientService } from './services/railway-client.service';

@Module({
  providers: [TypedConfigService, RailwayClientService],
  exports: [RailwayClientService],
})
export class ApiModule {}

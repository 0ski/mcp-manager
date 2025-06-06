import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriverConfig, MercuriusDriver } from '@nestjs/mercurius';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { TypedConfigService } from './typed-config.service';
import { RailwayClientService } from './railway-client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      subscription: {
        emitter: require('mqemitter-redis')({
          ...(process.env.REDIS_USER ? {user: process.env.REDIS_USER} : {}),
          ...(process.env.REDIS_PASSWORD ? {user: process.env.REDIS_PASSWORD} : {}),
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
          host: process.env.REDIS_HOST || 'localhost',
        }),
      },
      graphiql: true,
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [TypedConfigService, RailwayClientService],
})
export class AppModule {}

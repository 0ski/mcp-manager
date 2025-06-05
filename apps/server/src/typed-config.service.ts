import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type Config = {
  RAILWAY_API_KEY: string;
  ENVIRONMENT_ID: string;
  PROJECT_ID: string;
  PORT: number;
}

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService<Config>) {}

  get<T extends keyof Config>(key: T) {
    return this.configService.get(key) as Config[T];
  }
}
import { Injectable } from '@nestjs/common';
import { type Sdk, ServiceCreateInput, getSdk } from '../generated/graphql';
import { GraphQLClient } from 'graphql-request';
import { TypedConfigService } from '../../typed-config.service';

@Injectable()
export class RailwayClientService {
  public client: Sdk;
  private projectId: string;
  private environmentId: string;

  constructor(private configService: TypedConfigService) {
    this.client = getSdk(new GraphQLClient('https://backboard.railway.app/graphql/v2', {
      headers: {
        Authorization: `Bearer ${this.configService.get('RAILWAY_API_KEY')}`,
      },
    }));
    this.projectId = this.configService.get('PROJECT_ID');
    this.environmentId = this.configService.get('ENVIRONMENT_ID');
  }

  public services() {
    return this.client.services({
      projectId: this.projectId,
      first: 100, // Adjust as needed for pagination
    });
  }

  public createService( params: Pick<ServiceCreateInput, 'name' | 'variables' | 'source'>) {
    return this.client.createService({
      input: {
        name: params.name,
        source: params.source,
        variables: params.variables,
        projectId: this.projectId,
      },
    });
  }

  public createDomain(params: { serviceId: string; portNumber: number; }) {
    return this.client.createDomain({
      input: {
        environmentId: this.environmentId,
        serviceId: params.serviceId,
        targetPort: params.portNumber,
      },
    });
  }

  public async deleteService(serviceId: string) {
    await this.client.deleteService({
        serviceId,
    });
    return { serviceId };
  }

  public startService(serviceId: string) {
    return this.client.startService({
      serviceId,
      environmentId: this.environmentId,
    });
  }

  public async stopService(serviceId: string) {
    const deployments = await this.client.serviceDeployments({
      serviceId,
    });

    if (deployments.service.deployments.edges.length === 0) {
      return true; // No deployments to stop
    }

    console.log("DEPLOYMENTS", deployments.service.deployments.edges);
    const latestDeployment = deployments.service.deployments.edges[0].node;

    return this.client.stopService({
      deploymentId: latestDeployment.id,
    });
  }
}

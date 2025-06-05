import { Controller, Get, Header } from '@nestjs/common';
import { RailwayClientService } from './railway-client';

@Controller()
export class AppController {
  constructor(private readonly railwayClientService: RailwayClientService) {}

  @Get('mcps.json')
  @Header('Content-Type', 'application/json')
  async getMcpsJson(): Promise<string> {
    const services = await this.railwayClientService.services();

    const mcpConfig = services.project.services.edges.reduce((acc, edge) => {
      const railwayService = edge.node;
      const domain = railwayService.serviceInstances.edges[0]?.node?.domains.serviceDomains[0]?.domain || '';
      const latestDeployment = railwayService.deployments.edges[0]?.node;

      if (domain && latestDeployment?.status === 'SUCCESS') {
        acc.mcpServers.push({
          type: 'sse',
          url: `${domain}/sse`,
        });
      }

      return acc;
    }, {
      mcpServers: [] as { type: string; url: string }[],
    });

    return JSON.stringify(mcpConfig);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Service, ServiceStatus, CreateServiceInput } from '../types/service.types';
import { RailwayClientService } from '../../railway-client/services/railway-client.service';
import { MQEmitterRedis } from 'mqemitter-redis';
import asyncify from 'callback-to-async-iterator';

@Injectable()
export class ServiceManagementService {
  constructor(
    private clientService: RailwayClientService,
    @Inject('pubsub') private pubSub: MQEmitterRedis
  ) {}

  /**
   * Get all services with their current status
   */
  async getServices(): Promise<Service[]> {
    try {
      const response = await this.clientService.services();

      return response.project.services.edges.map((edge) => {
        const railwayService = edge.node;
        const latestDeployment = railwayService.deployments.edges[0]?.node;
        const domain = railwayService.serviceInstances.edges[0]?.node?.domains.serviceDomains[0];
        
        return {
          serviceId: railwayService.id,
          name: railwayService.name,
          status: latestDeployment?.status || 'STOPPED',
          githubUrl: railwayService.serviceInstances.edges[0]?.node?.source?.repo || '',
          environmentVariables: {}, // This would need additional API call to get env vars
          portNumber: domain?.targetPort || 0,
          domain: domain.domain || '',
        };
      });
    } catch (error) {
      console.error('Error fetching services from Railway:', error);
      throw new Error('Failed to fetch services from Railway');
    }
  }

  /**
   * Create a new service
   */
  async createService(input: CreateServiceInput): Promise<Service> {
    // Convert environment variables from { key: { value: "val" } } to { key: "val" }
    const variables: Record<string, string> = {};
    
    // Add existing environment variables
    if (input.environmentVariables) {
      for (const [key, valueObj] of Object.entries(input.environmentVariables)) {
        variables[key] = valueObj.value;
      }
    }
    
    // Ensure PORT is set
    variables['PORT'] = input.portNumber.toString();
    
    const response = await this.clientService.createService({
      name: input.name,
      variables,
      source: {
        repo: input.githubUrl
      },
    });
    const service = response.serviceCreate;

    if (!service) {
      throw new Error('Failed to create service');
    }

    const domainResponse = await this.clientService.createDomain({
      serviceId: service.id,
      portNumber: input.portNumber
    });

    return {
      serviceId: service.id,
      name: service.name,
      status: "CREATED",
      githubUrl: input.githubUrl,
      environmentVariables: Object.fromEntries(
        Object.entries(variables).map(([key, value]) => [key, { value }])
      ),
      portNumber: input.portNumber, // Port number can be set later
      domain: domainResponse.serviceDomainCreate.domain,
    }
  }

  async deleteService(serviceId: string): Promise<Pick<Service, 'serviceId'>> {
    return this.clientService.deleteService(serviceId);
  }

  /**
   * Start a service by ID
   */
  async startService(serviceId: string): Promise<boolean> {
    await this.clientService.startService(serviceId);
    return true;
  }

  /**
   * Stop a service by ID
   */
  async stopService(serviceId: string): Promise<boolean> {
    await this.clientService.stopService(serviceId);
    return true;
  }

  /**
   * Get service status updates for subscriptions
   */
  getServiceStatusUpdates() {
    const pubSub = this.pubSub;

    // callback will be called with each new message coming from the message queue
    const listenToNewMessages = (callback) => {
      const eventHandler = (message: {
        topic: 'service.update';
        serviceId: string;
        status: string;
      }, done: () => void) => {
        const serviceStatus: ServiceStatus = {
          serviceId: message.serviceId,
          status: message.status,
        };
        callback(serviceStatus);
        done();
      };
      
      pubSub.on('service.update', eventHandler);
      
      // Return a Promise that resolves to the cleanup function
      return Promise.resolve(() => {
        pubSub.removeListener('service.update', eventHandler);
      });
    }

    return asyncify(listenToNewMessages);
  }
}

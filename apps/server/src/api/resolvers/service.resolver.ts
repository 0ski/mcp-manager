import { Resolver, Query, Mutation, Subscription, Args } from '@nestjs/graphql';
import { Service, ServiceStatus, CreateServiceInput, ServiceActionInput } from '../types/service.types';
import { ServiceManagementService } from '../services/service-management.service';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(private readonly serviceManagementService: ServiceManagementService) {}

  /**
   * Query: Get all services with their statuses
   * Returns array of services with ServiceId, Name, Status, Github URL, Environment variables, Port number
   */
  @Query(() => [Service], { name: 'services' })
  async getServices(): Promise<Service[]> {
    return this.serviceManagementService.getServices();
  }

  /**
   * Mutation: Create a new service
   * Takes: Name, Github URL, Environment variables array, Port number
   */
  @Mutation(() => Service, { name: 'createService' })
  async createService(@Args('input') input: CreateServiceInput): Promise<Service> {
    return this.serviceManagementService.createService(input);
  }

  /**
   * Mutation: Create a new service
   * Takes: ServiceId
   */
  @Mutation(() => Boolean, { name: 'deleteService' })
  async deleteService(@Args('input') input: ServiceActionInput): Promise<Pick<Service, 'serviceId'>> {
    return this.serviceManagementService.deleteService(input.serviceId);
  }

  /**
   * Mutation: Start a service
   * Takes: ServiceId
   */
  @Mutation(() => Boolean, { name: 'startService' })
  async startService(@Args('input') input: ServiceActionInput): Promise<boolean> {
    return this.serviceManagementService.startService(input.serviceId);
  }

  /**
   * Mutation: Stop a service
   * Takes: ServiceId
   */
  @Mutation(() => Boolean, { name: 'stopService' })
  async stopService(@Args('input') input: ServiceActionInput): Promise<boolean> {
    return this.serviceManagementService.stopService(input.serviceId);
  }

  /**
   * Subscription: Service status updates
   * Returns ServiceId and Status
   */
  @Subscription(() => ServiceStatus, { name: 'serviceStatusUpdates' })
  async serviceStatusUpdates(): Promise<AsyncIterator<ServiceStatus>> {
    return this.serviceManagementService.getServiceStatusUpdates();
  }
}

import { makeAutoObservable, runInAction } from 'mobx';
import { Service, CreateServiceInput, CreateMcpMutation, McpsQuery, StatusUpdatesDocument, StatusUpdatesSubscription } from '../client/graphql';
import { getClient } from '../client/socket';

export interface McpService extends Omit<Service, "__typename"> {
  // Additional properties can be added here if needed
}

export class McpsStore {
  fetchedOnce = false;
  mcps: McpService[] = [];
  loading = false;
  error: string | null = null;
  loadingMap = new Map<string, boolean>();
  errorsMap = new Map<string, string | null>();
  creatingMcp = false;
  creatingMcpError: string | null = null;
  
  // Subscription state
  subscriptionActive = false;
  subscriptionError: string | null = null;
  private subscriptionUnsubscribe: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setFetchedOnce(fetched: boolean) {
    this.fetchedOnce = fetched;
  }

  // Actions
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setCreatingMcp(creating: boolean) {
    this.creatingMcp = creating;
  }

  setCreatingMcpError(error: string | null) {
    this.creatingMcpError = error;
  }

  setLoadingForService(serviceId: string, loading: boolean) {
    this.loadingMap.set(serviceId, loading);
  }

  getLoadingForService(serviceId: string): boolean {
    return this.loadingMap.get(serviceId) || false;
  }

  setErrorForService(serviceId: string, error: string | null) {
    this.errorsMap.set(serviceId, error);
  }
  
  setMcps(mcps: McpService[]) {
    this.mcps = mcps;
  }

  addMcp(mcp: McpService) {
    this.mcps.push(mcp);
  }

  removeMcp(serviceId: string) {
    this.mcps = this.mcps.filter(mcp => mcp.serviceId !== serviceId);
  }

  updateMcpStatus(serviceId: string, status: string) {
    const mcp = this.mcps.find(mcp => mcp.serviceId === serviceId);
    if (mcp) {
      mcp.status = status;
    }
  }

  // Async actions for API calls
  async loadMcps(mcpsQuery: () => Promise<McpsQuery>) {
    this.setLoading(true);
    this.setError(null);

    try {
      const result = await mcpsQuery();
      runInAction(() => {
        this.setMcps(result.services as McpService[]);
      });
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to load MCPs');
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
        this.setFetchedOnce(true);
      });
    }
  }

  async createMcp(
    input: CreateServiceInput,
    createMcpMutation: (input: CreateServiceInput) => Promise<CreateMcpMutation>
  ) {
    this.setCreatingMcp(true);
    this.setCreatingMcpError(null);

    try {
      const result = await createMcpMutation(input);
      runInAction(() => {
        this.addMcp(result.createService as McpService);
      });
      return result.createService;
    } catch (error) {
      runInAction(() => {
        this.setCreatingMcpError(error instanceof Error ? error.message : 'Failed to create MCP');
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setCreatingMcp(false);
      });
    }
  }

  async startMcp(
    serviceId: string,
    startMcpMutation: (serviceId: string) => Promise<{ startService: boolean }>
  ) {
    this.setErrorForService(serviceId, null);
    this.setLoadingForService(serviceId, true);

    try {
      const result = await startMcpMutation(serviceId);
      if (result.startService) {
        runInAction(() => {
          this.updateMcpStatus(serviceId, 'STARTING');
        });
      }
      return result.startService;
    } catch (error) {
      runInAction(() => {
        this.setErrorForService(serviceId, error instanceof Error ? error.message : 'Failed to start MCP');
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setLoadingForService(serviceId, false);
      });
    }
  }

  async stopMcp(
    serviceId: string,
    stopMcpMutation: (serviceId: string) => Promise<{ stopService: boolean }>
  ) {
    this.setError(null);
    this.setLoadingForService(serviceId, true);

    try {
      const result = await stopMcpMutation(serviceId);
      if (result.stopService) {
        runInAction(() => {
          this.updateMcpStatus(serviceId, 'STOPPING');
        });
      }
      return result.stopService;
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to stop MCP');
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setLoadingForService(serviceId, false);
      });
    }
  }

  // Subscription state setters
  setSubscriptionActive(active: boolean) {
    this.subscriptionActive = active;
  }

  setSubscriptionError(error: string | null) {
    this.subscriptionError = error;
  }

  // Subscription methods
  startSubscription() {
    if (this.subscriptionActive) {
      return;
    }

    this.setSubscriptionError(null);
    
    try {
      const client = getClient();
      
      const unsubscribe = client.subscribe(
        {
          query: StatusUpdatesDocument.loc?.source.body || '',
        },
        {
          next: (response: any) => {
            if (response.data?.serviceStatusUpdates) {
              const update = response.data.serviceStatusUpdates;
              
              runInAction(() => {
                this.updateMcpStatus(update.serviceId, update.status);
              });
            }
          },
          error: (error: any) => {
            runInAction(() => {
              this.setSubscriptionError(error instanceof Error ? error.message : 'Subscription error');
              this.setSubscriptionActive(false);
            });
          },
          complete: () => {
            runInAction(() => {
              this.setSubscriptionActive(false);
            });
          }
        }
      );

      this.subscriptionUnsubscribe = unsubscribe;
      this.setSubscriptionActive(true);
    } catch (error) {
      this.setSubscriptionError(error instanceof Error ? error.message : 'Failed to start subscription');
    }
  }

  stopSubscription() {
    if (!this.subscriptionActive || !this.subscriptionUnsubscribe) {
      return;
    }

    try {
      this.subscriptionUnsubscribe();
      this.subscriptionUnsubscribe = null;
      this.setSubscriptionActive(false);
      this.setSubscriptionError(null);
    } catch (error) {
      this.setSubscriptionError(error instanceof Error ? error.message : 'Failed to stop subscription');
    }
  }

  // Auto-start subscription when MCPs are loaded
  async loadMcpsWithSubscription(mcpsQuery: () => Promise<McpsQuery>) {
    await this.loadMcps(mcpsQuery);
    
    // Start subscription after successful load
    if (this.mcps.length > 0 && !this.subscriptionActive) {
      this.startSubscription();
    }
  }
}

// Create and export a singleton instance
export const mcpsStore = new McpsStore();
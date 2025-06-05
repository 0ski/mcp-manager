'use client';

import { useEffect } from 'react';
import { Flex, Heading, Card, Text, Container, Box, Spinner, Badge, Button } from "@radix-ui/themes";
import { useMcps } from '@/context';
import { observer } from 'mobx-react-lite';

const Home = observer(() => {
  const { mcpsStore, loadMcps, startMcp, stopMcp } = useMcps();

  useEffect(() => {
    // Load MCPs when component mounts
    loadMcps();
  }, [loadMcps]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RUNNING':
      case 'SUCCESS':
        return 'green';
      case 'STARTING':
      case 'DEPLOYING':
      case 'BUILDING':
        return 'blue';
      case 'STOPPING':
        return 'orange';
      case 'FAILED':
      case 'CRASHED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatEnvironmentVariables = (envVars: any) => {
    if (!envVars || typeof envVars !== 'object') return 'None';
    
    const entries = Object.entries(envVars);
    if (entries.length === 0) return 'None';
    
    return entries.map(([key, valueObj]: [string, any]) => {
      const value = valueObj?.value || 'N/A';
      return `${key}=${value}`;
    }).join(', ');
  };

  const handleStartMcp = async (serviceId: string) => {
    try {
      await startMcp(serviceId);
    } catch (error) {
      console.error('Failed to start MCP:', error);
    }
  };

  const handleStopMcp = async (serviceId: string) => {
    try {
      await stopMcp(serviceId);
    } catch (error) {
      console.error('Failed to stop MCP:', error);
    }
  };

  const isServiceLoading = (serviceId: string) => {
    return mcpsStore.getLoadingForService(serviceId);
  };

  const canStartService = (status: string) => {
    return !['RUNNING', 'STARTING', 'DEPLOYING', 'SUCCESS', 'BUILDING'].includes(status.toUpperCase());
  };

  const canStopService = (status: string) => {
    return ['RUNNING', 'STARTING', 'DEPLOYING', 'SUCCESS', 'BUILDING'].includes(status.toUpperCase());
  };

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="6">
        {/* Loading State */}
        {mcpsStore.loading && (
          <Flex justify="center" align="center" gap="3" p="6">
            <Spinner size="3" />
            <Text size="3">
              Loading MCP servers...
            </Text>
          </Flex>
        )}

        {/* Error State */}
        {mcpsStore.error && !mcpsStore.loading && (
          <Flex justify="center">
            <Card size="3" style={{ maxWidth: 600 }}>
              <Flex direction="column" gap="3" align="center">
                <Text size="4" weight="bold" color="red">
                  Error Loading MCP Servers
                </Text>
                <Text size="3" color="gray">
                  {mcpsStore.error}
                </Text>
              </Flex>
            </Card>
          </Flex>
        )}

        {/* MCP Servers List */}
        {!mcpsStore.loading && !mcpsStore.error && mcpsStore.fetchedOnce && (
          <Flex direction="column" gap="4">
            {mcpsStore.mcps.length === 0 ? (
              <Flex justify="center">
                <Card size="3" style={{ maxWidth: 600 }}>
                  <Flex direction="column" gap="3" align="center">
                    <Text size="4" weight="bold">
                      No MCP Servers Found
                    </Text>
                    <Text size="3" color="gray">
                      You haven't created any MCP servers yet.
                    </Text>
                  </Flex>
                </Card>
              </Flex>
            ) : (
              <Flex direction="column" gap="4">
                {mcpsStore.mcps.map((mcp) => (
                  <Card key={mcp.serviceId} size="3">
                    <Flex direction="column" gap="4">
                      {/* Header with name, status, and action buttons */}
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="3">
                          <Heading size="5" weight="bold">
                            {mcp.name}
                          </Heading>
                          <Badge color={getStatusColor(mcp.status)} variant="solid">
                            {mcp.status}
                          </Badge>
                        </Flex>
                        
                        {canStartService(mcp.status) ? (
                          <Button
                            variant="soft"
                            color="green"
                            size="2"
                            disabled={isServiceLoading(mcp.serviceId)}
                            onClick={() => handleStartMcp(mcp.serviceId)}
                          >
                            {isServiceLoading(mcp.serviceId) ? (
                              <Spinner size="1" />
                            ) : (
                              'Start'
                            )}
                          </Button>
                        ) : canStopService(mcp.status) ? (
                          <Button
                            variant="soft"
                            color="red"
                            size="2"
                            disabled={isServiceLoading(mcp.serviceId)}
                            onClick={() => handleStopMcp(mcp.serviceId)}
                          >
                            {isServiceLoading(mcp.serviceId) ? (
                              <Spinner size="1" />
                            ) : (
                              'Stop'
                            )}
                          </Button>
                        ) : null}
                      </Flex>

                      {/* Server Details */}
                      <Flex direction="column" gap="3">
                        <Flex direction="column" gap="1">
                          <Text size="2" weight="bold" color="gray">
                            Service ID
                          </Text>
                          <Text size="2" style={{ fontFamily: 'monospace' }}>
                            {mcp.serviceId}
                          </Text>
                        </Flex>

                        <Flex direction="column" gap="1">
                          <Text size="2" weight="bold" color="gray">
                            GitHub Repository
                          </Text>
                          <Text size="2">
                            {mcp.githubUrl || 'N/A'}
                          </Text>
                        </Flex>

                        <Flex direction="row" gap="6">
                          <Flex direction="column" gap="1">
                            <Text size="2" weight="bold" color="gray">
                              Port
                            </Text>
                            <Text size="2">
                              {mcp.portNumber || 'N/A'}
                            </Text>
                          </Flex>

                          <Flex direction="column" gap="1">
                            <Text size="2" weight="bold" color="gray">
                              Domain
                            </Text>
                            <Text size="2">
                              {mcp.domain || 'N/A'}
                            </Text>
                          </Flex>
                        </Flex>

                        <Flex direction="column" gap="1">
                          <Text size="2" weight="bold" color="gray">
                            Environment Variables
                          </Text>
                          <Text size="2" style={{ 
                            fontFamily: 'monospace',
                            wordBreak: 'break-all'
                          }}>
                            {formatEnvironmentVariables(mcp.environmentVariables)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Container>
  );
});

export default Home;

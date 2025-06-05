"use client";

import { useState } from 'react';
import { AlertDialog, Button, Flex, TextField, Text, Spinner } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMcps } from '@/context';
import { observer } from 'mobx-react-lite';

interface EnvironmentVariable {
  key: string;
  value: string;
}

export const AddNewMCP = observer(() => {
  const { mcpsStore, createMcp } = useMcps();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    githubUrl: '',
    portNumber: 3000
  });
  const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>([
    { key: '', value: '' }
  ]);

  const handleAddEnvVar = () => {
    setEnvironmentVariables([...environmentVariables, { key: '', value: '' }]);
  };

  const handleRemoveEnvVar = (index: number) => {
    if (environmentVariables.length > 1) {
      setEnvironmentVariables(environmentVariables.filter((_, i) => i !== index));
    }
  };

  const handleEnvVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...environmentVariables];
    updated[index][field] = value;
    setEnvironmentVariables(updated);
  };

  const handleSubmit = async () => {
    try {
      // Convert environment variables to the required format
      const envVarsObject: Record<string, { value: string }> = {};
      environmentVariables.forEach(({ key, value }) => {
        if (key.trim() && value.trim()) {
          envVarsObject[key.trim()] = { value: value.trim() };
        }
      });

      await createMcp({
        name: formData.name,
        githubUrl: formData.githubUrl,
        environmentVariables: envVarsObject,
        portNumber: formData.portNumber
      });

      // Reset form and close dialog
      setFormData({ name: '', githubUrl: '', portNumber: 3000 });
      setEnvironmentVariables([{ key: '', value: '' }]);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create MCP:', error);
    }
  };

  const isFormValid = formData.name.trim() && formData.githubUrl.trim() && formData.portNumber > 0;

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        <Button variant="soft">
          <PlusIcon />
          Add MCP
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="600px">
        <AlertDialog.Title>Add New MCP Server</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Create a new Model Context Protocol server from a GitHub repository.
        </AlertDialog.Description>

        <Flex direction="column" gap="4" mt="4">
          {/* Name Field */}
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Name</Text>
            <TextField.Root
              placeholder="Enter MCP server name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Flex>

          {/* GitHub URL Field */}
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">GitHub Repository URL</Text>
            <TextField.Root
              placeholder="username/repository"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </Flex>

          {/* Port Number Field */}
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Port Number</Text>
            <TextField.Root
              type="number"
              placeholder="3000"
              value={formData.portNumber.toString()}
              onChange={(e) => setFormData({ ...formData, portNumber: parseInt(e.target.value) || 0 })}
            />
          </Flex>

          {/* Environment Variables */}
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Text size="2" weight="bold">Environment Variables</Text>
              <Button size="1" variant="soft" onClick={handleAddEnvVar}>
                Add Variable
              </Button>
            </Flex>
            {environmentVariables.map((envVar, index) => (
              <Flex key={index} gap="2" align="center">
                <TextField.Root
                  placeholder="Key"
                  value={envVar.key}
                  onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                  style={{ flex: 1 }}
                />
                <TextField.Root
                  placeholder="Value"
                  value={envVar.value}
                  onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                  style={{ flex: 1 }}
                />
                {environmentVariables.length > 1 && (
                  <Button
                    size="1"
                    variant="soft"
                    color="red"
                    onClick={() => handleRemoveEnvVar(index)}
                  >
                    Remove
                  </Button>
                )}
              </Flex>
            ))}
          </Flex>

          {/* Error Display */}
          {mcpsStore.creatingMcpError && (
            <Text size="2" color="red">
              Error: {mcpsStore.creatingMcpError}
            </Text>
          )}
        </Flex>

        <Flex gap="3" mt="6" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" disabled={mcpsStore.creatingMcp}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <Button 
            variant="solid" 
            onClick={handleSubmit}
            disabled={!isFormValid || mcpsStore.creatingMcp}
          >
            {mcpsStore.creatingMcp ? (
              <Flex align="center" gap="2">
                <Spinner size="1" />
                Creating...
              </Flex>
            ) : (
              'Create MCP Server'
            )}
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
});
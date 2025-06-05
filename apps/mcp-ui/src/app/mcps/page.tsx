'use client';

import { useState, useEffect } from 'react';
import { Flex, Heading, Card, Text, Container, Box, Separator } from "@radix-ui/themes";
import { config } from "../../config";

export default function McpsPage() {
  const [configData, setConfigData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(config.NEXT_PUBLIC_CONFIG_PATH);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.text();
        setConfigData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="6">
        {/* Main Content */}
        <Flex justify="center">
          <Card size="3" style={{ minWidth: '90%', maxWidth: 1000 }}>
            <Flex direction="column" gap="4">
              <Heading size="6">
                Configuration File
              </Heading>
              
              <Separator size="4" />
              
              {loading && (
                <Text size="3" color="blue">
                  Loading configuration...
                </Text>
              )}
              
              {error && (
                <Text size="3" color="red">
                  Error: {error}
                </Text>
              )}
              
              {!loading && !error && (
                <Box>
                  <pre style={{
                    background: 'var(--gray-2)',
                    padding: '16px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    maxHeight: '600px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    border: '1px solid var(--gray-6)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {configData}
                  </pre>
                </Box>
              )}
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Container>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { Button, Flex, Heading, Link, Section } from "@radix-ui/themes";
import { AddNewMCP } from "./addNewMcp";

export function ClientHeader() {
  const pathname = usePathname();
  const shouldShowButtons = pathname !== '/mcps';

  return (
    <Section mb="4" pt="3" pr="2" pb="4" pl="2" top="0" style={{borderBottom: "1px solid var(--base-card-classic-border-color)", position: "sticky", zIndex: 1000, backgroundColor: "var(--gray-1)"}}>
      <Flex justify="between" align="center">
        <Link href="/" color="gray" style={{ textDecoration: "none" }}>
          <Heading size="8" weight="bold" align="left">MCP Manager</Heading>
        </Link>
        {shouldShowButtons && (
          <Flex justify="between" align="center">
            <AddNewMCP/>
            <Link href="/mcps">
              <Button variant="outline" size="2" style={{ marginLeft: "8px" }}>Config</Button>
            </Link>
          </Flex>
        )}
      </Flex>
    </Section>
  );
}

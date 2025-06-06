import { createClient } from 'graphql-ws'
import { config } from '../config';

let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!client) {
    client = createClient({
      url: `${config.NEXT_PUBLIC_API_WS}/graphql`
    });
  }
  return client;
}
getClient();
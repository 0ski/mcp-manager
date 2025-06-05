import fastify from 'fastify'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = fastify();

server.post('/', async (request, reply) => {
  console.log('Received webhook request:', request.body);
  reply.status(200);
});

server.get('/', async (request, reply) => {
  console.log('Received webhook GET request:', request.body);
  reply.status(200);
});

server.options('/', async (request, reply) => {
  console.log('Received webhook request:', request.body);
  reply.status(204);
});

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
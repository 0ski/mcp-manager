import fastify from 'fastify'
import type { IncomingMessage } from 'http';
import MQEmitterRedis from 'mqemitter-redis';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3002;

const server = fastify();

console.log(`Connecting to Redis at ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);
const mqemitter = MQEmitterRedis({
  ...(process.env.REDIS_USER ? {username: process.env.REDIS_USER} : {}),
  ...(process.env.REDIS_PASSWORD ? {password: process.env.REDIS_PASSWORD} : {}),
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  host: process.env.REDIS_HOST || 'localhost',
});
console.log(`Connected to Redis.`);

console.log(`Setting up server.`);
server.register((fastify, opts) => {
  console.log(`Setting up parser.`);
  fastify.addContentTypeParser('application/json', function (request, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.get('/', async (request, reply) => {
    reply.status(200).send('Webhook Handler is running');
  });

  fastify.post('/', async (request, reply) => {
    if (
      typeof request.body === 'object' &&
      request.body !== null &&
      'service' in request.body &&
      typeof request.body.service === 'object' &&
      request.body.service !== null &&
      'id' in request.body.service &&
      'status' in request.body
  ) {
      const serviceId = request.body.service.id;
      const status = request.body.status;
      console.log(`Service ID: ${serviceId}, Status: ${status}`);

      // Emit the event to the message queue
      mqemitter.emit(
        {
          topic: `service.update`,
          serviceId,
          status,
        }
      );
    }
    reply.status(200);
  });
});

console.log(`Starting server. Port: ${port}`);
server.listen({ host: '::', port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

function jsonParser(payload: IncomingMessage, arg1: (err: any, body: any) => void) {
  let data = '';
  payload.on('data', chunk => {
    data += chunk;
  });
  payload.on('end', () => {
    try {
      const body = JSON.parse(data);
      arg1(null, body);
    } catch (err) {
      arg1(err, null);
    }
  });
  payload.on('error', err => {
    arg1(err, null);
  });
  return payload;
}

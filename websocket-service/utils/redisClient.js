const { createClient } = require('redis');

const redisClient = createClient({ url: 'redis://redis:6379' });

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

module.exports = { redisClient };

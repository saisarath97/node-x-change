const redisMock = require('redis-mock');
const { handleOrderBookData } = require('../index.js');  // Adjust the import according to the file structure

describe('handleOrderBookData', () => {
  let redisClient;

  beforeAll(() => {
    redisClient = redisMock.createClient();
  });

  it('should update the order book and store it in Redis', async () => {
    const data = {
      symbol: 'BTC_USDT',
      type: 'depth',
      data: {
        bids: [['50000', '1'], ['49000', '2']],
        asks: [['51000', '1'], ['52000', '2']],
      },
    };

    await handleOrderBookData(data);

    const result = await redisClient.get(`${data.symbol}_${data.type}`);
    const storedData = JSON.parse(result);

    expect(storedData.data.bids.length).toBeLessThanOrEqual(100);
    expect(storedData.data.asks.length).toBeLessThanOrEqual(100);
  });
});

const { handleKlineData } = require('./app');  // Adjust the import

describe('handleKlineData', () => {
  it('should update the kline data and store it in Redis', async () => {
    const data = {
      symbol: 'BTC_USDT',
      type: 'kline',
        data: {
        "startTime": 1726495620000,
        "closeTime": 1726495679999,
        "interval": "1m",
        "openPrice": "139.73000000",
        "closePrice": "139.65000000",
        "highPrice": "139.78000000",
        "lowPrice": "139.60000000",
        "volume": "74.56400000"
    },
    };

    await handleKlineData(data);

    const result = await redisClient.get(`${data.symbol}_${data.type}`);
    const storedData = JSON.parse(result);

    expect(storedData.data.length).toBeLessThanOrEqual(200);
  });
});

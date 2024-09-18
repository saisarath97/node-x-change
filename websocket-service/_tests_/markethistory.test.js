const { handleMarketHistoryData } = require('../index.js');  // Adjust the import

describe('handleMarketHistoryData', () => {
  it('should update the market history and store it in Redis', async () => {
    const data = {
      symbol: 'BTC_USDT',
      type: 'deals',
        data: {
        "symbol": "AAVE_USDT",
        "eventType": "aggTrade",
        "eventTime": "2024-09-16T14:11:17.014Z",
        "aggregateTradeId": 107204062,
        "price": 139.83, // price
        "quantity": 0.044, // quantity
        "firstTradeId": 142856346,
        "lastTradeId": 142856346,
        "tradeTime": "2024-09-16T14:11:17.014Z", // trade time
        "isMarketMaker": true,
        "ignoreField": true
    },
    };

    await handleMarketHistoryData(data);

    const result = await redisClient.get(`${data.symbol}_${data.type}`);
    const storedData = JSON.parse(result);

    expect(storedData.data.length).toBeLessThanOrEqual(100);
  });
});

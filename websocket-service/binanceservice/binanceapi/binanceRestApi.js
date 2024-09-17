const { getOrderBook } = require('./binanceApiService');



const BinanceRestApi = async (symbol, handleData) => {
    try {
        const limit = 100;
        getOrderBook(symbol, limit, handleData);
      } catch (error) {
        console.error('Error:', error);
      }
  };

module.exports = BinanceRestApi;
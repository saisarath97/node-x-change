// formatresponse.js

const StreamType  = require('../../appConfig/enum.js');

/**
 * Maps Binance WebSocket order book data to the standard format.
 * @param {Object} data - The WebSocket message data from Binance.
 * @param {string} type - The type of stream (e.g., 'depth', 'ticker', 'kline_1m').
 * @returns {Object} - The standardized data object.
 */
const mapToOrderBook = (data, symbol, type) => {
  let standardizedData = {
      symbol: data.s || symbol,
      data: {
        bids: [],
        asks: [],
      },
      type: type
  };
  standardizedData.data.bids = data.bids ? data.bids.map(([price, quantity]) => [price, quantity]) : [];
  standardizedData.data.asks = data.asks ? data.asks.map(([price, quantity]) => [price, quantity]) : [];
  return standardizedData;
}
  
  /**
   * Maps Binance WebSocket kline data to the standard format.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} type - The type of stream (e.g., 'kline_1m').
   * @returns {Object} - The standardized data object.
   */
  const mapToStandardKlineFormat = (data, symbol, type) => {
      return {
        symbol: symbol,
        data:{
        startTime: data.k?.t,
        closeTime: data.k?.T,
        interval: data.k?.i,
        openPrice: data.k?.o,
        closePrice: data.k?.c,
        highPrice: data.k?.h,
        lowPrice: data.k?.l,
        volume: data.k?.v,
        },
        type
      };
  };
  
    /**
   * Maps Binance WebSocket deals (market history) data to the standard format.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} type - The type of stream (e.g., deals).
   * @returns {Object} - The standardized data object.
   */
    const mapDealsData = (rawData, symbol, type) => {
      return {
        symbol: symbol,                  // Symbol, e.g., "BNBBTC"
        data:{
        symbol: symbol,                  // Symbol, e.g., "BNBBTC"
        eventType: rawData.e,               // Event type, e.g., "aggTrade"
        eventTime: new Date(rawData.E),     // Convert event time to a readable date format
        aggregateTradeId: rawData.a,        // Aggregate trade ID
        price: parseFloat(rawData.p),       // Price of the trade
        quantity: parseFloat(rawData.q),    // Quantity traded
        firstTradeId: rawData.f,            // First trade ID in this aggregate
        lastTradeId: rawData.l,             // Last trade ID in this aggregate
        tradeTime: new Date(rawData.T),     // Convert trade time to a readable date format
        isMarketMaker: rawData.m,           // Boolean indicating if the buyer is the market maker
        ignoreField: rawData.M,
        },                                // Ignore this field, not used
        type
      };
  };

  /**
   * Maps Binance WebSocket ticker data to the standard format.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} type - The type of stream (e.g., 'ticker_1h').
   * @returns {Object} - The standardized data object.
   */
  const mapTickerData = (data, symbol, type) => {
    let standardizedData =  {
      symbol,
      data:{
        eventType: data.e,                 // Event type
        eventTime: new Date(data.E),       // Event time in human-readable format
        symbol: symbol,                    // Trading symbol
        priceChange: data.p,               // Price change
        priceChangePercent: data.P,        // Price change percentage
        weightedAvgPrice: data.w,          // Weighted average price
        firstTradePrice: data.x,           // Price of the first trade before the 24hr window
        lastPrice: data.c,                 // Last trade price
        lastQuantity: data.Q,              // Quantity of the last trade
        bestBidPrice: data.b,              // Best bid price
        bestBidQuantity: data.B,           // Best bid quantity
        bestAskPrice: data.a,              // Best ask price
        bestAskQuantity: data.A,           // Best ask quantity
        openPrice: data.o,                 // Opening price in the last 24 hours
        highPrice: data.h,                 // Highest price in the last 24 hours
        lowPrice: data.l,                  // Lowest price in the last 24 hours
        baseAssetVolume: data.v,           // Total traded base asset volume
        quoteAssetVolume: data.q,          // Total traded quote asset volume
        statsOpenTime: new Date(data.O),   // Statistics open time
        statsCloseTime: new Date(data.C),  // Statistics close time
        firstTradeId: data.F,              // First trade ID
        lastTradeId: data.L,               // Last trade ID
        totalTrades: data.n,                // Total number of trades
        },
        type
    };
    return standardizedData;
  };
  
  /**
   * Formats the WebSocket response based on the stream type.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} symbol - The trading symbol.
   * @param {string} type - The type of stream (e.g., 'depth', 'ticker', 'kline_1m').
   * @returns {Object} - The standardized data object.
   */
  const formatResponse = (data, symbol, type) => {
    switch (type) {
      case StreamType.DEPTH:
        return mapToOrderBook(data, symbol, type);
      case StreamType.TICKER:
        return mapTickerData(data, symbol, type);
      case StreamType.DEALS:
        return mapDealsData(data, symbol, type);
      default:
        if (type.startsWith(StreamType.KLINE)) {
          return mapToStandardKlineFormat(data, symbol, type);
        }
        return null;
    }
  };
  
  module.exports = formatResponse;
  
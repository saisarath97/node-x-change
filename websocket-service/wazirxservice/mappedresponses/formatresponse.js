// formatresponse.js

/**
 * Maps Binance WebSocket order book data to the standard format.
 * @param {Object} data - The WebSocket message data from Binance.
 * @param {string} type - The type of stream (e.g., 'depth', 'ticker', 'kline_1m').
 * @returns {Object} - The standardized data object.
 */
const mapToStandardFormat = (data, symbol, type, exchange) => {
  let standardizedData = {
      symbol: data.s || symbol,
      bids: [],
      asks: [],
      type: type
  };
  // if (exchange === 'binance') {
      // standardizedData.bids = data.bids ? data.bids.map(([price, quantity]) => [price, quantity]) : [];
      // standardizedData.asks = data.asks ? data.asks.map(([price, quantity]) => [price, quantity]) : [];
  // } else if (exchange === 'wazirx') {
    // Check if bids and asks are arrays before mapping
    standardizedData.bids = Array.isArray(data.data.b) ? data.data.b.map(([price, quantity]) => [price, quantity]) : [];
    standardizedData.asks = Array.isArray(data.data.a) ? data.data.a.map(([price, quantity]) => [price, quantity]) : [];

  // }

  return standardizedData;
}
  
  /**
   * Maps Binance WebSocket kline data to the standard format.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} type - The type of stream (e.g., 'kline_1m').
   * @returns {Object} - The standardized data object.
   */
  const mapToStandardKlineFormat = (data, symbol, type, exchange) => {
  //   if (exchange === 'binance') {
  //     return {
  //       symbol: data.s,
  //       startTime: data.k?.t,
  //       closeTime: data.k?.T,
  //       interval: data.k?.i,
  //       openPrice: data.k?.o,
  //       closePrice: data.k?.c,
  //       highPrice: data.k?.h,
  //       lowPrice: data.k?.l,
  //       volume: data.k?.v,
  //       type: 'kline'
  //     };
  // } else if (exchange === 'wazirx') {
    const klineData = data.data; // WazirX Kline data is nested inside the "data" field
    return {
      symbol: klineData.s?.toUpperCase(), // Convert to uppercase to match Binance format
      startTime: klineData?.t,
      closeTime: klineData?.T,
      interval: klineData?.i,
      openPrice: klineData?.o,
      closePrice: klineData?.c,
      highPrice: klineData?.h,
      lowPrice: klineData?.l,
      volume: klineData?.v,
      type: 'kline'
    };

  // }
  };
  
  /**
   * Maps Binance WebSocket ticker data to the standard format.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} type - The type of stream (e.g., 'ticker_1h').
   * @returns {Object} - The standardized data object.
   */
  const mapTickerData = (data, symbol, type, exchange) => {
    let standardizedData = {
      eventType: type,
      eventTime: null,
      symbol: null,
      openPrice: null,
      closePrice: null,
      highPrice: null,
      lowPrice: null,
      baseAssetVolume: null,
      quoteAssetVolume: null,
      bestBidPrice: null,
      bestBidQuantity: null,
      bestAskPrice: null,
      bestAskQuantity: null,
      interval: null,
      klineStartTime: null,
      klineCloseTime: null,
    };
  
    // if (exchange === 'binance') {
    //   // Format for Binance
    //   standardizedData.eventTime = data.E;
    //   standardizedData.symbol = data.s;
    //   standardizedData.openPrice = data.o || (data.k && data.k.o);
    //   standardizedData.closePrice = data.c || (data.k && data.k.c);
    //   standardizedData.highPrice = data.h || (data.k && data.k.h);
    //   standardizedData.lowPrice = data.l || (data.k && data.k.l);
    //   standardizedData.baseAssetVolume = data.v || (data.k && data.k.v);
    //   standardizedData.quoteAssetVolume = data.q || (data.k && data.k.q);
    //   standardizedData.bestBidPrice = data.b;
    //   standardizedData.bestBidQuantity = data.B;
    //   standardizedData.bestAskPrice = data.a;
    //   standardizedData.bestAskQuantity = data.A;
    //   standardizedData.interval = data.k ? data.k.i : null;
    //   standardizedData.klineStartTime = data.k ? data.k.t : null;
    //   standardizedData.klineCloseTime = data.k ? data.k.T : null;
    // } else if (exchange === 'wazirx') {
      // Format for WazirX
      const wazirxData = data.data[0];
      standardizedData.eventTime = wazirxData.E;
      standardizedData.symbol = wazirxData.s.toUpperCase();
      standardizedData.openPrice = wazirxData.o;
      standardizedData.closePrice = wazirxData.c;
      standardizedData.highPrice = wazirxData.h;
      standardizedData.lowPrice = wazirxData.l;
      standardizedData.baseAssetVolume = wazirxData.q;
      standardizedData.quoteAssetVolume = "0.0"; // WazirX does not provide this field
      standardizedData.bestBidPrice = wazirxData.b;
      standardizedData.bestBidQuantity = "0.0"; // WazirX does not provide this field
      standardizedData.bestAskPrice = wazirxData.a;
      standardizedData.bestAskQuantity = "0.0"; // WazirX does not provide this field
      standardizedData.interval = wazirxData.i || null; // Interval if applicable
      standardizedData.klineStartTime = wazirxData.t || null;
      standardizedData.klineCloseTime = wazirxData.T || null;
    // }
  
    return standardizedData;
  };
  
  /**
   * Formats the WebSocket response based on the stream type.
   * @param {Object} data - The WebSocket message data from Binance.
   * @param {string} symbol - The trading symbol.
   * @param {string} exchange - The exchange name ('binance').
   * @param {string} type - The type of stream (e.g., 'depth', 'ticker', 'kline_1m').
   * @returns {Object} - The standardized data object.
   */
  const formatResponse = (data, symbol, exchange, type) => {
    switch (type) {
      case 'depth':
        return mapToStandardFormat(data, symbol, type, exchange);
      case 'ticker':
        return mapTickerData(data, symbol, type, exchange);
      default:
        if (type.startsWith('kline_')) {
          return mapToStandardKlineFormat(data, symbol, type, exchange);
        }
        return null;
    }
  };
  
  module.exports = formatResponse;
  
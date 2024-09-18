// src/binanceConfig.js
const StreamType  = require('../appConfig/enum.js');

const baseUrl = 'wss://stream.binance.com:9443';
const binanceApiUrl = 'https://api.binance.com';

const klineIntervals = [
  '1s', '1m', '3m', '5m', '15m', '30m',
  '1h', '2h', '4h', '6h', '8h', '12h',
  '1d', '3d', '1w', '1M'
];

const streamTypes = [
  { type: StreamType.DEPTH , url: `${baseUrl}/ws/{symbol}@depth20@1000ms` },
  { type: StreamType.TICKER, url: `${baseUrl}/ws/{symbol}@ticker` },
  { type: StreamType.DEALS, url: `${baseUrl}/ws/{symbol}@aggTrade`}
  // Additional streams can be added here
];

// Add each Kline interval as a separate stream type
klineIntervals.forEach((interval) => {
  streamTypes.push({
    type: `kline_${interval}`,
    url: `${baseUrl}/ws/{symbol}@kline_${interval}`
  });
});

module.exports = { streamTypes };

// src/binanceConfig.js

const baseUrl = 'wss://stream.wazirx.com/stream';
const klineIntervals = [
  '1s', '1m', '3m', '5m', '15m', '30m',
  '1h', '2h', '4h', '6h', '8h', '12h',
  '1d', '3d', '1w', '1M'
];

const streamTypes = [
//   { type: 'depth', url: `{symbol}@depth20@100ms` },
//   { type: 'ticker', url: `!ticker@arr` },
  // Additional streams can be added here
];

// Add each Kline interval as a separate stream type
klineIntervals.forEach((interval) => {
  streamTypes.push({
    type: `kline_${interval}`,
    url: `{symbol}@kline_${interval}`
  });
});

module.exports = { streamTypes, baseUrl };

// binance websocket connections and data handling

const WebSocket = require('ws');
const { streamTypes } = require('../binanceconfig.js');
const formatResponse = require('../mappedresponses/formatresponse.js');
const BinanceRestApi = require('../binanceapi/binanceRestApi.js')

const connectToStream = (symbol, stream, handleData) => {
  const ws = new WebSocket(stream.url.replace('{symbol}', symbol.toLowerCase().replace('_', '')));

  ws.on('open', () => {
    console.log(`Binance WebSocket connection opened for ${symbol} (${stream.type})`);
    startPingPong(ws);
  });

  ws.on('message', (data) => {
    var data = JSON.parse(data);
    const standardizedData = formatResponse(data, symbol, stream.type);
    handleData(standardizedData, symbol, stream.type);
  });

  ws.on('error', (error) => {
    console.error(`Binance WebSocket error (${stream.type}):`, error);
  });

  ws.on('close', () => {
    console.log(`Binance WebSocket connection closed for ${symbol} (${stream.type})`);
    clearInterval(pingInterval);
    setTimeout(() => connectToStream(symbol, stream, handleData), 5000); // Reconnect
  });
};

// Ping-pong mechanism to keep the connection alive
let pingInterval;
const startPingPong = (ws) => {
  pingInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Sending ping to Binance');
      ws.send(JSON.stringify({ event: 'ping' }));
    }
  }, 30000);
};

const BinanceWebSocket = (symbol, handleData) => {
  streamTypes.forEach((stream) => {
    if(stream.type == 'depth'){
      BinanceRestApi(symbol, handleData)
    }
    connectToStream(symbol, stream, handleData);
  });
};

module.exports = BinanceWebSocket;

const WebSocket = require('ws');
const { streamTypes, baseUrl } = require('../wazirxconfig.js');
const formatResponse = require('../mappedresponses/formatresponse.js');

const connectToStream = (symbol, stream, handleData) => {
  const ws = new WebSocket(baseUrl);

  ws.on('open', () => {
    ws.send(JSON.stringify({
        event: 'subscribe',
        streams: [stream.url], // Change stream level or interval as needed
        })
    );
    console.log(`Wazirx WebSocket connection opened for ${symbol} (${stream.type}) (${stream.url})`);
    startPingPong(ws);
  });

  ws.on('message', (data) => {
    var data = JSON.parse(data);
    console.log("wazirx data ", data);
    const standardizedData = formatResponse(data, symbol, 'wazirx', stream.type);
    handleData(standardizedData, symbol, 'wazirx', stream.type);
  });

  ws.on('error', (error) => {
    console.error(`Wazirx WebSocket error (${stream.type}):`, error);
  });

  ws.on('close', () => {
    console.log(`Wazirx WebSocket connection closed for ${symbol} (${stream.type})`);
    clearInterval(pingInterval);
    setTimeout(() => connectToStream(symbol, stream, handleData), 5000); // Reconnect
  });
};

// Ping-pong mechanism to keep the connection alive
let pingInterval;
const startPingPong = (ws) => {
  pingInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Sending ping to Wazirx');
      ws.send(JSON.stringify({ event: 'ping' }));
    }
  }, 30000);
};

const WazirxWebSocket = (symbol, handleData) => {
  streamTypes.forEach((stream) => {
    if(stream.url.includes("{symbol}")){
        stream.url = stream.url.replace('{symbol}', symbol.toLowerCase().replace('_', ''));
    }
    connectToStream(symbol, stream, handleData);
  });
};

module.exports = WazirxWebSocket;

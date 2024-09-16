const WebSocket = require('ws');
const { redisClient } = require('../utils/redisClient.js');

const clients = new Map(); // Map to track client subscriptions


let wss;
const createWebSocketServer = (server, websocketPort) => {
 wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clients.set(ws, new Set());
    ws.send('Welcome to new websocket server');
    
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      handleSubscribe(ws, data);
      console.log(`Request from connection ${message}`);
    });
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected');
    });
  });

  server.listen(websocketPort, () => {
    console.log(`WebSocket server is listening on http://localhost:${websocketPort}`);
  });
};

// handle subscription and channels to the list for a connection
const handleSubscribe = async (ws, data) => {
  if (data.action === 'subscribe') {
    const channel = data.channel;
    const symbol = data.symbol;
    if (channel) {
      clients.get(ws).add(`${symbol}_${channel}`);
      console.log(`Client subscribed to ${symbol} (${channel})`);
    // Fetch data from Redis and send the initial response
      await sendInitialData(ws, symbol, channel);
    }
  } else if (data.action === 'unsubscribe') {
    const channel = data.channel;
    const symbol = data.symbol;
    if (channel) {
      clients.get(ws).delete(`${symbol}_${channel}`);
      console.log(`Client unsubscribed from ${symbol} (${channel})`);
    }
  }
};

// Send the initial 100 asks and bids for orderbook data
const sendInitialData = async (ws, symbol, channel) => {
  try {
    const redisKey = `${symbol}_${channel}`;
    const redisData = await redisClient.get(redisKey);

    if (redisData) {
      const parsedData = JSON.parse(redisData);
      console.log("redis data ", parsedData)

      ws.send(JSON.stringify({
        symbol:parsedData.symbol,
        data:parsedData.data,
        type: parsedData.type
      }));

      console.log(`Sent initial 100 asks and bids for ${symbol} (${channel})`);
    } else {
      ws.send(JSON.stringify({ type: 'error', message: 'No order book data available' }));
    }
  } catch (err) {
    console.error('Redis get error:', err);
  }
};


// Send data from Redis for other channels
const sendDataFromRedis = async (ws, symbol, channel) => {
  try {
    const redisKey = `${symbol}_${channel}`;
    const data = await redisClient.get(redisKey);

    if (data) {
      ws.send(JSON.stringify({
        type: 'initial_data',
        symbol,
        channel,
        data: JSON.parse(data)
      }));

      console.log(`Sent initial data for ${symbol} (${channel})`);
    } else {
      ws.send(JSON.stringify({ type: 'error', message: `No data available for ${symbol} (${channel})` }));
    }
  } catch (err) {
    console.error('Redis get error:', err);
  }
};

// Broadcast to connected clients
const broadcastData = (symbol, streamType, jsonData) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && clients.get(client).has(`${symbol}_${streamType}`)) {
      client.send(JSON.stringify(jsonData));
    }
  });
};

module.exports = { createWebSocketServer, broadcastData };
